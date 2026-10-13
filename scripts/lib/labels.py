"""Party-facing combatant labels, read from a session plan, a token manifest and battlemap layouts.

The label is the one-to-three-word name the party uses for a combatant before it learns the real
one (`/session` Phase 6, Encounters). It appears in four places that must agree: the plan's
`Label (party-facing):` lines and its Combatants "At a glance" list, the role column of
`tokens.txt` (lowercase, hyphenated, lookalike numbers dropped), and the first words of each
layout token line. Used by scripts/label-check.py and scripts/prep-status.py.
"""
import re

LABEL_RE = re.compile(r'\*\*Label \(party-facing\):\*\*\s*(.+)')
RULE_RE = re.compile(r'^\s*(\d+)\s+(\S+)\s+\d+\s+')
GLANCE_ITEM_RE = re.compile(r'^(\s*)- (.+)$')
LAYOUT_TOKEN_RE = re.compile(r'^\S+\s+\S+\s+\S+\s+(.+?)\s+--\s')


def section(text: str, heading: str, level: int = 2) -> str:
    """Body of the first heading at `level` whose title starts with `heading`, up to the next
    heading at that level or above. Empty string when absent."""
    hashes = '#' * level
    m = re.search(rf'^{hashes} {re.escape(heading)}.*$', text, re.MULTILINE)
    if not m:
        return ''
    end = re.search(rf'^#{{1,{level}}} ', text[m.end():], re.MULTILINE)
    return text[m.end():m.end() + end.start()] if end else text[m.end():]


def role_of(label: str) -> str:
    """'Mastiff 2' -> 'mastiff'; 'Half-orc Cask-hand' -> 'half-orc-cask-hand'."""
    label = re.sub(r'\s+\d+$', '', label.strip())
    return re.sub(r'\s+', '-', label.lower())


def combatant_labels(plan: str) -> list:
    """Labels from the `Label (party-facing):` lines inside `## Combatants`, in order.

    'Mastiff 1 (Brick), Mastiff 2 (Mortar)' gives both labels; parentheticals are dropped."""
    out = []
    for line in LABEL_RE.findall(section(plan, 'Combatants')):
        for part in line.split(','):
            label = re.sub(r'\([^)]*\)', '', part).strip(' .*_')
            if label and label not in out:
                out.append(label)
    return out


def glance_entries(plan: str) -> list:
    """Entries of the Combatants "At a glance" list: dicts with labels, name, stat, encounter.

    A line reads `- **Drover** — Varrick Tenn (human, Bandit Captain), where`, nested under an
    encounter bullet `- **The Waystation** (Scene 7):`. Several bold labels before the dash
    (`**Mastiff 1** and **Mastiff 2**`) share one entry."""
    body = section(section(plan, 'Combatants'), 'At a glance', 3)
    out, encounter = [], ''
    for line in body.splitlines():
        m = GLANCE_ITEM_RE.match(line)
        if not m:
            continue
        indent, item = len(m.group(1)), m.group(2)
        head, dash, rest = item.partition(' — ')
        labels = re.findall(r'\*\*(.+?)\*\*', head)
        if indent == 0 or not dash:
            encounter = labels[0] if labels else ''
            continue
        if not labels:
            continue
        paren = re.search(r'\(([^)]*)\)', rest)
        name = re.sub(r'\[\[|\]\]', '', rest[:paren.start()] if paren else rest.split(',')[0]).strip()
        stat = paren.group(1).split(',')[-1].strip() if paren else ''
        out.append({'labels': labels, 'name': name, 'stat': stat, 'encounter': encounter})
    return out


def manifest_rules(text: str) -> list:
    """[(tier, role)] for each rule line of a tokens.txt manifest."""
    return [(int(m.group(1)), m.group(2).lower()) for line in text.splitlines()
            if (m := RULE_RE.match(line)) and not line.lstrip().startswith('#')]


def layout_labels(text: str) -> list:
    """Labels from a battlemap layout's `== tokens ==` lines (the words before ` -- `)."""
    out, on = [], False
    for line in text.splitlines():
        if line.startswith('=='):
            on = line.strip() == '== tokens =='
            continue
        if on and line.strip() and not line.startswith(';'):
            m = LAYOUT_TOKEN_RE.match(line)
            if m:
                out.append(m.group(1).strip())
    return out
