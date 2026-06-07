from PIL import Image
import os

src = r"C:\Users\Jeff\Desktop\claude-dnd-engine\maps\world\world-names.png"
out = r"C:\Users\Jeff\Desktop\claude-dnd-engine\maps\world\tiles"
img = Image.open(src)
cw, ch = 512, 472

tiles = {
    "nw": (1,6,1,5), "n":  (5,12,1,5), "ne": (10,16,1,5),
    "w":  (1,6,4,9),  "c":  (5,12,4,9),  "e":  (10,16,4,9),
    "sw": (1,6,8,13), "s":  (5,12,8,13), "se": (10,16,8,13),
}

for name, (c1,c2,r1,r2) in tiles.items():
    left   = (c1-1)*cw
    top    = (r1-1)*ch
    right  = min(8192, c2*cw)
    bottom = min(6144, r2*ch)
    crop = img.crop((left,top,right,bottom))
    path = os.path.join(out, name + ".png")
    crop.save(path)
    print(name + ".png: " + str(crop.size))
