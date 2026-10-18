import base64
import hashlib
import importlib.util
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('portable_assets',Path(__file__).resolve().parents[1]/'scripts/portable_assets.py')
assets=importlib.util.module_from_spec(spec)
spec.loader.exec_module(assets)

class PortableAssetsTests(unittest.TestCase):
    def test_original_bytes_and_hash(self):
        with tempfile.TemporaryDirectory() as directory:
            file=Path(directory)/'document.png'; raw=b'\x89PNG\r\n\x1a\noriginal evidence bytes'; file.write_bytes(raw)
            uri=assets.data_uri(file,hashlib.sha256(raw).hexdigest())
            self.assertEqual(uri.split(',')[0],'data:image/png;base64')
            self.assertEqual(base64.b64decode(uri.split(',')[1]),raw)
            with self.assertRaisesRegex(ValueError,'SHA-256 mismatch'): assets.data_uri(file,'0'*64)
    def test_no_silent_fallback(self):
        with tempfile.TemporaryDirectory() as directory:
            file=Path(directory)/'missing.webp'
            with self.assertRaises(FileNotFoundError): assets.data_uri(file)
            file.touch()
            with self.assertRaisesRegex(ValueError,'empty'): assets.data_uri(file)
    def test_font_declaration(self):
        with tempfile.TemporaryDirectory() as directory:
            file=Path(directory)/'font.ttf'; file.write_bytes(b'test-font-bytes')
            rule=assets.font_face(file,'Space Mono',700)
            self.assertIn('font-weight:700',rule); self.assertIn('data:font/ttf;base64,',rule)
            with self.assertRaises(ValueError): assets.font_face(file,"bad';}body{",400)
    def test_svgz_is_explicit(self):
        with tempfile.TemporaryDirectory() as directory:
            file=Path(directory)/'poster.svgz'; file.write_bytes(b'compressed')
            with self.assertRaisesRegex(ValueError,'Export SVGZ'): assets.data_uri(file)

if __name__=='__main__': unittest.main()
