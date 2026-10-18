# design

Design identity, logos, posters and presentations for the CORE community.

## Repository layout

| Location | Contents |
| --- | --- |
| [logo/](logo/) | Master vector logo, 2D exporter and browser-based 3D prototype |
| [activities/](activities/) | Materials grouped by activity: posters, presentation, drafts and references |
| [html-slides skill](.agents/skills/html-slides/SKILL.md) | PDF-to-HTML presentation workflow, identity profiles and reusable helpers |
| `draft/` | Local archive of experiments, references and historical sources; excluded from Git |
| `export/` | Generated logo exports; excluded from Git |

## Logos

[logo/logo_inkscape.svg](logo/logo_inkscape.svg) is the master artwork. It contains the horizontal `line` and square `box` variants, palette swatches and working layers.

### 2D export

[logo/2d_logo_exporter.py](logo/2d_logo_exporter.py) exports standalone SVGs with transparent or solid backgrounds. It supports Windows and Linux, uses Inkscape when available and otherwise falls back to Python's standard library.

Run from the repository root:

```sh
python logo/2d_logo_exporter.py
python logo/2d_logo_exporter.py --help
```

Use `python3` on Linux if required. The default destination is the repository's `export/` folder, independent of the working directory.

| Option | Purpose |
| --- | --- |
| `--engine` | Choose `auto` (default), `inkscape` or `python` |
| `--groups box` or `--groups line` | Export one layout |
| `--all-pairs` | Export all supported non-identical color combinations |
| `--dry-run` | List planned exports |
| `--input PATH`, `--output-dir PATH` | Override input or output paths |

Names follow `logo-2d_{group}-{whole_color}_background-{bg_color}.svg`. Change the master artwork rather than editing generated files.

### 3D prototype

[logo/3d_logo_exporter.html](logo/3d_logo_exporter.html) is the current browser prototype, with style/camera controls and PNG/SVG export. It loads libraries and fonts from external CDNs and requires network access to load those dependencies. The proposed Blender workflow is future work, described in [TODO](#blender-3d-logos).

## Activities

Keep an activity's materials together under `activities/<topic>/`. An activity may start with a poster and gain a presentation later.

| Activity | Presentation | Other materials |
| --- | --- | --- |
| [Club introduction](activities/club_introduction/) | [index.html](activities/club_introduction/index.html) | Poster variants and presentation concept |
| [Matrix messenger talk](activities/matrix_messenger_talk/README.md) | [index.html](activities/matrix_messenger_talk/index.html) | PDF draft and editable Inkscape poster |
| [Creating Malware with AI](activities/malware_ai_talk/README.md) | [index.html](activities/malware_ai_talk/index.html) | PDF draft and editable Inkscape poster |
| Supply chain talk | In development | Poster and references in local `activities/supply_chain_talk/` (excluded from Git) |

Open a presentation's `index.html` in a browser. For a local HTTP preview, run this from the repository root:

```sh
python -m http.server 8000
```

Then visit, for example, `http://localhost:8000/activities/matrix_messenger_talk/`. HTTP preview and direct-file offline acceptance are separate checks; see each activity's README for recorded limitations.

## Creating HTML presentations

Use the [html-slides skill](.agents/skills/html-slides/SKILL.md) with `presentation_draft.pdf`, audience/language preferences and visual references:

```text
Use $html-slides with activities/my_talk/presentation_draft.pdf.
Audience: students. Translate to English. Use year_1 and the attached references.
```

The workflow preserves the source pages, order and content unless changes are approved. It presents three cover directions and 2–3 representative slides for a direction choice before completing the deck.

New projects deliver a standalone `index.html`, the input PDF, an activity README and a portable `source/` with assets, build code, decisions and QA. Keep source for later revisions and process review; no ZIP is created automatically. Historical sources in `draft/` have not been migrated to this portable format and may depend on old paths.

New CORE activities default to [year_1](.agents/skills/html-slides/references/year_1.md), unless preferences or references specify otherwise. Matrix and Malware show different palettes within that identity. Artistic covers and thematic scenes use ImageGen by default, or Antigravity when selected and available; exact diagrams use SVG. Generated artwork still requires visual review.

## Fonts and editable artwork

Year_1 uses **Space Mono Regular 400 and Bold 700**, available from [Google Fonts](https://fonts.google.com/specimen/Space+Mono) or the [bundled fonts and OFL license](.agents/skills/html-slides/assets/fonts/year_1/).

Install both fonts on the system before editing live text in Inkscape SVG/SVGZ files. A font-family declaration in SVG does not embed the font; the Matrix and Malware posters reference Space Mono without embedding it.

The presentation HTML embeds Space Mono for viewing. For Russian and mixed-language text, the chosen chain is `'Space Mono', monospace`: unsupported Cyrillic glyphs use the system monospace fallback. Check line breaks on the presentation computer because fallback appearance and metrics can differ.

## TODO

- Simplify naming and folder organization where it improves navigation.
- Review the draft archive, consolidate useful sources and identify obsolete material before cleanup.
- Extend reusable asset optimization/compression tooling while preserving originals.
- Evaluate the presentation pipeline on future activities and use returned source to refine the skill.
- Explore a separate community website.

### Blender 3D logos

Develop a reproducible 3D logo workflow beyond the browser prototype. These are intended outcomes; the implementation, Blender version and rendering engine remain open.

- Build from the official SVG paths, preserve `line`/`box` geometry and proportions, and explore extrusion, bevels, camera angles and lighting.
- Explore cel/toon shading, ink outlines and distinct front/side materials. Use references such as The Finals, radar/phosphor and Monument Valley/Retro CAD to develop coherent visual presets.
- Explore optional CRT scanlines, chromatic aberration, glow, vignette and grain as controllable effects.
- Support configurable themes, framing, backgrounds and resolution, including high-resolution renders for publications and presentations.
- Keep editable scene sources and reusable presets, with a repeatable batch/headless export workflow and visual checks against the master logo.

[License](LICENSE)
