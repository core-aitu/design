"""Behavioral tests for static evidence; no third-party dependencies."""
import base64
from contextlib import redirect_stdout
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "check_deck.py"
SPEC = importlib.util.spec_from_file_location("check_deck", SCRIPT)
checker = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(checker)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def uri(data, mime="image/svg+xml"):
    return "data:" + mime + ";base64," + base64.b64encode(data).decode("ascii")


class DeckChecks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.deck = self.root / "index.html"
        self.manifest_path = self.root / "manifest.json"
        pdf = b"%PDF-1.7\nfixture (page count checked independently)"
        (self.root / "presentation_draft.pdf").write_bytes(pdf)
        self.manifest = dict(schema_version=1, phase="complete", identity="year_1", language="en", source_pdf=dict(path="presentation_draft.pdf", sha256=digest(pdf), page_count=1), content="content.json", output="index.html", slides=[dict(id="p001", source_pages=[1], title="Fixture")], assets=[])
        self.units = [dict(id="u1", source_page=1, slide_id="p001", kind="prose", original="Привет, AI — 4.6!", text="Привет, AI — 4.6!")]
        self.html = '<!doctype html><section class="slide" data-slide-id="p001" data-source-pages="1"><p data-source-id="u1">Привет, AI — 4.6!</p></section>'

    def run_check(self):
        self.deck.write_text(self.html, encoding="utf-8", newline="")
        self.manifest_path.write_text(json.dumps(self.manifest, ensure_ascii=False), encoding="utf-8")
        (self.root / "content.json").write_text(json.dumps(dict(units=self.units), ensure_ascii=False), encoding="utf-8")
        return checker.check(self.deck, self.manifest_path)

    def failures(self, report):
        return [e for e in report["evidence"] if e["status"] == "failed"]

    def expect_failure(self, check):
        report = self.run_check()
        self.assertTrue(any(e["check"] == check for e in self.failures(report)), report)
        return report

    def register(self, data, name="art.svg", mime="image/svg+xml", **extra):
        (self.root / name).write_bytes(data)
        self.manifest["assets"].append(dict(id=name, path=name, role="illustration", mime=mime, sha256=digest(data), embedded=True, **extra))

    def test_valid_unicode_prose_keeps_browser_review(self):
        report = self.run_check()
        self.assertEqual(self.failures(report), [])
        self.assertEqual(report["status"], "needs_review")
        self.assertTrue(any(e["check"] == "visibility" for e in report["evidence"]))

    def test_punctuation_cannot_be_removed(self):
        self.html = self.html.replace("AI — 4.6!", "AI 46")
        self.expect_failure("content_exactness")

    def test_cyrillic_cannot_be_removed(self):
        self.html = self.html.replace("Привет, ", "")
        self.expect_failure("content_exactness")

    def test_whitespace_normalization_is_allowed_for_prose(self):
        self.html = self.html.replace("Привет, AI", "Привет,\n   AI")
        self.assertEqual(self.failures(self.run_check()), [])

    def test_code_preserves_operators_and_whitespace(self):
        self.units[0].update(kind="code", original="x != y;\n  return 7;", text="x != y;\n  return 7;")
        self.html = self.html.replace("Привет, AI — 4.6!", "x != y;\r\n  return 7;")
        self.assertEqual(self.failures(self.run_check()), [])
        self.html = self.html.replace("!=", "==")
        self.expect_failure("content_exactness")

    def test_exact_clickable_url_allowed_external(self):
        self.units[0].update(kind="url", original="https://example.test/a?b=1&c=2", text="https://example.test/a?b=1&c=2")
        self.html = self.html.replace("<p data-source-id=\"u1\">Привет, AI — 4.6!</p>", '<a data-source-id="u1" href="https://example.test/a?b=1&amp;c=2">Read</a>')
        self.assertEqual(self.failures(self.run_check()), [])
        self.html = self.html.replace("b=1", "b=2")
        self.expect_failure("content_exactness")

    def test_hidden_annotation_cannot_satisfy_content(self):
        self.html = self.html.replace('<p data-source-id=', '<p hidden data-source-id=')
        self.expect_failure("content_unit")

    def test_hidden_descendant_cannot_supply_text(self):
        self.html = self.html.replace("Привет, AI — 4.6!", "<span hidden>Привет, AI — 4.6!</span>")
        self.expect_failure("content_exactness")

    def test_template_cannot_supply_text(self):
        self.html = self.html.replace("<p", "<template><p").replace("</p>", "</p></template>")
        self.expect_failure("content_unit")

    def test_inactive_slide_aria_hidden_is_supported(self):
        self.html = self.html.replace('class="slide"', 'class="slide" aria-hidden="true"')
        self.assertEqual(self.failures(self.run_check()), [])

    def test_slide_ids_and_order_match_manifest(self):
        self.manifest["slides"].append(dict(id="p002", source_pages=[2]))
        self.manifest["source_pdf"]["page_count"] = 2
        second = '<section class="slide" data-slide-id="p002" data-source-pages="2"></section>'
        self.html = second + self.html
        self.expect_failure("slide_order")

    def test_reordered_source_requires_approval_even_if_manifest_matches(self):
        self.manifest["slides"] = [dict(id="p002", source_pages=[2]), dict(id="p001", source_pages=[1])]
        self.manifest["source_pdf"]["page_count"] = 2
        self.html = '<section class="slide" data-slide-id="p002" data-source-pages="2"></section>' + self.html
        self.expect_failure("source_order")

    def test_omission_requires_specific_approved_decision(self):
        self.manifest["source_pdf"]["page_count"] = 2
        self.expect_failure("content_change")
        self.manifest["decisions"] = "decisions.json"
        (self.root / "decisions.json").write_text(json.dumps([dict(id="d1", type="content_change", status="approved", source_pages=[2], slide_ids=[], user_instruction="Omit page 2")]), encoding="utf-8")
        self.assertEqual(self.failures(self.run_check()), [])

    def test_prototype_subset_is_explicit_review(self):
        self.manifest.update(phase="prototype")
        self.manifest["source_pdf"]["page_count"] = 5
        report = self.run_check()
        self.assertEqual(self.failures(report), [])
        self.assertTrue(any(e["check"] == "prototype" and e["status"] == "needs_review" for e in report["evidence"]))

    def test_merged_pages_need_decision_covering_pages_and_slide(self):
        self.manifest["source_pdf"]["page_count"] = 2
        self.manifest["slides"][0]["source_pages"] = [1, 2]
        self.html = self.html.replace('data-source-pages="1"', 'data-source-pages="1,2"')
        self.expect_failure("content_change")
        self.manifest["decisions"] = "decisions.json"
        decision = dict(id="d1", type="content_change", status="approved", source_pages=[1], slide_ids=["p001"], user_instruction="Merge pages 1 and 2")
        (self.root / "decisions.json").write_text(json.dumps([decision]), encoding="utf-8")
        self.expect_failure("content_change")
        decision["source_pages"] = [1, 2]
        (self.root / "decisions.json").write_text(json.dumps([decision]), encoding="utf-8")
        self.assertEqual(self.failures(self.run_check()), [])

    def test_source_unit_page_must_match_slide(self):
        self.units[0]["source_page"] = 2
        self.expect_failure("unit_mapping")

    def test_value_keeps_decimal_and_units(self):
        self.units[0].update(kind="value", original="1.5 MiB", text="1.5 MiB")
        self.html = self.html.replace("Привет, AI — 4.6!", "1.5\nMiB")
        self.assertEqual(self.failures(self.run_check()), [])
        self.html = self.html.replace("1.5", "15")
        self.expect_failure("content_exactness")

    def test_missing_asset(self):
        self.manifest["assets"] = [dict(id="missing", path="missing.png", role="illustration", mime="image/png", sha256="a" * 64, embedded=True)]
        self.expect_failure("asset:missing")

    def test_asset_hash_comes_from_input_not_html(self):
        data = b'<svg xmlns="http://www.w3.org/2000/svg"/>'
        self.register(data)
        self.html += '<img alt="Art" src="' + uri(data) + '">'
        self.assertEqual(self.failures(self.run_check()), [])
        self.manifest["assets"][0]["sha256"] = "0" * 64
        self.expect_failure("asset_hash")

    def test_asset_not_actually_embedded(self):
        self.register(b'<svg xmlns="http://www.w3.org/2000/svg"/>')
        self.expect_failure("asset_embedded")

    def test_asset_mime_mismatch(self):
        data = b"png fixture"
        self.register(data, name="art.png", mime="image/jpeg")
        self.html += '<img src="' + uri(data, "image/jpeg") + '">'
        self.expect_failure("asset_mime")

    def test_external_css_image_and_script_fail(self):
        for extra in ('<style>.x{background:url(https://example.test/a.png)}</style>', '<img src="adjacent.png">', '<script src="https://example.test/a.js"></script>'):
            with self.subTest(extra=extra):
                original = self.html
                self.html += extra
                self.expect_failure("resource")
                self.html = original

    def test_inline_svg_fragment_and_nested_data_are_allowed(self):
        inner = b'<svg xmlns="http://www.w3.org/2000/svg"><path id="p" d="M0 0"/><use href="#p"/></svg>'
        outer = ('<svg xmlns="http://www.w3.org/2000/svg"><image href="' + uri(inner) + '"/></svg>').encode()
        self.register(outer)
        self.html += '<img src="' + uri(outer) + '"><svg><use href="#local"/></svg>'
        self.assertEqual(self.failures(self.run_check()), [])

    def test_nested_svg_external_reference_is_found(self):
        inner = b'<svg xmlns="http://www.w3.org/2000/svg"><image href="https://example.test/a.png"/></svg>'
        outer = ('<svg xmlns="http://www.w3.org/2000/svg"><image href="' + uri(inner) + '"/></svg>').encode()
        self.html += '<img src="' + uri(outer) + '">'
        self.expect_failure("resource")

    def test_nested_svg_css_dependency_is_found(self):
        data = b'<svg xmlns="http://www.w3.org/2000/svg"><style>.x{fill:url(other.svg#p)}</style></svg>'
        self.html += '<img src="' + uri(data) + '">'
        self.expect_failure("resource")

    def test_invalid_base64_is_failure(self):
        self.html += '<img src="data:image/png;base64,@@invalid">'
        self.expect_failure("data_uri")

    def test_font_family_and_weight_must_point_at_registered_bytes(self):
        data = b"font fixture"
        self.register(data, name="space.ttf", mime="font/ttf", family="Space Mono", weight=400)
        self.html += '<style>@font-face{font-family:"Space Mono";font-weight:400;src:url(' + uri(data, "font/ttf") + ');}</style>'
        self.assertEqual(self.failures(self.run_check()), [])
        self.html = self.html.replace("font-weight:400", "font-weight:700")
        self.expect_failure("font_face")

    def test_unsupported_css_has_review_status(self):
        self.html += '<style>.x{background:image-set("a.png" 1x)}</style>'
        report = self.run_check()
        self.assertTrue(any(e["check"] == "css_syntax" and e["status"] == "needs_review" for e in report["evidence"]))

    def test_network_javascript_fails_and_other_script_needs_review(self):
        self.html += '<script>fetch("https://example.test")</script>'
        self.expect_failure("runtime_dependency")
        self.html = self.html.replace('fetch("https://example.test")', 'console.log("ready")')
        report = self.run_check()
        self.assertEqual(self.failures(report), [])
        self.assertTrue(any(e["check"] == "javascript" for e in report["evidence"]))

    def test_static_module_import_is_dependency(self):
        self.html += '<script type="module">import example from "adjacent.js";</script>'
        self.expect_failure("runtime_dependency")

    def test_source_path_cannot_escape_bundle(self):
        self.manifest["source_pdf"]["path"] = "../presentation_draft.pdf"
        self.expect_failure("source_pdf")

    def test_checked_output_must_match_manifest(self):
        self.manifest["output"] = "other.html"
        self.expect_failure("output")

    def test_cli_exit_code_and_json_evidence(self):
        self.run_check()
        report_path = self.root / "qa" / "static.json"
        args = ["--deck", str(self.deck), "--manifest", str(self.manifest_path), "--json", str(report_path)]
        with redirect_stdout(io.StringIO()):
            self.assertEqual(checker.main(args), 0)
        self.assertEqual(json.loads(report_path.read_text(encoding="utf-8"))["status"], "needs_review")
        self.deck.write_text(self.html.replace("Привет", "Goodbye"), encoding="utf-8")
        with redirect_stdout(io.StringIO()):
            self.assertEqual(checker.main(args), 1)


if __name__ == "__main__":
    unittest.main()
