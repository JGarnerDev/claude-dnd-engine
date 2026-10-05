#!/usr/bin/env python3
# battlemap.py
# consumers: CLAUDE.md, maps/CLAUDE.md -- update these if usage, flags, or output format change.
# Render a session's battlemap layouts (text grids, one char per 5-ft square) into PNGs.
#
# Layouts live beside the session plan: scheduler/sessions/<Session folder>/maps/<name>.txt
# (gitignored -- local planning reference; the plan carries the grid refs that matter).
# Each layout renders to two images:
#   <name>-vtt.png  terrain only, no grid, no tokens -- drop into Roll20 / Foundry / Owlbear
#   <name>-key.png  DM copy: grid refs (A1 = top-left), tokens, zones, labels, legend
# Standing location maps (kept and grown over time) live in maps/battlemaps/<location>/ and
# render beside their layout. Session output goes to maps/battlemaps/session-<n>/ (gitignored like every map image -- never commit them).
#
# Layout file format (sections start with "== name =="; lines starting with ";" are comments
# outside the terrain section):
#   title: The New Wing
#   scale: 25                                         (feet per square; default 5)
#   note: one line printed under the title on the key   (repeatable)
#   == terrain ==
#   <grid rows; chars from TERRAIN below>
#   == legend ==
#   r  Rubble -- difficult terrain                      (overrides a terrain name)
#   == tokens ==
#   J3  S  purple  Sable Wren -- bound and gagged        (ref, glyph, colour, name)
#   == zones ==
#   M9:O10  gold  L  Light -- Steady 12-16 lands here    (ref:ref, colour, tag, name)
#   == labels ==
#   Q4  Old core (set dressing)
#
# Usage:
#   uv run scripts/battlemap.py --session 29
#   uv run scripts/battlemap.py "scheduler/sessions/Session 29 The Mistake/maps/new-wing.txt"
#   uv run scripts/battlemap.py maps/battlemaps/golden-lioness   (a location's standing maps)
#   uv run scripts/battlemap.py --session 29 --px 100        (Foundry's default grid size)
#   uv run scripts/battlemap.py --session 29 --vtt-grid      (burn a faint grid into the VTT image)

import argparse
import random
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO = Path(__file__).resolve().parent.parent

# char -> default legend name. Floors first; objects draw on top of the nearest floor.
TERRAIN = {
    '.': 'Dirt yard',
    ',': 'Grass',
    '=': 'Lane / street',
    '_': 'New timber floor',
    'w': 'Old timber floor',
    '#': 'Wall',
    'd': 'Door',
    'D': 'Open doorway',
    'r': 'Rubble -- difficult terrain',
    'c': 'Crates -- half cover',
    'C': 'Tall cargo stack (10 ft) -- full cover, climbable',
    'k': 'Casks',
    'b': 'Bar counter -- half cover',
    'H': 'Hearth',
    'S': 'Stage',
    't': 'Table',
    'T': 'Tree',
    '~': 'Stream',
    'v': 'Bracken -- lightly obscured',
    'o': 'Rock',
    'X': 'Cart -- half cover',
    'f': 'Fence',
    'g': 'Gate (open)',
    'R': 'Roof -- not in play',
    'h': 'Trapdoor',
    's': 'Stairs up',
    'P': 'Dock -- planks over water',
    'j': 'Mud bank',
    'a': 'Fields',
    'F': 'Ford -- shallow, wadeable',
    ' ': 'Off map',
}
FLOORS = '.,=_wj'

FLOOR_RGB = {
    '.': (150, 121, 86), ',': (98, 126, 72), '=': (128, 114, 98),
    '_': (196, 162, 112), 'w': (138, 94, 60), 'j': (104, 88, 64),
}
COLOURS = {
    'red': (196, 52, 46), 'purple': (128, 72, 170), 'green': (54, 150, 80),
    'blue': (52, 104, 190), 'gold': (226, 178, 40), 'brown': (130, 88, 50),
    'grey': (120, 120, 120), 'orange': (226, 120, 36), 'teal': (36, 150, 150),
    'black': (30, 30, 30), 'white': (240, 240, 240),
}


def font(size, bold=False):
    names = ['arialbd.ttf', 'DejaVuSans-Bold.ttf'] if bold else ['arial.ttf', 'DejaVuSans.ttf']
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            pass
    return ImageFont.load_default(size=size)


def col_name(c):
    """0 -> A, 25 -> Z, 26 -> AA, like a spreadsheet."""
    name = ''
    c += 1
    while c:
        c, rem = divmod(c - 1, 26)
        name = chr(ord('A') + rem) + name
    return name


def parse_ref(ref):
    m = re.fullmatch(r'([A-Z]+)(\d+)', ref.strip().upper())
    if not m:
        sys.exit(f'bad grid ref: {ref!r} (want e.g. J3 or AB12)')
    col = 0
    for ch in m.group(1):
        col = col * 26 + ord(ch) - ord('A') + 1
    return col - 1, int(m.group(2)) - 1


def parse_layout(path):
    meta = {'title': path.stem, 'notes': [], 'scale': 5}
    sections = {'terrain': [], 'legend': [], 'tokens': [], 'zones': [], 'labels': []}
    current = None
    for raw in path.read_text(encoding='utf-8').splitlines():
        m = re.fullmatch(r'==\s*(\w+)\s*==\s*', raw)
        if m:
            current = m.group(1).lower()
            if current not in sections:
                sys.exit(f'{path.name}: unknown section {current!r}')
            continue
        if current == 'terrain':
            if raw.strip():
                sections['terrain'].append(raw.rstrip('\n'))
            continue
        line = raw.strip()
        if not line or line.startswith(';'):
            continue
        if current is None:
            key, _, val = line.partition(':')
            if key == 'title':
                meta['title'] = val.strip()
            elif key == 'scale':
                meta['scale'] = int(val.strip().split()[0])
            elif key == 'note':
                meta['notes'].append(val.strip())
            continue
        sections[current].append(line)

    rows = sections['terrain']
    width = max(len(r) for r in rows)
    grid = [r.ljust(width) for r in rows]
    for y, r in enumerate(grid):
        for x, ch in enumerate(r):
            if ch not in TERRAIN:
                sys.exit(f'{path.name}: unknown terrain char {ch!r} at {col_name(x)}{y + 1}')

    legend = dict(TERRAIN)
    for line in sections['legend']:
        ch, name = line[0], line[1:].strip()
        legend[ch] = name

    tokens = []
    for line in sections['tokens']:
        ref, glyph, colour, name = line.split(None, 3)
        tokens.append((parse_ref(ref), glyph, COLOURS[colour], name))
    zones = []
    for line in sections['zones']:
        span, colour, tag, name = line.split(None, 3)
        a, b = span.split(':')
        zones.append((parse_ref(a), parse_ref(b), COLOURS[colour], tag, name))
    labels = []
    for line in sections['labels']:
        ref, text = line.split(None, 1)
        labels.append((parse_ref(ref), text))
    return meta, grid, legend, tokens, zones, labels


def floor_under(grid, x, y):
    """Floor an object square sits on: timber beats dirt beats grass beats street, so a crate
    inside the wing sits on timber and a fence post on the yard's edge stays dirt."""
    seen = set()
    for dx, dy in ((0, -1), (0, 1), (-1, 0), (1, 0), (-1, -1), (1, -1), (-1, 1), (1, 1)):
        nx, ny = x + dx, y + dy
        if 0 <= ny < len(grid) and 0 <= nx < len(grid[0]):
            seen.add(grid[ny][nx])
    return next((f for f in '_wj.,=' if f in seen), '.')


def shade(rgb, d):
    return tuple(max(0, min(255, v + d)) for v in rgb)


def draw_floor(d, rng, ch, x0, y0, px):
    base = FLOOR_RGB[ch]
    d.rectangle([x0, y0, x0 + px, y0 + px], fill=base)
    if ch in '_w':  # planks
        for i in range(1, 4):
            yy = y0 + i * px // 4
            d.line([x0, yy, x0 + px, yy], fill=shade(base, -28), width=max(1, px // 50))
        off = rng.randint(0, px)
        for i in range(4):
            xx = x0 + (off + i * px // 2) % px
            d.line([xx, y0 + i * px // 4, xx, y0 + (i + 1) * px // 4], fill=shade(base, -36), width=1)
    else:  # specks
        for _ in range(px // 6):
            sx, sy = x0 + rng.randint(0, px - 2), y0 + rng.randint(0, px - 2)
            d.rectangle([sx, sy, sx + 1, sy + 1], fill=shade(base, rng.choice((-22, -14, 14))))


def draw_square(d, rng, grid, x, y, px):
    ch = grid[y][x]
    x0, y0 = x * px, y * px
    x1, y1 = x0 + px, y0 + px
    p = px / 70  # scale factor; shapes are tuned at 70 px
    if ch in FLOORS:
        draw_floor(d, rng, ch, x0, y0, px)
        return
    if ch == ' ':
        d.rectangle([x0, y0, x1, y1], fill=(20, 20, 20))
        return
    if ch == '#':
        d.rectangle([x0, y0, x1, y1], fill=(58, 42, 30))
        d.rectangle([x0 + 3 * p, y0 + 3 * p, x1 - 3 * p, y1 - 3 * p], outline=(78, 58, 42), width=max(1, int(2 * p)))
        return
    if ch == 'R':
        d.rectangle([x0, y0, x1, y1], fill=(122, 62, 46))
        for i in range(0, px, max(4, px // 6)):
            d.line([x0, y0 + i, x1, y0 + i], fill=(98, 48, 36), width=max(1, int(2 * p)))
        return
    if ch == 'F':
        d.rectangle([x0, y0, x1, y1], fill=(112, 150, 170))
        for _ in range(px // 5):
            sx, sy = x0 + rng.randint(0, px - 4), y0 + rng.randint(0, px - 4)
            d.ellipse([sx, sy, sx + 4 * p, sy + 3 * p], fill=(150, 140, 120))
        return
    if ch == 'a':
        d.rectangle([x0, y0, x1, y1], fill=(150, 146, 78))
        for i in range(1, 6):
            yy = y0 + i * px / 6
            d.line([x0, yy, x1, yy], fill=(122, 118, 60), width=max(1, int(2 * p)))
        return
    if ch == 'P':
        d.rectangle([x0, y0, x1, y1], fill=(66, 108, 150))
        d.rectangle([x0, y0, x1, y1], fill=(150, 112, 70))
        for i in range(1, 5):
            xx = x0 + i * px / 5
            d.line([xx, y0, xx, y1], fill=(104, 74, 44), width=max(1, int(2 * p)))
        return
    if ch == '~':
        d.rectangle([x0, y0, x1, y1], fill=(66, 108, 150))
        for i in range(1, 4):
            yy = y0 + i * px // 4
            d.arc([x0 + 6 * p, yy - 6 * p, x0 + 34 * p, yy + 6 * p], 200, 340, fill=(140, 180, 210), width=max(1, int(2 * p)))
        return

    draw_floor(d, rng, floor_under(grid, x, y), x0, y0, px)
    m = 6 * p
    if ch == 'd':
        d.rectangle([x0 + m, y0 + m, x1 - m, y1 - m], fill=(110, 70, 38), outline=(60, 38, 22), width=max(1, int(3 * p)))
        d.ellipse([x1 - 18 * p, y0 + px / 2 - 4 * p, x1 - 10 * p, y0 + px / 2 + 4 * p], fill=(200, 170, 80))
    elif ch == 'D':
        d.rectangle([x0, y0 + px * 0.42, x1, y0 + px * 0.58], fill=(160, 128, 84))
    elif ch == 'r':
        d.rectangle([x0, y0, x1, y1], fill=(112, 104, 96))
        for _ in range(9):
            rx, ry = x0 + rng.uniform(0, px - 18 * p), y0 + rng.uniform(0, px - 18 * p)
            s = rng.uniform(8, 18) * p
            d.polygon([(rx, ry + s / 2), (rx + s / 2, ry), (rx + s, ry + s / 3), (rx + s * 0.7, ry + s)],
                      fill=rng.choice(((150, 144, 136), (92, 86, 80), (60, 52, 46))))
    elif ch in 'cC':
        fill, edge = ((168, 128, 74), (92, 62, 32)) if ch == 'c' else ((118, 84, 46), (52, 34, 18))
        d.rectangle([x0 + m, y0 + m, x1 - m, y1 - m], fill=fill, outline=edge, width=max(1, int((3 if ch == 'c' else 5) * p)))
        d.line([x0 + m, y0 + m, x1 - m, y1 - m], fill=edge, width=max(1, int(2 * p)))
        d.line([x0 + m, y1 - m, x1 - m, y0 + m], fill=edge, width=max(1, int(2 * p)))
        if ch == 'C':
            d.rectangle([x0 + 2 * m, y0 + 2 * m, x1 - 2 * m, y1 - 2 * m], outline=edge, width=max(1, int(2 * p)))
    elif ch == 'k':
        for cx, cy in ((0.3, 0.3), (0.7, 0.35), (0.45, 0.72)):
            r = 0.2 * px
            X, Y = x0 + cx * px, y0 + cy * px
            d.ellipse([X - r, Y - r, X + r, Y + r], fill=(132, 88, 48), outline=(56, 36, 20), width=max(1, int(3 * p)))
            d.ellipse([X - r * 0.55, Y - r * 0.55, X + r * 0.55, Y + r * 0.55], outline=(90, 60, 32), width=max(1, int(2 * p)))
    elif ch == 'b':
        d.rectangle([x0 + 2 * p, y0 + 2 * p, x1 - 2 * p, y1 - 2 * p], fill=(84, 50, 28), outline=(44, 26, 14), width=max(1, int(3 * p)))
        d.line([x0 + 8 * p, y0 + 10 * p, x1 - 8 * p, y0 + 10 * p], fill=(120, 80, 48), width=max(1, int(3 * p)))
    elif ch == 'H':
        d.rectangle([x0 + 4 * p, y0 + 4 * p, x1 - 4 * p, y1 - 4 * p], fill=(96, 90, 84), outline=(60, 56, 52), width=max(1, int(4 * p)))
        d.ellipse([x0 + 14 * p, y0 + 14 * p, x1 - 14 * p, y1 - 14 * p], fill=(238, 132, 40))
        d.ellipse([x0 + 24 * p, y0 + 24 * p, x1 - 24 * p, y1 - 24 * p], fill=(255, 214, 100))
    elif ch == 'S':
        d.rectangle([x0, y0, x1, y1], fill=(104, 64, 36))
        for i in range(1, 3):
            d.line([x0, y0 + i * px // 3, x1, y0 + i * px // 3], fill=(80, 48, 26), width=max(1, int(2 * p)))
    elif ch == 't':
        d.ellipse([x0 + 12 * p, y0 + 12 * p, x1 - 12 * p, y1 - 12 * p], fill=(96, 60, 32), outline=(52, 32, 16), width=max(1, int(3 * p)))
    elif ch == 'o':
        d.ellipse([x0 + 10 * p, y0 + 16 * p, x1 - 8 * p, y1 - 10 * p], fill=(128, 126, 120), outline=(80, 78, 74), width=max(1, int(3 * p)))
    elif ch == 'v':
        for _ in range(14):
            bx, by = x0 + rng.uniform(4, px - 12 * p), y0 + rng.uniform(4, px - 12 * p)
            s = rng.uniform(7, 13) * p
            d.ellipse([bx, by, bx + s, by + s], fill=rng.choice(((54, 92, 44), (66, 108, 50), (44, 76, 36))))
    elif ch == 'X':
        d.rectangle([x0 + 2 * p, y0 + 12 * p, x1 - 2 * p, y1 - 12 * p], fill=(142, 98, 54), outline=(70, 44, 22), width=max(1, int(3 * p)))
        for i in range(1, 3):
            d.line([x0 + 2 * p, y0 + 12 * p + i * (px - 24 * p) / 3, x1 - 2 * p, y0 + 12 * p + i * (px - 24 * p) / 3], fill=(108, 72, 38), width=1)
        for wy in (y0 + 4 * p, y1 - 14 * p):
            d.rectangle([x0 + px / 2 - 12 * p, wy, x0 + px / 2 + 12 * p, wy + 10 * p], fill=(48, 34, 22))
    elif ch in 'fg':
        horizontal = (x > 0 and grid[y][x - 1] in 'fg') or (x + 1 < len(grid[0]) and grid[y][x + 1] in 'fg')
        vertical = (y > 0 and grid[y - 1][x] in 'fg') or (y + 1 < len(grid) and grid[y + 1][x] in 'fg')
        mid_x, mid_y = x0 + px / 2, y0 + px / 2
        post = 5 * p
        if ch == 'f':
            if horizontal:
                d.line([x0, mid_y, x1, mid_y], fill=(92, 62, 34), width=max(2, int(5 * p)))
            if vertical or not horizontal:
                d.line([mid_x, y0, mid_x, y1], fill=(92, 62, 34), width=max(2, int(5 * p)))
            d.rectangle([mid_x - post, mid_y - post, mid_x + post, mid_y + post], fill=(70, 46, 24))
        else:
            for yy in (y0 + post, y1 - post):
                d.rectangle([mid_x - post, yy - post, mid_x + post, yy + post], fill=(70, 46, 24))
    elif ch == 'h':
        d.rectangle([x0 + 10 * p, y0 + 10 * p, x1 - 10 * p, y1 - 10 * p], fill=(96, 62, 34), outline=(48, 30, 16), width=max(1, int(4 * p)))
        d.ellipse([x0 + px / 2 - 6 * p, y0 + px / 2 - 6 * p, x0 + px / 2 + 6 * p, y0 + px / 2 + 6 * p], outline=(170, 150, 90), width=max(1, int(3 * p)))
    elif ch == 's':
        for i in range(5):
            yy = y0 + 6 * p + i * (px - 12 * p) / 5
            d.rectangle([x0 + 6 * p, yy, x1 - 6 * p, yy + (px - 12 * p) / 5 - 2 * p], fill=shade((150, 104, 64), -i * 12))


def draw_trees(d, rng, grid, px):
    p = px / 70
    for y, row in enumerate(grid):
        for x, ch in enumerate(row):
            if ch != 'T':
                continue
            cx, cy = x * px + px / 2 + rng.uniform(-6, 6) * p, y * px + px / 2 + rng.uniform(-6, 6) * p
            r = rng.uniform(0.62, 0.78) * px
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(40, 70, 36), outline=(26, 46, 24), width=max(1, int(3 * p)))
            d.ellipse([cx - r * 0.6, cy - r * 0.7, cx + r * 0.4, cy + r * 0.3], fill=(56, 92, 46))
            d.ellipse([cx - 6 * p, cy - 6 * p, cx + 6 * p, cy + 6 * p], fill=(70, 48, 28))


def render_terrain(grid, px, seed):
    rng = random.Random(seed)
    img = Image.new('RGB', (len(grid[0]) * px, len(grid) * px))
    d = ImageDraw.Draw(img)
    for y in range(len(grid)):
        for x in range(len(grid[0])):
            draw_square(d, rng, grid, x, y, px)
    draw_trees(d, rng, grid, px)
    return img


def draw_grid(img, px, alpha):
    over = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    for x in range(0, img.width + 1, px):
        d.line([x, 0, x, img.height], fill=(0, 0, 0, alpha), width=1)
    for y in range(0, img.height + 1, px):
        d.line([0, y, img.width, y], fill=(0, 0, 0, alpha), width=1)
    return Image.alpha_composite(img.convert('RGBA'), over)


def text_box(d, xy, text, fnt, fg=(255, 255, 255), bg=(0, 0, 0, 170), anchor='mm'):
    l, t, r, b = d.textbbox(xy, text, font=fnt, anchor=anchor)
    d.rounded_rectangle([l - 5, t - 3, r + 5, b + 3], radius=4, fill=bg)
    d.text(xy, text, font=fnt, fill=fg, anchor=anchor)


def render_key(meta, grid, legend, tokens, zones, labels, terrain, px):
    img = draw_grid(terrain, px, 90)
    over = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    small = font(max(11, px // 5))
    for (ax, ay), (bx, by), rgb, tag, _ in zones:
        box = [min(ax, bx) * px, min(ay, by) * px, (max(ax, bx) + 1) * px, (max(ay, by) + 1) * px]
        d.rectangle(box, fill=rgb + (40,), outline=rgb + (255,), width=max(2, px // 20))
        text_box(d, (box[0] + 6, box[1] + 5), tag, font(max(12, px // 4), bold=True), bg=rgb + (230,), anchor='lt')
    for (x, y), text in labels:
        text_box(d, (x * px + px / 2, y * px + px / 2), text, small)
    for (x, y), glyph, rgb, _ in tokens:
        cx, cy, r = x * px + px / 2, y * px + px / 2, px * 0.38
        d.ellipse([cx - r + 2, cy - r + 3, cx + r + 2, cy + r + 3], fill=(0, 0, 0, 120))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=rgb + (255,), outline=(255, 255, 255, 255), width=max(2, px // 25))
        d.text((cx, cy), glyph, font=font(max(12, int(px * (0.36 if len(glyph) == 1 else 0.28))), bold=True),
               fill=(255, 255, 255), anchor='mm')
    img = Image.alpha_composite(img, over)

    # frame: coord margin left/top, title on top, legend on the right
    margin = max(24, px // 2)
    title_h = max(40, int(px * 0.7)) + len(meta['notes']) * max(18, px // 4)
    body_font = font(max(12, px // 5))
    entries = [f'{col_name(x)}{y + 1}  {n}' for (x, y), _, _, n in tokens] + [z[4] for z in zones] + list(legend.values())
    widest = max((ImageDraw.Draw(img).textlength(e, font=body_font) for e in entries), default=0)
    legend_w = max(380, px * 6, int(widest) + max(22, int(px * 0.42)) + 40)
    rows_needed = len(set(''.join(grid))) + len(tokens) + len(zones) + 4
    line_h = max(22, int(px * 0.42))
    W = margin + img.width + legend_w + margin
    H = max(title_h + margin + img.height + margin, title_h + rows_needed * line_h + margin * 2)
    out = Image.new('RGBA', (W, H), (246, 241, 230, 255))
    out.paste(img, (margin, title_h + margin))
    d = ImageDraw.Draw(out)
    d.text((margin, 10), meta['title'], font=font(max(22, px // 3), bold=True), fill=(40, 30, 20))
    for i, note in enumerate(meta['notes']):
        d.text((margin, 14 + max(26, px // 3) + i * max(18, px // 4)), note, font=small, fill=(80, 64, 48))
    coord = font(max(11, px // 5), bold=True)
    for x in range(len(grid[0])):
        d.text((margin + x * px + px / 2, title_h + margin / 2), col_name(x), font=coord, fill=(60, 48, 36), anchor='mm')
    for y in range(len(grid)):
        d.text((margin / 2, title_h + margin + y * px + px / 2), str(y + 1), font=coord, fill=(60, 48, 36), anchor='mm')

    # legend
    lx, ly = margin + img.width + margin, title_h + margin
    sw = line_h - 4
    head = font(max(14, px // 4), bold=True)
    body = font(max(12, px // 5))
    d.text((lx, ly), 'Tokens', font=head, fill=(40, 30, 20))
    ly += line_h
    for (x, y), glyph, rgb, name in tokens:
        d.ellipse([lx, ly, lx + sw, ly + sw], fill=rgb, outline=(255, 255, 255), width=2)
        d.text((lx + sw / 2, ly + sw / 2), glyph, font=font(max(9, sw // 2), bold=True), fill=(255, 255, 255), anchor='mm')
        d.text((lx + sw + 10, ly + sw / 2), f'{col_name(x)}{y + 1}  {name}', font=body, fill=(40, 30, 20), anchor='lm')
        ly += line_h
    if zones:
        ly += line_h // 2
        d.text((lx, ly), 'Zones', font=head, fill=(40, 30, 20))
        ly += line_h
        for _, _, rgb, tag, name in zones:
            d.rectangle([lx, ly, lx + sw, ly + sw], fill=rgb, outline=(60, 48, 36))
            d.text((lx + sw / 2, ly + sw / 2), tag, font=font(max(9, sw // 2), bold=True), fill=(255, 255, 255), anchor='mm')
            d.text((lx + sw + 10, ly + sw / 2), name, font=body, fill=(40, 30, 20), anchor='lm')
            ly += line_h
    ly += line_h // 2
    d.text((lx, ly), f"Terrain (1 square = {meta['scale']} ft)", font=head, fill=(40, 30, 20))
    ly += line_h
    used = [ch for ch in TERRAIN if any(ch in row for row in grid) and ch != ' ']
    for ch in used:
        sample = render_terrain([ch * 3] * 3, sw, 7).crop((sw, sw, sw * 2, sw * 2))
        out.paste(sample, (lx, ly))
        d.rectangle([lx, ly, lx + sw, ly + sw], outline=(60, 48, 36))
        d.text((lx + sw + 10, ly + sw / 2), legend[ch], font=body, fill=(40, 30, 20), anchor='lm')
        ly += line_h
    return out.convert('RGB')


def session_layouts(n):
    folders = [p for p in (REPO / 'scheduler' / 'sessions').glob(f'Session {n} *') if p.is_dir()]
    folders += [p for p in (REPO / 'historian').rglob(f'Session {n} *') if p.is_dir()]
    if not folders:
        sys.exit(f'no session folder found for session {n}')
    files = sorted((folders[0] / 'maps').glob('*.txt'))
    if not files:
        sys.exit(f'no layouts in {folders[0] / "maps"}')
    return files


def main():
    ap = argparse.ArgumentParser(description='Render battlemap layout grids to VTT + DM key PNGs.')
    ap.add_argument('layouts', nargs='*', type=Path, help='layout .txt files, or folders of them')
    ap.add_argument('--session', type=int, help='render every layout in that session folder\'s maps/')
    ap.add_argument('--px', type=int, default=70, help='pixels per 5-ft square (Roll20 70, Foundry 100)')
    ap.add_argument('--vtt-grid', action='store_true', help='burn a faint grid into the VTT image')
    ap.add_argument('--out-dir', type=Path, help='default maps/battlemaps/session-<n>/')
    args = ap.parse_args()

    files = []
    for p in args.layouts:
        files += sorted(p.glob('*.txt')) if p.is_dir() else [p]
    files += session_layouts(args.session) if args.session else []
    if not files:
        ap.error('give layout files or --session <n>')
    for f in files:
        f = f.resolve()
        n = args.session
        if n is None:
            m = re.search(r'Session (\d+)', str(f))
            n = int(m.group(1)) if m else None
        if args.out_dir:
            out_dir = args.out_dir
        elif n:
            out_dir = REPO / 'maps' / 'battlemaps' / f'session-{n}'
        elif (REPO / 'maps') in f.parents:
            out_dir = f.parent  # location maps render beside their layout
        else:
            out_dir = REPO / 'maps' / 'battlemaps' / 'misc'
        out_dir.mkdir(parents=True, exist_ok=True)
        meta, grid, legend, tokens, zones, labels = parse_layout(f)
        terrain = render_terrain(grid, args.px, seed=f.stem)
        vtt = draw_grid(terrain, args.px, 60).convert('RGB') if args.vtt_grid else terrain
        vtt_path, key_path = out_dir / f'{f.stem}-vtt.png', out_dir / f'{f.stem}-key.png'
        vtt.save(vtt_path)
        render_key(meta, grid, legend, tokens, zones, labels, terrain, args.px).save(key_path)
        cols, rows = len(grid[0]), len(grid)
        ft = meta['scale']
        print(f'{f.stem}: {cols}x{rows} squares ({cols * ft}x{rows * ft} ft), {args.px} px/square')
        print(f'  vtt  {vtt_path.relative_to(REPO)}  ({vtt.width}x{vtt.height})')
        print(f'  key  {key_path.relative_to(REPO)}')


if __name__ == '__main__':
    main()
