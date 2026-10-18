"""Assemble already captured frames using Pillow; never mark them reviewed.

Input: {"captures":[{"slide_id":"p001","viewport":[1920,1080],"path":"frames/p001.jpg"}]}.
Paths are relative to this JSON file, independent of the working directory.
"""
from __future__ import annotations
import argparse
import json
import math
from pathlib import Path

def make_sheet(frames: str | Path, output: str | Path, *, columns: int=4,
               thumbnail: tuple[int,int]=(384,216), font: str | Path | None=None,
               viewport: str | None=None) -> dict:
    from PIL import Image,ImageDraw,ImageFont
    if columns<1 or min(thumbnail)<1:
        raise ValueError('Columns and thumbnail dimensions must be positive')
    frames=Path(frames).resolve()
    captures=json.loads(frames.read_text(encoding='utf-8'))['captures']
    if viewport:
        captures=[c for c in captures if 'x'.join(map(str,c['viewport']))==viewport]
    if not captures:
        raise ValueError('No captured frames match the requested scope')
    loaded=[]
    for capture in captures:
        with Image.open(frames.parent/capture['path']) as original:
            image=original.convert('RGB')
        image.thumbnail(thumbnail,Image.Resampling.LANCZOS)
        loaded.append((image,f"{capture['slide_id']} | {'x'.join(map(str,capture['viewport']))}"))
    columns=min(columns,len(loaded))
    gap,label_height=16,36
    tw,th=thumbnail
    rows=math.ceil(len(loaded)/columns)
    board=Image.new('RGB',(columns*(tw+gap)+gap,rows*(th+label_height+gap)+gap),'#11151c')
    draw=ImageDraw.Draw(board)
    face=ImageFont.truetype(str(font),18) if font else ImageFont.load_default(size=16)
    for i,(image,label) in enumerate(loaded):
        x,y=gap+(i%columns)*(tw+gap),gap+(i//columns)*(th+label_height+gap)
        board.paste(image,(x+(tw-image.width)//2,y+(th-image.height)//2))
        while label and draw.textbbox((0,0),label,font=face)[2]>tw:
            label=label[:-1]
        draw.text((x,y+th+6),label,fill='#eeeeee',font=face)
    output=Path(output)
    output.parent.mkdir(parents=True,exist_ok=True)
    board.save(output)
    return {'frames':len(loaded),'columns':columns,'rows':rows,'width':board.width,'height':board.height,'output':str(output)}

def main() -> int:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--frames',type=Path,required=True)
    parser.add_argument('--out',type=Path,required=True)
    parser.add_argument('--columns',type=int,default=4)
    parser.add_argument('--thumbnail',default='384x216')
    parser.add_argument('--font',type=Path)
    parser.add_argument('--viewport',help='For example 1920x1080')
    args=parser.parse_args()
    try:
        dimensions=tuple(map(int,args.thumbnail.split('x')))
        if len(dimensions)!=2:
            raise ValueError('Thumbnail must be WIDTHxHEIGHT')
        result=make_sheet(args.frames,args.out,columns=args.columns,thumbnail=dimensions,font=args.font,viewport=args.viewport)
    except (OSError,ValueError,KeyError,ImportError) as exc:
        parser.exit(1,f'Contact sheet failed: {exc}\n')
    print(json.dumps(result))
    return 0

if __name__=='__main__':
    raise SystemExit(main())
