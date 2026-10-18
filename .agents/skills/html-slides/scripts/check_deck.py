#!/usr/bin/env python3
"""Static evidence for a portable presentation; does not certify visual quality.

check_deck.py --deck ../index.html --manifest manifest.json [--json report.json]
Exit 1: definite failure. Exit 0 may include explicit needs_review evidence.
"""
from __future__ import annotations
import argparse
import base64
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path, PureWindowsPath
import re
from urllib.parse import unquote_to_bytes
import xml.etree.ElementTree as ET


def sha(data):
    return hashlib.sha256(data).hexdigest()


def normalized(text):
    return " ".join(text.split())


class Node:
    def __init__(self, tag, attrs=(), parent=None):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent
        self.children = []

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Node):
                yield from child.walk()

    def text(self):
        return "".join(c.text() if isinstance(c, Node) else c for c in self.children)

    def ancestors(self):
        current = self
        while current:
            yield current
            current = current.parent


class Document(HTMLParser):
    VOID = set("area base br col embed hr img input link meta param source track wbr".split())

    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.root = Node("document")
        self.current = self.root
        self.feed(text)
        self.close()

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.current)
        self.current.children.append(node)
        if tag not in self.VOID:
            self.current = node

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for node in self.current.ancestors():
            if node.tag == tag:
                self.current = node.parent or self.root
                break

    def handle_data(self, data):
        self.current.children.append(data)


def is_slide(node):
    return node.tag == "section" and "slide" in node.attrs.get("class", "").split()


def hidden(node):
    for item in node.ancestors():
        if item.tag in {"script", "style", "template", "noscript"} or "hidden" in item.attrs:
            return True
        if item.attrs.get("aria-hidden") == "true" and not is_slide(item):
            return True
        if re.search(r"display\s*:\s*none|visibility\s*:\s*(?:hidden|collapse)|opacity\s*:\s*0(?:\s*[;!]|\s*$)", item.attrs.get("style", ""), re.I):
            return True
    return False


def visible_text(node):
    if hidden(node):
        return ""
    if node.tag == "br":
        return "\n"
    return "".join(visible_text(c) if isinstance(c, Node) else c for c in node.children)


MIME = {
    ".png": {"image/png"}, ".jpg": {"image/jpeg"}, ".jpeg": {"image/jpeg"},
    ".webp": {"image/webp"}, ".gif": {"image/gif"}, ".svg": {"image/svg+xml"},
    ".mp4": {"video/mp4"}, ".webm": {"video/webm"}, ".mp3": {"audio/mpeg"},
    ".ogg": {"audio/ogg", "video/ogg"}, ".pdf": {"application/pdf"},
    ".woff": {"font/woff", "application/font-woff"}, ".woff2": {"font/woff2"},
    ".ttf": {"font/ttf", "application/x-font-ttf", "application/font-sfnt"},
    ".otf": {"font/otf", "application/x-font-opentype", "application/font-sfnt"},
}


class Checker:
    def __init__(self, deck, manifest):
        self.deck_path, self.manifest_path = Path(deck), Path(manifest)
        self.evidence, self.embedded = [], []

    def add(self, status, check, detail):
        self.evidence.append(dict(status=status, check=check, detail=detail))

    def require(self, condition, check, detail):
        self.add("passed" if condition else "failed", check, detail)

    def local_file(self, value, label):
        if not isinstance(value, str) or not value or Path(value).is_absolute() or PureWindowsPath(value).is_absolute():
            self.add("failed", label, "Expected a relative source path.")
            return None
        root = self.manifest_path.resolve().parent
        path = (root / value).resolve()
        if not path.is_relative_to(root):
            self.add("failed", label, "Source path escapes the manifest directory.")
            return None
        if not path.is_file():
            self.add("failed", label, "Missing file: " + value)
            return None
        return path

    def json_file(self, value, label):
        path = self.local_file(value, label)
        if path:
            try:
                return json.loads(path.read_text(encoding="utf-8"))
            except (ValueError, OSError) as error:
                self.add("failed", label, str(error))
        return None

    def resource(self, value, where, depth=0):
        value = value.strip()
        if not value or value.startswith("#"):
            return
        if not value.lower().startswith("data:"):
            self.add("failed", "resource", f"Non-embedded runtime resource at {where}: {value[:160]}")
            return
        if depth > 8:
            self.add("needs_review", "resource", "Nested data URI depth exceeds 8.")
            return
        try:
            header, payload = value[5:].split(",", 1)
            mime = header.split(";", 1)[0].lower()
            data = base64.b64decode(re.sub(r"\s", "", payload), validate=True) if ";base64" in header.lower() else unquote_to_bytes(payload)
            self.embedded.append((mime, sha(data)))
        except (ValueError, TypeError) as error:
            self.add("failed", "data_uri", f"Invalid data URI at {where}: {error}")
            return
        if mime == "image/svg+xml":
            try:
                for element in ET.fromstring(data).iter():
                    tag = element.tag.rsplit("}", 1)[-1]
                    if tag in {"script", "foreignObject"}:
                        self.add("needs_review", "svg_syntax", f"SVG {tag} at {where} requires browser review.")
                    for key, item in element.attrib.items():
                        name = key.rsplit("}", 1)[-1]
                        if name in {"href", "src"} and not (tag == "a" and name == "href"):
                            self.resource(item, where + "/svg:" + name, depth + 1)
                        self.css(item, where + "/svg-attribute", depth + 1)
                    if tag == "style":
                        self.css(element.text or "", where + "/svg-style", depth + 1)
            except (ET.ParseError, UnicodeError) as error:
                self.add("failed", "svg", f"Invalid embedded SVG at {where}: {error}")
        elif mime in {"text/html", "application/xhtml+xml"}:
            self.add("needs_review", "nested_html", f"Embedded HTML at {where} requires browser/resource inspection.")
        elif not mime:
            self.add("needs_review", "data_mime", f"Unspecified MIME at {where}.")

    def css(self, text, where, depth=0):
        text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
        for match in re.finditer(r"url\(\s*(?:\"([^\"]*)\"|'([^']*)'|([^)]*))\s*\)", text, re.I):
            self.resource(next(g for g in match.groups() if g is not None).strip(), where, depth)
        for match in re.finditer(r"@import\s+(['\"])(.*?)\1", text, re.I):
            self.resource(match.group(2), where + "/@import", depth)
            self.add("needs_review", "css_import", "CSS imports require inline expansion and review.")
        if re.search(r"\\|image-set\s*\(|paint\s*\(|expression\s*\(|-moz-binding\s*:", text, re.I):
            self.add("needs_review", "css_syntax", f"CSS escapes or unsupported resource-producing syntax at {where}.")

    def javascript(self, text):
        if re.search(r"\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|importScripts)\s*\(|\bimport\s*(?:\(|[{'\"*]|[\w$])|\b(?:Worker|SharedWorker)\s*\(", text):
            self.add("failed", "runtime_dependency", "JavaScript contains a network/module/worker API; replace it with inline runtime.")
        if text.strip():
            self.add("needs_review", "javascript", "Inline JavaScript needs browser review; static lint cannot prove behavior or absence of dynamic requests.")

    def inspect_html(self, doc):
        styles = []
        for node in doc.root.walk():
            if node.tag == "base":
                self.add("failed", "base", "A base URL changes resolution.")
            if node.tag == "meta" and node.attrs.get("http-equiv", "").lower() == "refresh":
                self.add("failed", "redirect", "Meta refresh is not a portable deck resource.")
            for key, value in node.attrs.items():
                if value is None:
                    continue
                if key in {"src", "poster", "data", "xlink:href"} or (key == "href" and node.tag != "a"):
                    self.resource(value, f"<{node.tag}> {key}")
                elif key == "href" and node.tag == "a" and re.match(r"\s*javascript:", value, re.I):
                    self.add("failed", "hyperlink", "javascript: links are executable.")
                elif key in {"srcset", "imagesrcset", "srcdoc"}:
                    self.add("needs_review", "html_syntax", f"<{node.tag}> {key} requires browser/resource review.")
                elif key.startswith("on"):
                    self.javascript(value)
                if key == "style":
                    self.css(value, "inline style")
            if node.tag == "style":
                styles.append(node.text())
                self.css(node.text(), "style element")
            if node.tag == "script" and "src" not in node.attrs:
                self.javascript(node.text())
        return "\n".join(styles)

    def mapping(self, manifest, slides):
        expected = manifest.get("slides", [])
        actual_ids = [n.attrs.get("data-slide-id") for n in slides]
        ids = [s.get("id") for s in expected]
        self.require(bool(ids) and all(isinstance(i, str) and i for i in ids) and len(set(ids)) == len(ids), "stable_ids", "Manifest IDs must be non-empty and unique.")
        self.require(actual_ids == ids, "slide_order", f"HTML IDs/order: {actual_ids}; manifest: {ids}")
        for node, item in zip(slides, expected):
            try:
                pages = [int(p) for p in node.attrs.get("data-source-pages", "").split(",") if p.strip()]
            except ValueError:
                pages = None
            self.require(pages == item.get("source_pages"), "page_mapping", f"Slide {item.get('id')} matches manifest source_pages.")
        count = manifest.get("source_pdf", {}).get("page_count")
        if not isinstance(count, int) or isinstance(count, bool) or count < 1:
            self.add("failed", "page_count", "source_pdf.page_count must be a positive integer.")
            return
        approved = []
        if manifest.get("decisions"):
            decisions = self.json_file(manifest["decisions"], "decisions")
            if isinstance(decisions, list):
                approved = [d for d in decisions if d.get("type") == "content_change" and d.get("status") == "approved" and d.get("user_instruction", "").strip()]
            else:
                self.add("failed", "decisions", "Expected an array of decisions.")
        page_to_ids = {p: [] for p in range(1, count + 1)}
        for item in expected:
            pages = item.get("source_pages", [])
            if not isinstance(pages, list) or any(not isinstance(p, int) or isinstance(p, bool) or p not in page_to_ids for p in pages) or len(set(pages)) != len(pages):
                self.add("failed", "page_mapping", f"Invalid source_pages for {item.get('id')}")
                continue
            for page in pages:
                page_to_ids[page].append(item["id"])
        if manifest.get("phase") == "prototype":
            self.add("needs_review", "prototype", "Partial prototype; complete-deck preservation is not certified.")
            return
        if manifest.get("phase") != "complete":
            self.add("failed", "phase", "Manifest phase must be prototype or complete.")
        def covered(page=None, slide=None):
            return any((page is None or page in d.get("source_pages", [])) and (slide is None or slide in d.get("slide_ids", [])) for d in approved)
        for page, mapped in page_to_ids.items():
            if len(mapped) != 1:
                approved_mapping = all(covered(page=page, slide=sid) for sid in mapped) if mapped else covered(page=page)
                self.require(approved_mapping, "content_change", f"Page {page} maps to {mapped}; omission/split needs approval covering affected pages and slides.")
        for item in expected:
            if len(item.get("source_pages", [])) != 1:
                pages = item.get("source_pages", [])
                approved_mapping = all(covered(page=page, slide=item["id"]) for page in pages) if pages else covered(slide=item["id"])
                self.require(approved_mapping, "content_change", f"Slide {item['id']} merges pages or adds content; needs approval covering affected pages and slides.")
        flattened = [p for item in expected for p in item.get("source_pages", [])]
        if flattened != sorted(flattened):
            changed = {p for i, p in enumerate(flattened) if any(q > p for q in flattened[:i]) or any(q < p for q in flattened[i + 1:])}
            self.require(all(covered(page=p) for p in changed), "source_order", "Reordered pages need approval covering affected pages.")

    def content(self, manifest, slides):
        content = self.json_file(manifest.get("content"), "content")
        if not isinstance(content, dict) or not isinstance(content.get("units"), list):
            self.add("failed", "content", "Expected an object with units array.")
            return
        by_slide = {n.attrs.get("data-slide-id"): n for n in slides}
        seen = set()
        for unit in content["units"]:
            uid, sid = unit.get("id"), unit.get("slide_id")
            if not isinstance(uid, str) or not uid or uid in seen:
                self.add("failed", "content_unit", "Unit IDs must be unique and non-empty.")
                continue
            seen.add(uid)
            slide = by_slide.get(sid)
            matches = [n for n in slide.walk() if n.attrs.get("data-source-id") == uid and not hidden(n)] if slide else []
            if len(matches) != 1:
                self.add("failed", "content_unit", f"{uid}: expected one visible source element on {sid}, found {len(matches)}.")
                continue
            node = matches[0]
            kind, expected = unit.get("kind"), unit.get("text")
            self.require(isinstance(unit.get("original"), str), "content_original", f"{uid}: original must preserve source text as a string.")
            if not isinstance(expected, str):
                self.add("failed", "content_unit", f"{uid}: text must be a string.")
                continue
            page = unit.get("source_page")
            mapped = [int(p) for p in slide.attrs.get("data-source-pages", "").split(",") if p.strip().isdigit()]
            self.require((page in mapped and isinstance(page, int) and not isinstance(page, bool)) or (page is None and not mapped), "unit_mapping", f"{uid}: source_page belongs to its slide mapping.")
            actual = visible_text(node)
            if kind == "url":
                good = expected in [n.attrs.get("href") for n in node.walk() if n.tag == "a" and not hidden(n)]
            elif kind == "code":
                good = actual.replace("\r\n", "\n") == expected.replace("\r\n", "\n")
            elif kind in {"prose", "value"}:
                good = normalized(actual) == normalized(expected)
            else:
                self.add("needs_review", "content_kind", f"{uid}: unsupported kind {kind!r}.")
                continue
            self.require(good, "content_exactness", f"{uid}: {kind} comparison retains Unicode and punctuation.")
            if unit.get("original") != expected:
                self.add("needs_review", "translation", f"{uid}: review equivalence against original.")
        self.add("needs_review", "visibility", "Explicit hidden/script/style/template content is excluded; CSS, clipping, occlusion and runtime visibility require browser review.")

    def assets(self, manifest, css, html):
        seen = set()
        for item in manifest.get("assets", []):
            aid = item.get("id")
            self.require(bool(aid) and aid not in seen, "asset_id", f"Unique asset ID: {aid}")
            seen.add(aid)
            path = self.local_file(item.get("path"), f"asset:{aid}")
            if not path:
                continue
            data = path.read_bytes()
            digest = sha(data)
            self.require(digest == item.get("sha256"), "asset_hash", f"{aid}: source matches declared SHA-256.")
            mime = item.get("mime", "").lower()
            suffix = path.suffix.lower()
            if suffix in MIME:
                self.require(mime in MIME[suffix], "asset_mime", f"{aid}: {mime} matches {suffix}.")
            else:
                self.add("needs_review", "asset_mime", f"{aid}: unknown extension; review MIME.")
            if item.get("embedded") is True:
                exact = (mime, digest) in self.embedded
                if not exact and mime == "image/svg+xml":
                    try:
                        exact = data.decode("utf-8").strip() in html
                    except UnicodeError:
                        pass
                self.require(exact, "asset_embedded", f"{aid}: exact registered bytes embedded with declared MIME; inline SVG must retain UTF-8 source.")
            elif item.get("embedded") is not False:
                self.add("failed", "asset_embedded", f"{aid}: embedded must be boolean.")
            if item.get("family") is not None or item.get("weight") is not None:
                family, weight = str(item.get("family", "")), str(item.get("weight", ""))
                faces = re.findall(r"@font-face\s*\{([^}]*)\}", css, re.I | re.S)
                found = False
                for face in faces:
                    urls = re.findall(r"url\(\s*['\"]?(data:[^)'\"]+)['\"]?\s*\)", face, re.I)
                    hashes = []
                    for url in urls:
                        try:
                            header, payload = url[5:].split(",", 1)
                            hashes.append(sha(base64.b64decode(payload) if ";base64" in header else unquote_to_bytes(payload)))
                        except ValueError:
                            continue
                    if re.search(r"font-family\s*:\s*['\"]?" + re.escape(family) + r"['\"]?\s*;", face, re.I) and re.search(r"font-weight\s*:\s*" + re.escape(weight) + r"\s*;", face, re.I) and digest in hashes:
                        found = True
                self.require(bool(family and weight and found), "font_face", f"{aid}: embedded @font-face declares {family!r} weight {weight}.")
        if manifest.get("assets"):
            self.add("needs_review", "asset_decode", "Matching resource bytes/MIME do not prove media or font decoding; verify loaded images, metadata, glyphs and playback in a browser.")

    def run(self):
        try:
            manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
            html = self.deck_path.read_text(encoding="utf-8")
            self.require(manifest.get("schema_version") == 1, "schema", "Supported schema_version is 1.")
            output = manifest.get("output")
            output_is_relative = isinstance(output, str) and bool(output) and not Path(output).is_absolute() and not PureWindowsPath(output).is_absolute()
            self.require(output_is_relative and (self.manifest_path.resolve().parent / output).resolve() == self.deck_path.resolve(), "output", "The explicit deck path must match manifest.output resolved relative to the manifest.")
            self.require(isinstance(manifest.get("identity"), str) and bool(manifest["identity"].strip()), "identity", "Manifest names the selected identity profile.")
            self.require(manifest.get("language") in {"en", "ru"}, "language", "Supported v1 language is en or ru.")
            pdf = manifest.get("source_pdf", {})
            source = self.local_file(pdf.get("path"), "source_pdf")
            if source:
                data = source.read_bytes()
                self.require(data.startswith(b"%PDF-"), "pdf_signature", "Source has PDF signature.")
                self.require(sha(data) == pdf.get("sha256"), "pdf_hash", "PDF matches manifest SHA-256.")
                self.add("needs_review", "pdf_page_count", "page_count is supplied metadata; confirm with a PDF reader, not this stdlib checker.")
            doc = Document(html)
            slides = [n for n in doc.root.walk() if is_slide(n)]
            css = self.inspect_html(doc)
            self.mapping(manifest, slides)
            self.content(manifest, slides)
            self.assets(manifest, css, html)
        except (OSError, ValueError, TypeError, AttributeError, KeyError) as error:
            self.add("failed", "input", f"Invalid/unreadable input: {error}")
        counts = {status: sum(e["status"] == status for e in self.evidence) for status in ("passed", "failed", "needs_review")}
        return dict(schema_version=1, deck=str(self.deck_path), status="failed" if counts["failed"] else "needs_review" if counts["needs_review"] else "passed", counts=counts, evidence=self.evidence)


def check(deck, manifest):
    return Checker(deck, manifest).run()


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--deck", required=True, type=Path)
    parser.add_argument("--manifest", required=True, type=Path)
    parser.add_argument("--json", dest="json_path", type=Path)
    args = parser.parse_args(argv)
    report = check(args.deck, args.manifest)
    if args.json_path:
        args.json_path.parent.mkdir(parents=True, exist_ok=True)
        args.json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if report["counts"]["failed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
