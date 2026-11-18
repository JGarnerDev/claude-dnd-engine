"""Beat-id order check for a planned session (meta/flow-graphs.md -> Node ids -> Positions).

A planned session's beats are `S<n>_<NN>[A-Z]_<SLUG>`, numbered in play order. The plan's `####`
headings, the `_flow.md` node definitions and the positions must run in the same order. Ids with
no position (sessions planned before the scheme) are skipped, never flagged.

Read by scripts/flow-status.py and scripts/prep-status.py.
"""
import re

POS_ID_RE = re.compile(r'^S(\d+)_(\d{2})([A-Z]?)_([A-Z0-9_]+)$')
SESSION_ID_RE = re.compile(r'^S\d+_')
_FENCE_RE = re.compile(r'```mermaid\r?\n(.*?)```', re.S)
_NODE_DEF_RE = re.compile(r'^\s*([A-Za-z][A-Za-z0-9_]*)\s*(?:\["|\{"|\(\[")')
_HEADING_RE = re.compile(r'^####\s+([A-Za-z][A-Za-z0-9_]*)\b', re.M)
_SKIP = ('classDef ', 'class ', 'subgraph ', 'direction ', '%%')


def parse_id(node_id: str):
    """(session, position, fork letter, slug) for a positioned id, else None."""
    m = POS_ID_RE.match(node_id)
    return (int(m.group(1)), int(m.group(2)), m.group(3), m.group(4)) if m else None


def position(node_id: str) -> str:
    """The position as the runner shows it: `S35_07A_ESCAPE` -> `7A`. Empty if none."""
    p = parse_id(node_id)
    return f'{p[1]}{p[2]}' if p else ''


def flow_node_ids(text: str) -> list:
    """Node ids in definition order, from every mermaid block of a flow file."""
    ids = []
    for block in _FENCE_RE.findall(text):
        for line in block.splitlines():
            if line.strip() == 'end' or line.strip().startswith(_SKIP):
                continue
            m = _NODE_DEF_RE.match(line)
            if m and m.group(1) not in ids:
                ids.append(m.group(1))
    return ids


def plan_beat_ids(text: str) -> list:
    """Beat ids from the plan's `#### <ID> — title` headings, in page order."""
    return list(dict.fromkeys(_HEADING_RE.findall(text)))


def order_problems(flow_ids: list, plan_ids: list = None, session: int = None) -> list:
    """Order drift between positions, flow node order and plan headings. [] when clean or
    when the flow carries no positioned ids."""
    if not any(parse_id(i) for i in flow_ids):
        return []
    problems = []
    session_ids = [i for i in flow_ids if SESSION_ID_RE.match(i)]
    for i in session_ids:
        p = parse_id(i)
        if not p:
            problems.append(f'{i}: no position (expected S<n>_NN_SLUG)')
        elif session is not None and p[0] != session:
            problems.append(f'{i}: session S{p[0]} in a Session {session} flow')

    positioned = [i for i in session_ids if parse_id(i)]
    seen, high, high_id = {}, None, None
    for i in positioned:
        _, pos, letter, _ = parse_id(i)
        key = (pos, letter)
        if key in seen:
            problems.append(f'{i}: position {pos:02d}{letter} also used by {seen[key]}')
            continue
        seen[key] = i
        if high and key < high:
            problems.append(f'{i}: defined after {high_id}, but its position comes first')
        else:
            high, high_id = key, i
    by_pos = {}
    for pos, letter in seen:
        by_pos.setdefault(pos, []).append(letter)
    for pos, letters in sorted(by_pos.items()):
        if '' in letters and len(letters) > 1:
            problems.append(f'position {pos:02d}: a plain beat and fork letters share it')
        elif len(letters) == 1 and letters[0]:
            problems.append(f'position {pos:02d}{letters[0]}: a fork with one option')

    if plan_ids is not None:
        in_plan = [i for i in plan_ids if parse_id(i)]
        for i in positioned:
            if i not in in_plan:
                problems.append(f'{i}: in _flow.md but no #### heading in the plan')
        for i in in_plan:
            if i not in positioned:
                problems.append(f'{i}: #### heading in the plan but not in _flow.md')
        common = [i for i in in_plan if i in positioned]
        flow_common = [i for i in positioned if i in common]
        for a, b in zip(common, flow_common):
            if a != b:
                problems.append(f'plan headings and _flow.md disagree: plan has {a} where the flow has {b}')
                break
    return problems
