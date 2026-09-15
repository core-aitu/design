#!/usr/bin/env python3
"""
logo/export_logos.py

Programmatically export logo groups ('box', 'line') from logo_inkscape.svg
with specified color combinations into standalone SVG files in the project root /export directory.

Supported Platforms:
- Windows
- Linux

Export Modes:
1. Inkscape CLI: If Inkscape is installed on Windows or Linux, uses its CLI engine.
2. Pure Python: If Inkscape is not installed, parses and exports using Python's standard library.
"""

import argparse
import copy
import os
import re
import shutil
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

# Paths relative to this script location
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DEFAULT_INPUT = SCRIPT_DIR / "logo_inkscape.svg"
DEFAULT_OUTPUT = PROJECT_ROOT / "export"

# XML Namespaces used in Inkscape SVG documents
SVG_NS = "http://www.w3.org/2000/svg"
INKSCAPE_NS = "http://www.inkscape.org/namespaces/inkscape"
SODIPODI_NS = "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"

ET.register_namespace("", SVG_NS)
ET.register_namespace("inkscape", INKSCAPE_NS)
ET.register_namespace("sodipodi", SODIPODI_NS)

# Default allowed color pairings: (whole_color, background_color)
# Colors only pair with white, plus black/white pairs, and all colors on transparent background.
DEFAULT_COLOR_PAIRS = [
    # Transparent backgrounds (all colored logos)
    ("white", "transparent"),
    ("black", "transparent"),
    ("green", "transparent"),
    ("orange", "transparent"),
    ("purple", "transparent"),
    # Colored logo on white background
    ("black", "white"),
    ("green", "white"),
    ("orange", "white"),
    ("purple", "white"),
    # White logo on colored / black background
    ("white", "black"),
    ("white", "green"),
    ("white", "orange"),
    ("white", "purple"),
]


def check_os_support():
    """
    Validate that the current operating system is Windows or Linux.
    Raises OSError if run on any other platform (e.g. macOS).
    """
    if sys.platform.startswith("win"):
        return "windows"
    elif sys.platform.startswith("linux"):
        return "linux"
    else:
        raise OSError(
            f"Unsupported operating system '{sys.platform}'. "
            "This script only supports Windows and Linux."
        )


def find_inkscape_path(os_type):
    """
    Locate Inkscape executable based on the operating system.
    Returns path string if found, else None.
    """
    # Check system PATH first
    path = shutil.which("inkscape")
    if path:
        return path

    if os_type == "windows":
        candidates = [
            r"C:\Program Files\Inkscape\bin\inkscape.exe",
            r"C:\Program Files\Inkscape\inkscape.exe",
            r"C:\Program Files (x86)\Inkscape\bin\inkscape.exe",
            r"C:\Program Files (x86)\Inkscape\inkscape.exe",
            os.path.expanduser(r"~\AppData\Local\Programs\Inkscape\bin\inkscape.exe"),
            os.path.expanduser(r"~\AppData\Local\Programs\Inkscape\inkscape.exe"),
        ]
    elif os_type == "linux":
        candidates = [
            "/usr/bin/inkscape",
            "/usr/local/bin/inkscape",
            "/snap/bin/inkscape",
            "/var/lib/flatpak/exports/bin/org.inkscape.Inkscape",
            os.path.expanduser("~/.local/bin/inkscape"),
        ]
    else:
        candidates = []

    for c in candidates:
        if os.path.isfile(c):
            return c

    return None


def get_inkscape_label(elem):
    """Retrieve the human-readable inkscape:label or id of an XML element."""
    return elem.attrib.get(f"{{{INKSCAPE_NS}}}label") or elem.attrib.get("id") or ""


def extract_colors(root):
    """
    Dynamically extract color swatches from the 'colors' group.
    Returns a dict mapping color name (e.g., 'white') to hex string (e.g., '#f2f2f2').
    """
    colors = {}
    colors_group = None

    for elem in root.iter():
        if get_inkscape_label(elem) == "colors":
            colors_group = elem
            break

    if colors_group is None:
        raise ValueError("Could not find group with inkscape:label='colors' in SVG.")

    for child in colors_group:
        label = get_inkscape_label(child)
        color_name = label.removeprefix("color_").strip().lower()
        if not color_name:
            continue

        style = child.attrib.get("style", "")
        fill_match = re.search(r"fill:\s*(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)", style)
        if fill_match:
            hex_val = fill_match.group(1).lower()
            colors[color_name] = hex_val
        elif "fill" in child.attrib:
            colors[color_name] = child.attrib["fill"].lower()

    return colors


def find_group_by_label(root, target_label):
    """Find a group (<g>) matching the given inkscape:label."""
    for elem in root.iter():
        tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
        if tag == "g" and get_inkscape_label(elem) == target_label:
            return elem
    return None


def get_group_bounds_and_layers(group_elem):
    """
    Inspect a logo group ('box' or 'line') to locate:
    - background element (<rect inkscape:label="background">)
    - whole element (<g inkscape:label="whole">)
    - origin (x, y) and dimensions (width, height)
    """
    bg_elem = None
    whole_elem = None

    for child in group_elem:
        label = get_inkscape_label(child)
        if label == "background":
            bg_elem = child
        elif label == "whole":
            whole_elem = child

    if bg_elem is None:
        raise ValueError(f"Group '{get_inkscape_label(group_elem)}' has no 'background' layer.")
    if whole_elem is None:
        raise ValueError(f"Group '{get_inkscape_label(group_elem)}' has no 'whole' layer.")

    x = float(bg_elem.attrib.get("x", 0))
    y = float(bg_elem.attrib.get("y", 0))
    width = float(bg_elem.attrib.get("width", 0))
    height = float(bg_elem.attrib.get("height", 0))

    return {
        "x": x,
        "y": y,
        "width": width,
        "height": height,
        "bg_elem": bg_elem,
        "whole_elem": whole_elem,
    }


def update_style_fill(elem, new_fill):
    """Update or set the fill color in an element's style attribute and fill attribute."""
    style = elem.attrib.get("style", "")
    if "fill:" in style:
        new_style = re.sub(r"fill:\s*[^;]+", f"fill:{new_fill}", style)
    else:
        new_style = f"fill:{new_fill};{style}" if style else f"fill:{new_fill}"

    elem.attrib["style"] = new_style
    elem.attrib["fill"] = new_fill


def set_whole_color(whole_elem, color_hex):
    """Update color of 'whole' group and all its descendant path elements."""
    update_style_fill(whole_elem, color_hex)
    for path in whole_elem.iter():
        tag = path.tag.split("}")[-1] if "}" in path.tag else path.tag
        if tag in ("path", "rect", "circle", "polygon", "polyline"):
            update_style_fill(path, color_hex)


def create_standalone_svg(group_elem, whole_color_hex, bg_color_hex=None):
    """
    Build a standalone SVG tree for the given group.
    - Sets viewBox to '0 0 width height'
    - Translates elements by (-x, -y) to place origin at top-left
    - Excludes hidden/draft layers (e.g. 'parts')
    - Sets 'whole' fill to whole_color_hex
    - Sets 'background' fill to bg_color_hex (or omits background if bg_color_hex is None)
    """
    info = get_group_bounds_and_layers(group_elem)
    x, y = info["x"], info["y"]
    w, h = info["width"], info["height"]

    new_svg = ET.Element(
        f"{{{SVG_NS}}}svg",
        {
            "width": f"{w}mm",
            "height": f"{h}mm",
            "viewBox": f"0 0 {w} {h}",
            "version": "1.1",
        },
    )

    shift_group = ET.SubElement(
        new_svg,
        f"{{{SVG_NS}}}g",
        {"transform": f"translate({-x}, {-y})"},
    )

    # 1. Background layer
    if bg_color_hex is not None and bg_color_hex.lower() != "transparent":
        bg_clone = copy.deepcopy(info["bg_elem"])
        update_style_fill(bg_clone, bg_color_hex)
        shift_group.append(bg_clone)

    # 2. Whole logo layer
    whole_clone = copy.deepcopy(info["whole_elem"])
    set_whole_color(whole_clone, whole_color_hex)
    shift_group.append(whole_clone)

    return new_svg


def export_with_inkscape(inkscape_bin, standalone_svg_elem, out_file):
    """
    Export standalone SVG using Inkscape CLI.
    Writes a temporary SVG file and uses Inkscape CLI to output plain SVG.
    """
    with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as tmp:
        tmp_path = Path(tmp.name)
        tree = ET.ElementTree(standalone_svg_elem)
        tree.write(tmp, encoding="utf-8", xml_declaration=True)

    try:
        cmd = [
            inkscape_bin,
            str(tmp_path),
            "--export-plain-svg",
            f"--export-filename={out_file}",
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            cmd_fallback = [
                inkscape_bin,
                str(tmp_path),
                "--export-type=svg",
                f"--export-filename={out_file}",
            ]
            result_fallback = subprocess.run(cmd_fallback, capture_output=True, text=True)
            if result_fallback.returncode != 0:
                raise RuntimeError(
                    f"Inkscape CLI error: {result.stderr.strip() or result_fallback.stderr.strip()}"
                )
    finally:
        if tmp_path.exists():
            tmp_path.unlink()


def export_with_python(standalone_svg_elem, out_file):
    """Export standalone SVG using Python ElementTree directly."""
    out_tree = ET.ElementTree(standalone_svg_elem)
    with open(out_file, "wb") as f:
        out_tree.write(f, encoding="utf-8", xml_declaration=True)


def export_logos(svg_path, output_dir, groups=None, pairs=None, dry_run=False, engine="auto"):
    """
    Main export execution function.
    Validates OS support (Windows and Linux only), resolves engine (Inkscape CLI or pure Python),
    reads input SVG, extracts colors, and writes all requested SVG files.
    """
    os_type = check_os_support()
    print(f"Detected OS: {os_type.capitalize()} (Supported: Windows, Linux)")

    svg_path = Path(svg_path)
    output_dir = Path(output_dir)

    if not svg_path.exists():
        raise FileNotFoundError(f"SVG file not found: {svg_path}")

    # Determine export engine based on OS and availability
    inkscape_bin = find_inkscape_path(os_type)
    if engine == "inkscape":
        if not inkscape_bin:
            raise RuntimeError(
                f"Inkscape engine requested (--engine inkscape), but Inkscape was not found on {os_type.capitalize()}."
            )
        active_engine = "inkscape"
    elif engine == "python":
        active_engine = "python"
    else:  # 'auto'
        active_engine = "inkscape" if inkscape_bin else "python"

    if active_engine == "inkscape":
        print(f"Export Engine: Inkscape CLI ({inkscape_bin})")
    else:
        print("Export Engine: Pure Python (built-in, no Inkscape required)")

    tree = ET.parse(svg_path)
    root = tree.getroot()

    colors = extract_colors(root)
    print(f"Loaded colors from SVG: {colors}")

    if groups is None:
        groups = ["box", "line"]

    if pairs is None:
        pairs = DEFAULT_COLOR_PAIRS

    output_dir.mkdir(parents=True, exist_ok=True)
    generated_files = []

    for group_name in groups:
        group_elem = find_group_by_label(root, group_name)
        if group_elem is None:
            print(f"Warning: Group '{group_name}' not found in SVG. Skipping.")
            continue

        for whole_color_name, bg_color_name in pairs:
            if whole_color_name not in colors:
                print(f"Warning: Color '{whole_color_name}' not defined in palette. Skipping.")
                continue

            whole_hex = colors[whole_color_name]
            is_transparent = (bg_color_name == "transparent")

            if not is_transparent:
                if bg_color_name not in colors:
                    print(f"Warning: Color '{bg_color_name}' not defined in palette. Skipping.")
                    continue
                bg_hex = colors[bg_color_name]
            else:
                bg_hex = None

            # File naming: logo-2d_{group}-{whole_color}_background-{bg_color}.svg
            filename = f"logo-2d_{group_name}-{whole_color_name}_background-{bg_color_name}.svg"
            out_file = output_dir / filename

            if dry_run:
                print(f"[Dry Run] Would create: {filename}")
                generated_files.append(out_file)
                continue

            standalone_svg = create_standalone_svg(group_elem, whole_hex, bg_hex)

            if active_engine == "inkscape":
                export_with_inkscape(inkscape_bin, standalone_svg, out_file)
            else:
                export_with_python(standalone_svg, out_file)

            print(f"Exported: {filename}")
            generated_files.append(out_file)

    return generated_files


def main():
    parser = argparse.ArgumentParser(
        description="Programmatically export logo variations from Inkscape SVG on Windows and Linux."
    )
    parser.add_argument(
        "--input",
        default=str(DEFAULT_INPUT),
        help=f"Path to source logo_inkscape.svg (default: {DEFAULT_INPUT})",
    )
    parser.add_argument(
        "--output-dir",
        default=str(DEFAULT_OUTPUT),
        help=f"Directory to output exported SVGs (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--groups",
        nargs="+",
        default=["box", "line"],
        help="Groups to export (default: box line)",
    )
    parser.add_argument(
        "--all-pairs",
        action="store_true",
        help="Export all non-identical color permutations (50 files total) instead of default curated brand pairs",
    )
    parser.add_argument(
        "--engine",
        choices=["auto", "inkscape", "python"],
        default="auto",
        help="Export engine: 'auto' (detect Inkscape, fallback to Python), 'inkscape', or 'python' (default: auto)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview files to be generated without writing to disk",
    )

    args = parser.parse_args()

    pairs = None
    if args.all_pairs:
        tree = ET.parse(args.input)
        colors = extract_colors(tree.getroot())
        pairs = []
        for c in colors:
            pairs.append((c, "transparent"))
        for c1 in colors:
            for c2 in colors:
                if c1 != c2:
                    pairs.append((c1, c2))

    try:
        exported = export_logos(
            svg_path=args.input,
            output_dir=args.output_dir,
            groups=args.groups,
            pairs=pairs,
            dry_run=args.dry_run,
            engine=args.engine,
        )
        print(f"\nSuccessfully generated {len(exported)} logo files in '{args.output_dir}'.")
    except Exception as e:
        print(f"Error during export: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
