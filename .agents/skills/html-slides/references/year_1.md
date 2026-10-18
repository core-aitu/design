# CORE identity: year_1

Read for new CORE activities unless the user selected another identity. Explicit preferences and supplied references take priority. This profile defines typography, spatial rhythm and artwork principles; it does not impose the Matrix palette on every topic. General guidance lives in [design-and-review.md](design-and-review.md).

## Typography and canvas

Use **Space Mono 400 and 700** for headings, copy, diagrams and controls. Licensed files: [Regular](../assets/fonts/year_1/SpaceMono-Regular.ttf), [Bold](../assets/fonts/year_1/SpaceMono-Bold.ttf), [OFL](../assets/fonts/year_1/OFL.txt). Official download: [Google Fonts: Space Mono](https://fonts.google.com/specimen/Space+Mono). Copy fonts and license into each activity's source and embed fonts with `@font-face` in the HTML. A family declaration alone does not embed a font.

Use `font-family: 'Space Mono', monospace` for English and Russian. Space Mono does not supply the Russian glyphs used here: the browser uses installed monospace fallback for unsupported characters. Do not silently add another named family, translate the deck, or substitute a different main font to hide this. Inspect Cyrillic and mixed-script lines at the prototype stage; widths and appearance can differ between computers. Document this in the activity README and QA.

For editing text in SVG/SVGZ with Inkscape, **install Space Mono 400/700 on the system**. Existing Inkscape documents reference the family; they do not embed font files. Restart the editor if necessary. Converting text to paths is a separate export choice; preserve the editable original. HTML font embedding does not install a font for Inkscape.

| Element | Starting value on the reference canvas |
| --- | --- |
| Canvas | 1920×1080, proportional scaling and letterboxing |
| Content padding | top 112 px; left/right 96 px; bottom 64 px |
| Standard title | 66 px, weight 700; line-height 1.18; reserved height 156 px |
| Subheading / body / detail / caption | 32 / 28 / 24 / 20 px |
| Standard title-to-content gap | 90 px; content begins at y358 |
| Compact title-to-content gap | 32 px; content begins at y300 |
| Folio | upper right, one visible current/total count |
| Controls | centered below the canvas, 54 px high |

Use the standard rhythm for comparable text/diagram slides and compact rhythm for dense code, tables or media when needed. Covers, museum/evidence scenes and closing compositions can use their own geometry. Exceptions require a readable result and visual check, not another near-duplicate text size. For video, retain the full frame and maximum useful size without extending into controls or causing focus scrolling. Align title, folio and media areas consistently across demos.

## Color and imagery

The two activities demonstrate **different palettes within year_1**:

| Reference | Base / text / accent | Artistic use |
| --- | --- | --- |
| [Matrix](../../../../activities/matrix_messenger_talk/index.html) | #0b0917 / #eef6f1 / #15ff7e; cyan and violet support | Fractured digital architecture, tactile print, graphic networks and archives |
| [Malware AI](../../../../activities/malware_ai_talk/index.html) | #0b1120 / #e9e7d9 / #c6b27b; near-black #070c16 | Noir architecture, milk paper, muted gold, irregular lithographic contours |

These are examples, not universal colors or mandatory subject vocabulary. Select a restrained palette from the actual references, with contrast for projection. Use the accent consistently in emphasis, diagrams and interaction states. Grain and irregular edges support the scene; text and precise geometry remain clean.

Prefer open compositions to repeated enclosing cards. Integrate large images with purposeful reading space and code-native vectors for exact relationships. Let topic-specific actions drive the image; do not make every subject another corridor or generic figure in a coat. Preserve real screenshots, video and source labels rather than redrawing their content.

## Official CORE and controls

The master is [logo/logo_inkscape.svg](../../../../logo/logo_inkscape.svg); the exporter is [logo/2d_logo_exporter.py](../../../../logo/2d_logo_exporter.py). Isolate an official `line` or `box` group and a legible official color variant. Preserve paths, proportions and geometry; do not embed the whole authoring sheet, stretch, redraw, or replace the mark with typed text. Use the line variant for the established desktop layout unless the reference or space calls for box. Copy exports into activity source so rebuilding does not depend on repository paths.

Use the maintained runtime component, not another extraction from Matrix HTML. Keep previous/next and user-triggered Fullscreen centered in the 54 px strip, hidden accessible counter, disabled boundary states, visible keyboard focus and inactive-slide focus exclusion. Fullscreen removes the viewport reservation and reveals controls at the bottom or on keyboard focus; verify supported interactions.

Parameterize control background, border, button surface, text, accent and interaction states with CSS variables. Use the activity accent for hover/focus: muted gold for Malware, green for Matrix. Styling belongs to the identity layer; navigation and media behavior belong to runtime. Do not add unrequested panel content or move it to one side.

## Activity documentation

Every new activity README identifies `index.html`, `presentation_draft.pdf`, editable publication files when present, identity, font installation/license, rebuilding instructions and actual verification limitations. Keep the PDF in both activity inputs and portable source. Link the installed-font requirement wherever editable Inkscape material is delivered. Do not claim system fallback is embedded or localhost proves direct-file offline operation.

