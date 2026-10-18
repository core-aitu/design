import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from PIL import Image

spec=importlib.util.spec_from_file_location('contact_sheet',Path(__file__).resolve().parents[1]/'scripts/contact_sheet.py')
sheets=importlib.util.module_from_spec(spec)
spec.loader.exec_module(sheets)

class ContactSheetTests(unittest.TestCase):
    def test_arbitrary_count_and_order(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory); captures=[]
            for i in range(5):
                Image.new('RGB',(160,90),(i*40,0,0)).save(root/f'{i}.png')
                captures.append({'slide_id':f'p{i+1:03d}','viewport':[1280,720],'path':f'{i}.png'})
            manifest=root/'captures.json'; manifest.write_text(json.dumps({'captures':captures}),encoding='utf-8')
            result=sheets.make_sheet(manifest,root/'contact.png',columns=3,thumbnail=(160,90))
            self.assertEqual((result['frames'],result['rows'],result['columns']),(5,2,3))
            with Image.open(root/'contact.png') as board:
                self.assertEqual(board.getpixel((96,61)),(0,0,0))
                self.assertEqual(board.getpixel((272,61)),(40,0,0))
            self.assertEqual(json.loads(manifest.read_text())['captures'],captures)
    def test_missing_frame_fails(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory); manifest=root/'captures.json'
            manifest.write_text(json.dumps({'captures':[{'slide_id':'p1','viewport':[900,600],'path':'absent.png'}]}))
            with self.assertRaises(FileNotFoundError): sheets.make_sheet(manifest,root/'contact.png')
            self.assertFalse((root/'contact.png').exists())

if __name__=='__main__': unittest.main()
