import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
from lib import beat_order as bo  # noqa: E402


def flow(*ids):
    lines = ['```mermaid', 'flowchart TD', '  subgraph SC3["Scene 3"]']
    lines += [f'    {i}["[-] {i}<br/>beat"]' for i in ids]
    lines += ['  end', '  classDef combat fill:#fff', '```']
    return '\n'.join(lines)


def plan(*ids):
    return '\n\n'.join(f'#### {i} — a beat\n\n- text' for i in ids)


IN_ORDER = ['S35_01_RELIEF', 'S35_02_IGGY_FIRST', 'S35_03_TITHE_HUNTS',
            'S35_04A_ESCAPE', 'S35_04B_CHASE', 'S35_05_TALLY']


def test_parse_and_position():
    assert bo.parse_id('S35_07A_ESCAPE') == (35, 7, 'A', 'ESCAPE')
    assert bo.position('S35_07A_ESCAPE') == '7A'
    assert bo.position('S35_03_TITHE_HUNTS') == '3'
    assert bo.parse_id('S2_ESCAPE') is None
    assert bo.position('A2_PURSUIT') == ''


def test_flow_ids_in_definition_order_skip_subgraph_and_class():
    assert bo.flow_node_ids(flow(*IN_ORDER)) == IN_ORDER


def test_clean_session_has_no_problems():
    assert bo.order_problems(IN_ORDER, IN_ORDER, 35) == []


def test_pre_scheme_flow_is_skipped():
    old = ['S2_CRYSTALS', 'S2_FIGHT', 'S2_RELIEF']
    assert bo.order_problems(old, list(reversed(old)), 34) == []


def test_s34_with_relief_out_of_place_warns():
    # S34's real drift: the relief plays first but was defined seventh.
    ids = ['S35_02_CRYSTALS', 'S35_03_FIGHT', 'S35_01_RELIEF']
    probs = bo.order_problems(ids, ids, 35)
    assert any('S35_01_RELIEF' in p and 'comes first' in p for p in probs)


def test_duplicate_plain_position():
    probs = bo.order_problems(['S35_01_A', 'S35_01_B'], None, 35)
    assert any('S35_01_B' in p and 'also used by S35_01_A' in p for p in probs)


def test_fork_rules():
    lone = bo.order_problems(['S35_01_X', 'S35_02A_ONLY', 'S35_03_Y'], None, 35)
    assert any('one option' in p for p in lone)
    mixed = bo.order_problems(['S35_02_X', 'S35_02A_Y', 'S35_02B_Z'], None, 35)
    assert any('plain beat and fork letters' in p for p in mixed)


def test_wrong_session_and_missing_position():
    probs = bo.order_problems(['S35_01_X', 'S34_02_Y', 'S35_TALLY'], None, 35)
    assert any('S34_02_Y' in p and 'Session 35' in p for p in probs)
    assert any('S35_TALLY' in p and 'no position' in p for p in probs)


def test_plan_headings_disagree_with_flow():
    swapped = ['S35_02_IGGY_FIRST', 'S35_01_RELIEF'] + IN_ORDER[2:]
    probs = bo.order_problems(IN_ORDER, swapped, 35)
    assert any('disagree' in p for p in probs)


def test_plan_and_flow_missing_beats():
    probs = bo.order_problems(IN_ORDER, IN_ORDER[:-1] + ['S35_06_EXTRA'], 35)
    assert any('S35_05_TALLY' in p and 'no #### heading' in p for p in probs)
    assert any('S35_06_EXTRA' in p and 'not in _flow.md' in p for p in probs)


def test_plan_beat_ids_reads_headings():
    assert bo.plan_beat_ids(plan(*IN_ORDER)) == IN_ORDER
