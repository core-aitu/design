# CORE AITU: Blender 4.x 3D Logo Workflow & Automation Guide

This guide details how to transition from the HTML/Three.js prototype ([`3d_logo_exporter.html`](file:///c:/Users/aituwork/Desktop/projects/core-aitu-design/logo/3d_logo_exporter.html)) to a production-grade 3D pipeline in **Blender 4.x**. It covers both **manual GUI setup** (materials, cel-shading, LineArt outlines, CRT compositor) and **fully automated headless batch rendering** with Python (`bpy`).

---

## 1. Why Transition to Blender?

| Feature | Web Canvas (Three.js) | Blender 4.x (EEVEE Next / Cycles) |
| :--- | :--- | :--- |
| **Vector Fidelity** | Approximated via polygonal blocks | True cubic Bézier curve extrusion with exact bevels |
| **Lighting & Shadows** | Basic ambient/directional lights | Real-time raytraced shadows, ambient occlusion, screen-space GI |
| **Cel-Shading & Inking** | Three.js basic line segments | Native Grease Pencil **LineArt Modifier** (contour, crease, silhouette) |
| **Post-Processing (CRT/VFX)**| 2D canvas blend operations | Multi-pass node compositor (chromatic aberration, lens distortion, scanlines) |
| **Batch Automation** | Manual click-and-save | Headless CLI batch rendering (`blender -b -P`) |

---

## 2. Manual GUI Workflow

### Step 1: Importing the SVG Vectors
1. Open Blender 4.x and start a **General** scene. Delete the default Cube and Light (`X` > Delete).
2. Go to **File > Import > Scalable Vector Graphics (.svg)**.
3. Select [`logo_inkscape.svg`](file:///c:/Users/aituwork/Desktop/projects/core-aitu-design/logo/logo_inkscape.svg).
4. Blender imports the SVG as a collection of 2D Curve objects under a collection named `logo_inkscape.svg`.
5. Organize the curves into collections:
   - `Collection_Line` (1×4 horizontal logo)
   - `Collection_Box` (2×2 square logo)

### Step 2: Extrusion and Geometry
Select all letter curve objects in the logo collection:
1. In the **Object Data Properties** (green curve icon):
   - **Shape > 2D**: Ensure 2D mode is enabled.
   - **Geometry > Extrude**: Set to `0.02 m` to `0.04 m` (adjust to taste).
   - **Geometry > Bevel > Depth**: Set to `0.001 m` for micro-beveled highlight edges.
   - **Geometry > Bevel > Resolution**: `2` or `3`.
2. To center the pivot: **Object > Set Origin > Origin to Geometry**.
3. Align coordinates so the logo sits at world origin `(0, 0, 0)`.

### Step 3: Cel-Shading / Toon Material (EEVEE Next)
In Blender 4.x EEVEE Next, cel-shading is created using the **Shader to RGB** node:

```
[ Diffuse BSDF ] ---> [ Shader to RGB ] ---> [ ColorRamp (Constant) ] ---> [ Material Output ]
```

1. Create a new material named `M_Logo_Front`:
   - **Diffuse BSDF**: Base color `#FFFFFF` (or theme front color).
   - Connect **BSDF** output to **Shader to RGB** node input.
   - Connect **Shader to RGB** to a **ColorRamp** node. Set interpolation to **Constant**.
   - Stop 0 (Position `0.0`): Shadow tone (e.g. `#BA004A` for The Finals, `#004D25` for Radar).
   - Stop 1 (Position `0.45`): Mid tone.
   - Stop 2 (Position `0.70`): Highlight tone (`#FFFFFF`).
   - Connect ColorRamp to **Material Output > Surface**.
2. Create `M_Logo_Side` for extrusion sides and assign it to the curve's bevel/extrusion slot.

### Step 4: LineArt Outline Shading (Grease Pencil)
To produce crisp cel-shaded vector outlines identical to the Monument Valley / Retro CAD aesthetic:
1. In the 3D Viewport: **Add > Grease Pencil > Scene Line Art**.
2. Select the Line Art object, go to the **Modifiers** tab:
   - **Source Type**: `Collection` (select your logo collection).
   - **Edge Types**: Check `Contour`, `Silhouette`, and `Crease` (Crease Threshold: `140°`).
   - **Stroke Style**: Constant thickness `2px` or `3px`, Color: Black (`#111116`) or White (`#FFFFFF`).

### Step 5: CRT Scanlines & The Finals Shaders in the Compositor
In the **Compositing** workspace, check **Use Nodes**:

1. **Interlace Scanlines**:
   - Add **Texture Node** with a repeating 1D line pattern (or **Math > Modulo** on Image Coordinates $Y$).
   - Multiply over the render pass with `0.32` opacity.
2. **Chromatic Aberration (The Finals RGB Split)**:
   - Add **Lens Distortion** node.
   - Set **Dispersion**: `0.035`.
   - Set **Distort**: `-0.01` (subtle barrel curvature).
3. **Inner Glow & Vignette**:
   - Add **Box Mask** or **Ellipse Mask** node with feather `0.6`.
   - Invert and multiply over the render with dark magenta (`#3D0015`) to create the deep rim shadow.
4. **Analog Grain**:
   - Add a subtle cloud/noise texture mix at `4%` factor.

---

## 3. Automated Headless Batch Script (`bpy`)

Save the following script as `automate_logo_render.py` in your `/logo` directory:

```python
#!/usr/bin/env python3
"""
automate_logo_render.py

Automated batch rendering of CORE AITU 3D logos in Blender 4.x.
Usage:
    blender --background --python automate_logo_render.py -- --layout line --theme the-finals --resolution 1920x1080
"""

import sys
import os
import argparse
import math
import bpy

THEMES = {
    "the-finals": {
        "bg": (0.768, 0.0, 0.309, 1.0),
        "fill": (1.0, 1.0, 1.0, 1.0),
        "side": (0.329, 0.0, 0.117, 1.0),
        "line": (1.0, 1.0, 1.0, 1.0),
        "bloom": (1.0, 0.078, 0.431, 1.0)
    },
    "radar-phosphor": {
        "bg": (0.007, 0.039, 0.019, 1.0),
        "fill": (0.0, 1.0, 0.466, 1.0),
        "side": (0.0, 0.301, 0.145, 1.0),
        "line": (1.0, 1.0, 1.0, 1.0),
        "bloom": (0.0, 1.0, 0.466, 1.0)
    },
    "monument-violet": {
        "bg": (0.898, 0.898, 0.909, 1.0),
        "fill": (1.0, 1.0, 1.0, 1.0),
        "side": (0.486, 0.227, 0.929, 1.0),
        "line": (0.066, 0.066, 0.086, 1.0),
        "bloom": (0.545, 0.360, 0.964, 1.0)
    }
}

def parse_args():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []

    parser = argparse.ArgumentParser(description="CORE 3D Logo Headless Renderer")
    parser.add_argument("--svg", default="logo_inkscape.svg", help="Path to logo_inkscape.svg")
    parser.add_argument("--layout", default="line", choices=["line", "box"], help="Logo layout (line or box)")
    parser.add_argument("--theme", default="the-finals", choices=list(THEMES.keys()), help="Color theme preset")
    parser.add_argument("--resolution", default="1920x1080", help="Render resolution (WxH)")
    parser.add_argument("--output", default="render_output.png", help="Output image file path")
    parser.add_argument("--depth", type=float, default=0.025, help="Extrusion depth in meters")
    return parser.parse_args(argv)

def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes: bpy.data.meshes.remove(block)
    for block in bpy.data.materials: bpy.data.materials.remove(block)
    for block in bpy.data.curves: bpy.data.curves.remove(block)

def setup_camera():
    cam_data = bpy.data.cameras.new("RenderCam")
    cam_data.type = "PERSP"
    cam_data.lens = 50
    cam_obj = bpy.data.objects.new("RenderCam", cam_data)
    bpy.context.scene.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj

    # Classic Isometric 3/4 angle
    cam_obj.location = (0.35, -0.45, 0.40)
    cam_obj.rotation_euler = (math.radians(58), 0, math.radians(38))
    return cam_obj

def setup_lighting(theme):
    # Sun light
    sun_data = bpy.data.lights.new("MainSun", "SUN")
    sun_data.energy = 2.5
    sun_data.color = (1.0, 1.0, 1.0)
    sun_obj = bpy.data.objects.new("MainSun", sun_data)
    sun_obj.rotation_euler = (math.radians(45), math.radians(25), math.radians(15))
    bpy.context.scene.collection.objects.link(sun_obj)

    # Ambient World
    world = bpy.context.scene.world or bpy.data.worlds.new("World")
    world.use_nodes = True
    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs["Color"].default_value = theme["bg"]
        bg_node.inputs["Strength"].default_value = 0.5
    bpy.context.scene.world = world

def create_toon_material(name, base_color, shadow_color):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    diffuse = nodes.new("ShaderNodeBsdfDiffuse")
    diffuse.inputs["Color"].default_value = base_color

    s2rgb = nodes.new("ShaderNodeShaderToRGB")
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.interpolation = "CONSTANT"
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = shadow_color
    ramp.color_ramp.elements[1].position = 0.5
    ramp.color_ramp.elements[1].color = base_color

    links.new(diffuse.outputs["BSDF"], s2rgb.inputs["Shader"])
    links.new(s2rgb.outputs["Color"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], output.inputs["Surface"])
    return mat

def main():
    args = parse_args()
    theme = THEMES[args.theme]
    w, h = map(int, args.resolution.split("x"))

    clear_scene()

    # Configure Render Engine
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x = w
    scene.render.resolution_y = h
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = os.path.abspath(args.output)

    # Import SVG
    svg_path = os.path.abspath(args.svg)
    if not os.path.exists(svg_path):
        print(f"Error: SVG file not found at {svg_path}")
        sys.exit(1)

    bpy.ops.import_curve.svg(filepath=svg_path)

    # Extrude imported curve objects
    mat_front = create_toon_material("Mat_Front", theme["fill"], theme["side"])
    
    for obj in bpy.context.scene.objects:
        if obj.type == "CURVE":
            obj.data.extrude = args.depth
            obj.data.bevel_depth = 0.001
            obj.data.bevel_resolution = 2
            obj.active_material = mat_front

    setup_camera()
    setup_lighting(theme)

    print(f"Rendering {args.layout} layout in '{args.theme}' theme ({w}x{h})...")
    bpy.ops.render.render(write_still=True)
    print(f"Render complete: {scene.render.filepath}")

if __name__ == "__main__":
    main()
```

---

## 4. Execution & Batch Commands

### Single Render Test:
```bash
blender --background --python logo/automate_logo_render.py -- \
  --svg logo/logo_inkscape.svg \
  --layout line \
  --theme the-finals \
  --resolution 1920x1080 \
  --output export/blender_the_finals_1080p.png
```

### Batch Render All Brand Themes (PowerShell):
```powershell
$themes = @("the-finals", "radar-phosphor", "monument-violet")
foreach ($t in $themes) {
    blender --background --python logo/automate_logo_render.py -- `
      --svg logo/logo_inkscape.svg `
      --theme $t `
      --resolution 3840x2160 `
      --output "export/blender_logo_${t}_4k.png"
}
```

---

## 5. Summary & Hand-off Notes

1. **Geometry Consistency**: The SVG paths in [`logo_inkscape.svg`](file:///c:/Users/aituwork/Desktop/projects/core-aitu-design/logo/logo_inkscape.svg) serve as the single source of truth for both the web canvas exporter and the Blender pipeline.
2. **Post-Processing**: For quick social media screenshots and interactive presentations, [`3d_logo_exporter.html`](file:///c:/Users/aituwork/Desktop/projects/core-aitu-design/logo/3d_logo_exporter.html) provides instant in-browser exports. For official print, 4K wallpapers, and video animations, use the Blender workflow described above.
