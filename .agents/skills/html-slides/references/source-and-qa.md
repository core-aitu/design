# Portable source and evidence

Read this when creating source, running checks, or reviewing returned source. This is a small data contract and handoff workflow, not a universal layout engine. The agent writes the presentation's particular semantic HTML/SVG and project builder.

## Folder and build contract

```text
activities/<topic>/
  presentation_draft.pdf      # convenient original input
  index.html                 # only file needed for presentation
  README.md                  # language/identity, preview, editable-font prerequisites
  source/
    README.md                # standalone rebuild + tools, changes and limitations
    manifest.json
    content.json
    decisions.json
    art-log.json
    build.py
    deck.css
    inputs/presentation_draft.pdf
    inputs/references/        # used references, including working vector if relevant
    assets/originals/         # original evidence, video, QR, isolated CORE, fonts/licenses
    assets/generated/         # every returned art variant; selected delivery copies too
    vendor/                  # used helper/runtime copies + version/hash provenance
    prototypes/              # concrete direction options and representative slides
    qa/
      latest.json
      captures.json
      static.json
      frames/
      contact.jpg
```

Keep build-required originals and the PDF inside source, even when the activity also has the input PDF. Copy used helpers/runtime/fonts into source, record origin and hash; do not import them from `.agents`, `/draft`, a previous activity or a machine-specific font folder at build time. No symlink or absolute-path dependency. A caller-supplied output destination may be outside source; input resources remain manifest-relative.

`python source/build.py` must produce the activity's `index.html`; `python path/to/copied/source/build.py --output path/to/result/index.html` must work independently of cwd and the repository. Resolve default output from the source folder, not cwd. The project builder uses standard Python; extraction may use pypdf and contact sheets need Pillow. Document any QA-only dependency separately. Do not auto-install packages or silently recover missing input assets when the builder is imported. Fail with the missing asset ID/path. Preserve original documentary bytes; optimize copies of generated artwork only.

Runtime files are text included into `<style>`/`<script>`, not external imports. Paste the controls fragment once. Include the font OFL in source and the license text in the HTML. Choose a restrictive CSP supporting the actual inline/data resources, including media where used. CSP does not replace resource inspection/offline testing.

## Minimal data interfaces (schema version 1)

All paths below are relative to the file containing them. JSON is UTF-8. Use stable IDs, not display numbers, to connect revisions. Store inputs once and refer to IDs rather than repeating Base64 in manifests.

`manifest.json`:

- `schema_version`: `1`; `phase`: `prototype` or `complete`; `identity`: `year_1` or another selected profile ID; `language`: `en`/`ru` in the v1 checker (other languages require extending validation); `title`; `canvas`: `[1920,1080]`.
- `source_pdf`: `{path, sha256, page_count}` recorded from the actual PDF during ingest; the stdlib checker verifies bytes/signature but cannot independently count PDF pages.
- `content`: `content.json`; `decisions`: `decisions.json`; `output`: `../index.html`.
- `slides`: ordered `{id, title, source_pages:[1]}` entries. A final preserved deck maps page1…N to one slide each. Prototype subsets/alternative covers are explicitly `phase:prototype`, never presented as the final preserved deck.
- `assets`: `{id, path, role, mime, sha256, embedded}`; roles include evidence, reference, generated, logo, font, video and qr. `embedded:false` is appropriate for unused alternatives/references/PDF; used browser assets must be self-contained. Font entries add `family` and `weight`. Record original SHA-256 before transformation; an optimized generated copy is a separate asset with its own hash/provenance.

`content.json` has `units`, each `{id, source_page, slide_id, kind, original, text}`. `text` is the exact intended displayed version; `original` retains the source. `kind` is `prose`, `code`, `url` or `value`. Preserve code/operators/commands, units/numbers and addresses exactly; translated comments are explicit source/display changes. The design remains project code, not an inferred structure based on line counts or `//` splitting.

Render each unit in a real element with `data-source-id`, inside its `.slide[data-slide-id]`. Record pages in the section's `data-source-pages="1,2"`, title in `data-title`. A prose unit may contain typographic inline tags; code is escaped text inside `<pre>`. URL units use the exact address in the element's `href`. Do not add hidden duplicate source text merely to pass a checker.

`decisions.json` is an ordered list. A structural content change uses `{id, type:"content_change", status:"approved", source_pages:[...], slide_ids:[...], user_instruction, reason}`. Its pages and resulting IDs must describe the actual merge/split/omit/add; empty pages describe an addition and empty slide IDs an omission. Record the user's actual authorization, not an agent's recommendation. Other entries can be language_choice, design_choice or revision, with the affected IDs and rationale. Design approval is not blanket content-change permission.

`art-log.json` records each attempt's ID, tool/mode, full prompt, input reference IDs, returned files, role, intended text/subject zones, output hashes, status (`exploration`, `selected`, `rejected`, `superseded`) and reason. Keep all returned images, including unsuccessful compositions; an attempt with no image is a log entry. Filenames such as final do not establish approval. Use relative asset paths; old machine paths may be historical provenance only.

## Helpers

Copy only required helpers into source/vendor; preserve their version/hash. From project code:

```python
from pathlib import Path
from vendor.portable_assets import data_uri, font_face

SOURCE = Path(__file__).resolve().parent
# Expected hashes come from ingest/manifest, never from the generated output.
uri = data_uri(SOURCE / asset['path'], asset['sha256'], mime=asset['mime'])
css_face = font_face(SOURCE / font['path'], font['family'], font['weight'],
                     expected_sha256=font['sha256'])
```

Run these with actual paths (the script directory can be the skill or vendored copy):

```text
python scripts/check_deck.py --deck path/to/index.html --manifest path/to/source/manifest.json --json path/to/source/qa/static.json
python scripts/contact_sheet.py --frames path/to/source/qa/captures.json --out path/to/source/qa/contact.jpg --columns 4
```

`portable_assets.py` has no runtime package dependency or import side effects. It does not convert compressed SVGZ automatically; export the required self-contained SVG intentionally and preserve the vector original. `contact_sheet.py` uses Pillow and only assembles already captured images; it never marks a frame reviewed. `check_deck.py` is a supported-construct lint, not a full CSS/JS engine, translation verifier or proof of offline operation. A `needs_review` finding is not a passed browser test.

## Browser and media QA

Use the environment's supported browser/computer API. Establish its capabilities once; do not introduce an unapproved secondary browser-control channel to bypass restrictions. Wait for the intended active slide ID, viewport and rendered content after navigation, then capture. Check the captured pixels: a blank compositor frame or wrong active slide is invalid evidence even if its filename and DOM state are correct. Recapture invalid evidence before review.

After a whole-deck build, inspect each slide at 1920×1080, 1280×720 and 900×600 and inspect a contact sheet for repeated layouts, missing rhythm or incompatible illustration scales. A local revision rechecks affected slides plus shared dependencies; do not rerun unchanged video/fullscreen tests just to inflate counts. A shared typography/runtime change has a larger scope.

`captures.json` has `captures` entries `{slide_id, viewport:[1920,1080], path:"frames/p001-1920.jpg", artifact_sha256}`. Optional title/revision/date/observations are useful. Paths are relative to captures.json. `qa/latest.json` identifies the HTML hash and current revision, test scope, findings/fixes/remaining limitations, and distinct `captured`, `automatically_checked`, `visually_reviewed`, `independently_reviewed`, `unverified` results. Record the reviewer and real observations; report-writing code must not infer art acceptance from zero overflow or the number of frames.

Content review checks readable visible placement, reading order, translation meaning and qualifications. Static prose matching only normalizes whitespace; code preserves characters with line endings normalized; URLs and values have exact expected data. Browser review checks actual fonts/glyphs, clipping and applying the identity, since static presence/hash cannot establish these.

Exercise first/last boundaries, arrows/Space/PageUp/PageDown/Home/End, visible focus and inactive slide inertness, scaling, fullscreen entry/exit and control reveal. Preserve native activation for buttons and video controls. For each original video: metadata, user play, seek, ending/restart, pause on departure, native player key isolation, and no layout shift on focus. Match each video to the PDF poster visually and preserve original bytes unless reencoding is authorized. A poster loading is not video playback proof.

For QR, prefer the provided original SVG or a suitable installed generator such as Inkscape. Keep quiet zones, contrast and geometry; use independent decoding of the rendered result where available. Readback of a controlled screenshot is not a camera/perspective test. Do not invent or paint a QR with ImageGen or add a custom decoder as a routine dependency.

Attempt opening one copied HTML with source removed and network disabled. If direct `file:` or hover/fullscreen interaction is blocked, record `unverified` with the reason and any complementary localhost test accurately. Do not repeatedly try forbidden routes or call HTTP/CSP evidence a direct offline pass.

## Activity README and returned-source review

The activity README names index.html, presentation_draft.pdf and source/, chosen identity/language, preview/rebuild commands, editable SVG font prerequisites, and any system fallback/untested behavior. The source README explains standalone rebuild, optional extraction/QA tools, original licenses, the selected design and latest evidence. No automatic archive; the user returns source/ as a folder.

When source returns: inventory without executing untrusted examples/build scripts; compare the final with prototypes and decisions; identify repeated complaints and their before/after evidence. Separate a failed requirement from a newly chosen preference. For each proposed improvement record the observed failure, demonstrated cause or marked hypothesis, affected task type, minimal change, counterexample/scope and a forward test. Update a skill only when that update is requested; ordinary creation preserves this evidence for the next review.
