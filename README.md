# design

## description

This repository contains design assets, brand identity materials, and visual resources for the CORE organization and community. It serves as the central hub for CORE design guidelines, graphical assets, and related automated export tooling.

---

## logo

This section covers the official vector logo assets and the programmatic export tool for generating brand logo variations.

### Source Files

- **`logo/logo_inkscape.svg`**: Master Inkscape SVG document containing:
  - **`box`**: Square logo group (canvas dimensions: `66.15mm x 66.15mm`).
  - **`line`**: Horizontal logo group (canvas dimensions: `100.00mm x 66.15mm`).
  - **`colors`**: Color palette swatch definitions (`white`, `black`, `green`, `orange`, `purple`).
  - Layers inside export groups:
    - **`background`**: Solid background bounding rectangle.
    - **`whole`**: Core vector logo artwork.
    - **`parts`**: Internal draft vector paths (automatically stripped during export).

### Export Script (`logo/export_logos.py`)

A script located in `/logo` that programmatically exports logo variations.

#### Supported Operating Systems
- **Windows** (via `python` or `py`)
- **Linux** (via `python3`)
*(Other operating systems are explicitly disallowed by platform validation).*

#### Dual Engine Architecture
The script automatically detects whether Inkscape is available:
1. **Inkscape CLI Mode**: If Inkscape is installed on Windows (`PATH` or standard `Program Files`) or Linux (`PATH`, `/usr/bin/inkscape`, `/snap`, `/var/lib/flatpak`), the script leverages Inkscape's CLI engine for plain SVG generation.
2. **Pure Python Fallback**: If Inkscape is not installed, it automatically falls back to generating SVGs using Python's standard library (`xml.etree.ElementTree`). **No third-party packages or Inkscape required.**

#### What the script does:
1. Validates that the OS is Windows or Linux.
2. Dynamically reads color swatches and hex codes from the `colors` group in `logo/logo_inkscape.svg`.
3. Extracts groups `box` and `line` while removing hidden/draft layers (`parts`).
4. Normalizes coordinate offsets so standalone files have clean `(0, 0)` origins and tight `viewBox`es.
5. Generates standalone SVG files for:
   - **Transparent backgrounds**: All colored logos on transparent background.
   - **Solid backgrounds**: Colors combined with white (colored on white, and white on colored/black).
6. Automatically saves all output files directly into the project root `/export` directory, regardless of which folder you run the command from.
7. The `/export` folder is excluded from version control via `.gitignore`.

### Usage

#### 1. Default Export (Curated Brand Combinations)
Run the script from the repository root:

- On Windows:
  ```powershell
  python logo/export_logos.py
  # or
  py logo/export_logos.py
  ```
- On Linux:
  ```bash
  python3 logo/export_logos.py
  ```

*(Or from within the `logo/` directory: `cd logo && python export_logos.py`)*

This exports **26 SVG logo files** into the root `export/` directory (13 for `box`, 13 for `line`).

#### 2. Force Specific Engine
You can manually force an export engine using `--engine`:
```bash
# Auto-detect Inkscape, fallback to Python (default)
python logo/export_logos.py --engine auto

# Force Inkscape CLI (fails with clear message if Inkscape is not installed)
python logo/export_logos.py --engine inkscape

# Force pure Python built-in engine
python logo/export_logos.py --engine python
```

#### 3. Export Specific Groups
To export only `box` or only `line`:

```bash
python logo/export_logos.py --groups box
python logo/export_logos.py --groups line
```

#### 4. Export All Non-Identical Combinations (50 Files)
If you want every possible combination where text color does not match background color:

```bash
python logo/export_logos.py --all-pairs
```

#### 5. Preview Without Writing (Dry Run)
```bash
python logo/export_logos.py --dry-run
```

#### 6. Custom Input / Output Paths
```bash
python logo/export_logos.py --input logo/logo_inkscape.svg --output-dir export
```

### Output Naming Convention

Exported files follow the naming standard:

```
logo-2d_{group}-{whole_color}_background-{bg_color}.svg
```

---

## presentations

This directory houses interactive presentation templates and design references for CORE AITU events, pitches, and public talks.

> [!NOTE]
> **Repository Scope**: The files in `/presentations` serve as reusable presentation templates and design system demonstrations. Actual operational presentations and production slide decks will likely be maintained in a separate dedicated repository in the future (final repository architecture to be determined).

### Available Templates

#### `club_introduction`
A 12-slide retro-futuristic mainframe presentation template introducing the CORE community (successor to Linux Klub at Astana IT University, partnered with the School of Cybersecurity - ШКБ) to students, faculty, and partners.

- **Location**: [`presentations/club_introduction/`](presentations/club_introduction/)
- **Visual Aesthetic**: Industrial mainframe computer console, bulky extruded CRT monitor bezel, high-contrast monochrome white & slate display, signal red telemetry accents, multi-module hardware instrumentation rack (oscilloscope telemetry, system bus toggle switches, patch matrix, diagnostic rotary selector, fuse block, and exhaust grille).
- **Tech Stack**: Standalone HTML5 / CSS3 / Vanilla JavaScript (zero build steps, zero npm dependencies, 100% self-contained, runs offline directly from local disk).
- **Features**:
  - **Hero Title Slide**: Full-width presentation header featuring the official vector CORE line logo, institutional affiliations, core motto, and structured operational specifications.
  - **Procedural 3D & Blueprint Wireframes**: Open-Source Contributor Network Graph (Slide 3), Isometric Server Infrastructure Cluster (Slide 5), Git-style Branching Commit Progression Tree (Slide 10), and calm oscilloscope waveform telemetry.
  - **Authentic Content**: Built on the official CORE charter (ДП-AITU-25), I Trimester 2026–2027 event plan, flat horizontal Coordination Staff model, Responsible Disclosure protocol, and 2026–2030 strategic roadmap towards Open Source Foundation Kazakhstan.
  - **Navigation**: Keyboard shortcuts (`←` / `→`, `Space`, `Backspace`), mechanical on-screen console buttons, progress rail starting from 0%, and quick-jump slide matrix (`Esc`).
  - **Display Modes**: Fullscreen support (`F`), responsive 16:9 cabinet scaling, and touch swipe gestures.

### How to Run / Preview

Simply open [`index.html`](presentations/club_introduction/index.html) directly in any modern web browser:

- Double-click `presentations/club_introduction/index.html` in your file explorer, or
- Serve locally using any lightweight static server:
  ```bash
  python -m http.server 8000
  ```
  and visit `http://localhost:8000/presentations/club_introduction/`.