# Art direction, composition, and review

Read when planning a new deck, resolving weak design, or reviewing a substantial revision. For the current CORE identity, also read [year_1.md](year_1.md). Use [examples.md](examples.md) for four bounded case studies; do not load the entire archive.

## Establish a direction before producing every slide

1. Inspect actual reference slides as well as their styles. Record typography, palette, controls, spacing and logo; then identify why their compositions work: full scenes, quiet reading areas, open structures, scale changes, or restrained tables. Matching a font and grain is insufficient.
2. Map each source page to its main message and a suitable visual relation. Preserve essential text, order, qualifications and documentary evidence. Suggest content changes separately; a design improvement does not authorize a cut, merge, split, or added ending.
3. Prepare **three genuinely different cover directions** and **2–3 representative difficult slides**, chosen from the actual material: e.g. a semantic diagram, dense code/table, and media. Show real titles, speaker, official logo and controls. Distinct subject matter or action matters more than another camera angle or color.
4. Review the composed prototypes at the three target viewports and identify their weakest composition before presenting the checkpoint. Fix execution defects and weak visual relationships; state meaningful tradeoffs between the remaining concepts. Present the directions together, recommend one, explain strengths and tradeoffs, and obtain the user's choice before full production. Explicit prior selection can satisfy this checkpoint. Selection applies to the overall direction; do not request approval for every alignment or picture. While a decision is pending, continue source verification and technical work that does not depend on it.
5. Record the chosen direction, alternatives and reason. Carry the identity into the middle of the deck, with enough variation to give different ideas different emphasis.

Consult on improvements that solve a concrete communication problem: a process instead of repeated boxes, a tighter museum wall instead of an oversized distant interior, or a calmer text area. Show the proposal with real material rather than an abstract style board alone.

## Choose structure from meaning

| Content relation | Useful composition | Acceptance question |
| --- | --- | --- |
| Ordered actions | Stages with transitions and aligned explanations | Is the order visible before reading all the prose? |
| Alternatives or differences | Parallel comparison, aligned criteria, restrained table | Can the same attribute be compared across options? |
| One cause, several outcomes | Branch map with a shared origin | Do the connections express the actual relation? |
| Roles and exchanges | Labeled actors and directed interactions | Are direction and endpoints unambiguous? |
| Development over time | Timeline or roadmap with consistent anchors | Are time/order and grouping evident? |
| Concrete evidence | Large faithful screenshot, image or video | Is evidence readable and distinct from illustration? |
| Conceptual claim | Specific scene or metaphor with separate text | What action or relationship does the image explain? |

Do not turn every item into a card or add a pictogram solely to occupy space. If the layout adds no information beyond a normal list, reconsider its structure. A list or text-led slide is valid where clearest. Isometry and texture cannot repair an unclear relationship.

Remove redundant kickers, headers, numbering, top rules and containers when they repeat information. Normalize text sizes and title-to-content rhythm across comparable types. Preserve deliberate exceptions for covers, evidence, dense data and media. Do not shrink substantial prose to accommodate decoration.

## Raster briefing and iteration

For a new presentation's artistic covers and thematic scenes, default to the built-in Codex ImageGen capability. Read its applicable skill, provide the actual reference images, and generate/edit the artwork before presenting those concepts. Use Antigravity when the user chooses it and the environment exposes that capability; do not claim access or silently imitate its output. Three requested artistic directions need genuinely produced visual options, not three text descriptions or generic SVG substitutes. Approved reusable art, an explicit vector-only/no-generation request, and routine local layout fixes can avoid new generation; record that reason. Unavailable generation leaves the relevant art pending, rather than accepted.

Code-native SVG remains appropriate for exact diagrams, code chains, relationships, logos from official vectors and charts. Keep factual text separate. QR codes and documentary screenshots/video are never generated illustrations. ImageGen does not by itself establish a specific or successful metaphor: inspect its result against the same communication and identity criteria as vectors.

Before generating, write a brief containing:

- **Thesis and role:** the point; full environment, focal object, conceptual illustration, texture, or background.
- **Distinct action:** what happens, and why it belongs here. If the picture could support almost any title, make it more specific.
- **Identity:** actual image references, palette, material, contour and print/lighting language. Avoid repeating empty corridors or generic cyber props across unrelated subjects.
- **Composition:** aspect ratio, complete focal subject, direction, quiet title/copy zones, and breathing room around extremities. Include actual coordinates or percentages where helpful.
- **Separation:** no generated title, code, logo, QR, chart value, or documentary screenshot. Typeset factual text and labels in HTML/SVG; retain original evidence separately.
- **Edit invariants:** on a correction, state what remains, what changes, and whether the subject is mirrored. Save input, prompt, output, and selection reason.

Generate for the planned composition. A whole-scene background and a cutout are different roles; changing between them needs a reason. `cover`, `contain`, masks, blur and gradients are tools, not proof that the subject fits. Inspect the assembled slide: a precise prompt can still put a hand under a title or crop feet. Recompose or regenerate an asset that cannot satisfy the framing. Keep every generated variant in source; PNG-to-WebP optimization must preserve the original.

## Vector concept and finishing are separate passes

First decide what geometry communicates: sequence, grouping, direction, comparison, or hierarchy. Keep code and labels as static selectable text, preserve exact technical content, and connect stages at meaningful endpoints. Give code windows comparable bounds and clear reading order; do not repeat an API-chain heading in every window.

For technical processes, a numbered copy of the API sentence is not automatically an explanatory diagram. When the source describes memory, copying or execution, represent those supplied objects and transitions, with explanations anchored to the relevant action. Do not invent technical states to make the drawing busier. Test metaphors for unintended readings: an upward jagged route may read as a growth chart even when intended as evasion.

After selecting the concept, polish a common `viewBox`, optical size, inner padding, stroke weight, caps, joins, arrowheads and label alignment. Examine accidental tangencies, floating line ends, uneven gutters, unexplained crossings and inconsistent density. Intentional occlusion should be clear. Decorative associations must remain recognizable at presentation size without implying additional technical facts.

## Review before showing the result

Technical and artistic acceptance are different records. A static PASS, captured frame, or zero overflow does not establish a compelling composition.

For a complete deck, inspect **every slide at 1920×1080, 1280×720, and 900×600** in the browser, then a contact sheet for sequence and repetition. Check real rendering and fonts, not screenshots alone; inspect dense evidence at full size. After a local correction, revisit changed slides and their dependencies. Shared CSS/runtime changes may affect multiple types. Reuse unchanged baseline evidence honestly rather than claiming a new complete run.

Art review should answer:

- Is the main message obvious, and does the image or diagram express it?
- Does quality and character match the selected reference beyond palette and font?
- Are title, content, image and negative space balanced? Are focal objects complete and clear of text?
- Are text sizes, line breaks, margins and optical alignment coherent across comparable slides?
- Are tables, code, URLs, media and documentary screenshots readable and accurate?
- Is there variation across the deck without unrelated styles?

When a second reviewer is available, ask them to identify the weakest slide, explain why, and compare it with the reference. Give the exact revision and scope. Record defects and repeat review of repairs; an unqualified approval label is insufficient.

## Local revisions and evidence

Keep the successful foundation during a narrow request. Reduce clutter by a controlled amount rather than deleting the concept; compare before/after at one viewport. If repeated cosmetic changes fail on the same complaint, change the organization, not just coordinates. Distinguish an implementation defect from evolving preference or a newly authorized content change.

Record separately: frames captured, automatic checks, visual inspection, independent review, and limitations. Include revision, slide IDs, viewports and evidence paths. A filename containing `final` is not proof of approval.

Open an isolated copy containing only `index.html` directly in an ordinary browser with network access disabled when supported. Static checks, CSP and localhost previews complement that check; they do not replace it. If `file:` is blocked, mark direct-file offline opening **unverified** and describe the actual localhost test. Likewise, do not claim fullscreen hover, playback completion, seeking or focus behavior unless exercised. Do not bypass an environment restriction to obtain a PASS.

