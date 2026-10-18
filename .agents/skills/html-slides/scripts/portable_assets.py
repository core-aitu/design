"""Standard-library asset helpers copied into a presentation's source/vendor.

Importing this module does not read, create, copy or download anything.
"""
from __future__ import annotations
import base64
import hashlib
import mimetypes
from pathlib import Path

MIME_TYPES = {'.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg',
              '.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif',
              '.ttf':'font/ttf','.otf':'font/otf','.woff':'font/woff',
              '.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm',
              '.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav'}

def read_asset(path: str | Path, expected_sha256: str | None = None) -> bytes:
    """Read a required asset, checking its independently recorded hash if supplied."""
    path = Path(path)
    if not path.is_file():
        raise FileNotFoundError(f'Required asset does not exist: {path}')
    raw = path.read_bytes()
    if not raw:
        raise ValueError(f'Required asset is empty: {path}')
    if expected_sha256 is not None:
        actual = hashlib.sha256(raw).hexdigest()
        if actual != expected_sha256.lower():
            raise ValueError(f'Asset SHA-256 mismatch: {path}; expected {expected_sha256}, got {actual}')
    return raw

def data_uri(path: str | Path, expected_sha256: str | None = None, *, mime: str | None = None) -> str:
    """Embed bytes verbatim. Export compressed SVGZ as SVG explicitly first."""
    path = Path(path)
    if path.suffix.lower() == '.svgz':
        raise ValueError(f'Export SVGZ as self-contained SVG before embedding: {path}')
    media_type = mime or MIME_TYPES.get(path.suffix.lower()) or mimetypes.guess_type(path)[0]
    if not media_type or any(c.isspace() for c in media_type) or ';' in media_type or ',' in media_type:
        raise ValueError(f'Provide a valid explicit MIME type for asset: {path}')
    return f'data:{media_type};base64,' + base64.b64encode(read_asset(path,expected_sha256)).decode('ascii')

def font_face(path: str | Path, family: str, weight: int = 400, *, style: str = 'normal',
              expected_sha256: str | None = None) -> str:
    """Return inline @font-face; retain the font's license in source and delivery."""
    path = Path(path)
    formats = {'.ttf':'truetype','.otf':'opentype','.woff':'woff','.woff2':'woff2'}
    if path.suffix.lower() not in formats:
        raise ValueError(f'Unsupported browser font file: {path}')
    if not family or any(ord(c)<32 or c in "'\"\\;{}" for c in family):
        raise ValueError('Font family must be a nonempty CSS-safe family name')
    if isinstance(weight,bool) or not isinstance(weight,int) or not 1<=weight<=1000:
        raise ValueError('Font weight must be an integer from 1 to 1000')
    if style not in {'normal','italic','oblique'}:
        raise ValueError('Unsupported font style')
    uri = data_uri(path,expected_sha256)
    return (f"@font-face{{font-family:'{family}';font-style:{style};font-weight:{weight};"
            f"src:url('{uri}') format('{formats[path.suffix.lower()]}');font-display:block;}}")
