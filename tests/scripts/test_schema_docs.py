import importlib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))

gen = importlib.import_module("gen-schema-docs")


def test_docs_match_schemas():
    assert gen.sync(write=False) == []


def test_short_comment_trails_the_value():
    assert gen.comment_lines("level:", "Integer, 1-20.") == [
        "level:".ljust(24) + "# Integer, 1-20."
    ]


def test_long_value_puts_comment_below():
    head = "daypart: " + " | ".join(["afternoon"] * 6)
    lines = gen.comment_lines(head, "Sub-day tier.")
    assert lines == [head, " " * 24 + "# Sub-day tier."]


def test_long_comment_wraps_within_width():
    lines = gen.comment_lines('track: ""', "word " * 40)
    assert len(lines) > 1 and all(len(ln) <= gen.WIDTH for ln in lines)


def test_nested_placeholder_item():
    node = {"type": "array", "x-placeholder": ['hook: ""\nstatus: open']}
    assert gen.render_field("spotlight_hooks", node, {}) == [
        "spotlight_hooks:",
        '  - hook: ""',
        "    status: open",
    ]


def test_stale_x_states_is_an_error():
    spec = gen.Spec("feat.schema.yaml", None)
    spec.props["state"] = {"enum": ["a", "b"], "x-states": {"b": "", "a": ""}}
    try:
        gen.states(spec)
    except SystemExit as e:
        assert "x-states" in str(e)
    else:
        raise AssertionError("expected SystemExit")
