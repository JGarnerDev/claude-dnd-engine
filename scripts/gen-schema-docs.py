#!/usr/bin/env python3
# gen-schema-docs.py -- write the generated blocks of meta/schemas/<type>.md from <type>.schema.yaml.
# consumers: scripts/validate.py (sync), CLAUDE.md, meta/entity-creation.md -- update these if usage, flags, or output format change.
# Each prose doc keeps two generated blocks, between marker comments:
#   <!-- generated: states from X.schema.yaml ... -->     the Valid State Values table
#   <!-- generated: template from X.schema.yaml ... -->   the Frontmatter Template
#   <!-- end generated -->
# Everything else in the doc (player form, mapping, body template, notes) is hand-written.
# The blocks come from these schema keys, which the JSON Schema validator ignores:
#   x-states       {state: meaning} beside a state enum, in the enum's order
#   description    a field's meaning, written as the template's trailing # comment
#   x-placeholder  a field's template value: a string, or a list of item strings
#                  (a "\n" in an item continues it as a nested mapping)
#   x-doc          on the schema (or a subtype's `then`):
#                    label      section name for the type's own fields (default: subtype or type)
#                    tags       template tag lines (default: ["<type>/"])
#                    base       optional entity fields to show (default: BASE_OPTIONAL)
#                    historian  fields shown commented out under HISTORIAN ONLY
#                    fields     {field: {x-placeholder, description}} template-only overrides for
#                               entity base fields (e.g. party's name: "TBD")
# A doc maps to a schema by name: event.md -> event.schema.yaml; location-city.md -> the
# `subtype: city` branch of location.schema.yaml. Docs with no schema (player.md) are skipped.
#
# Usage: uv run scripts/gen-schema-docs.py [--check]
#   --check   write nothing; list docs whose blocks are missing or out of date
# Exit code: 0 = up to date (or written), 1 = --check found stale docs.

import argparse
import re
import sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import ROOT, cwrite

SCHEMAS = ROOT / "meta" / "schemas"
BASE_MANDATORY = ["name", "type", "subtype", "exists", "state", "tags"]
BASE_OPTIONAL = [
    "aliases",
    "importance",
    "active",
    "last_updated",
    "relates_to",
    "known_by",
    "description",
]
SKIP = {"type", "subtype", "state", "tags"}  # base-mandatory fields a type may narrow
COMMENT_COL = 24
WIDTH = 100
BLOCK = re.compile(
    r"<!-- generated: (states|template) from \S+ by scripts/gen-schema-docs\.py; edit the schema, not this block -->\n.*?<!-- end generated -->",
    re.S,
)


def load(name: str) -> dict:
    return yaml.safe_load((SCHEMAS / name).read_text(encoding="utf-8"))


ENTITY = load("entity.schema.yaml")


class Spec:
    """The fields one doc describes: entity base + a type schema (+ one subtype branch)."""

    def __init__(self, schema_name: str, subtype: str | None):
        self.file = schema_name
        self.schema = load(schema_name)
        self.subtype = subtype
        self.props, self.required, self.doc = {}, set(self.schema.get("required", [])), {}
        self.merge(self.schema)
        for part in self.schema.get("allOf", []):
            if "if" not in part:
                continue
            cond = part["if"].get("properties", {}).get("subtype", {})
            if subtype and cond.get("const") == subtype:
                self.merge(part["then"])
        self.doc = {**self.schema.get("x-doc", {}), **self.doc}

    def merge(self, node: dict) -> None:
        if "$ref" in node and node["$ref"].startswith("#/$defs/"):
            self.merge(self.schema["$defs"][node["$ref"].split("/")[-1]])
        for key, sub in node.get("properties", {}).items():
            self.props[key] = {**self.props.get(key, {}), **sub}
        self.required |= set(node.get("required", []))
        if node is not self.schema:
            self.doc.update(node.get("x-doc", {}))

    def field(self, key: str) -> dict:
        node = self.props.get(key) or ENTITY["properties"].get(key, {})
        return {**node, **self.doc.get("fields", {}).get(key, {})}


def deref(node: dict, schema: dict) -> tuple:
    """(def name or None, resolved node) for a field, following one $ref."""
    ref = node.get("$ref")
    if not ref:
        return None, node
    name = ref.split("/")[-1]
    local = schema.get("$defs", {})
    owner = schema if not ref.startswith("entity.schema.yaml") and name in local else ENTITY
    target = owner["$defs"][name]
    if "$ref" in target:
        inner, target = deref(target, owner)
        name = inner or name
    return name, target


def placeholder(node: dict, schema: dict):
    """A field's template value: a string, or a list of list-item strings."""
    if "x-placeholder" in node:
        return node["x-placeholder"]
    if "const" in node:
        return str(node["const"]).lower() if isinstance(node["const"], bool) else str(node["const"])
    if "enum" in node:
        return " | ".join(str(v) for v in node["enum"])
    name, target = deref(node, schema)
    if name == "link":
        return '"[[Name]]"'
    if name in ("annotated-links", "links"):
        return ['"[[Entity Name]] (note)"']
    if name and target is not node:
        return placeholder({**target, **{k: v for k, v in node.items() if k != "$ref"}}, schema)
    if "anyOf" in node:
        return placeholder(node["anyOf"][0], schema)
    kind = node.get("type")
    return {"boolean": "true | false", "integer": "", "array": "[]", "object": "{}"}.get(kind, '""')


def comment_lines(head: str, text: str | None) -> list:
    """`head` with `text` as a trailing comment, wrapped onto aligned comment-only lines."""
    if not text:
        return [head]
    below = len(head) + 2 > COMMENT_COL * 2  # a long value gets its comment on the lines below
    col = COMMENT_COL if below else max(COMMENT_COL, len(head) + 2)
    words, lines, cur = text.split(), [], ""
    for w in words:
        if cur and col + 2 + len(cur) + 1 + len(w) > WIDTH:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    lines.append(cur)
    out = [head] if below else [head.ljust(col) + "# " + lines.pop(0)]
    return out + [" " * col + "# " + ln for ln in lines]


def render_field(key: str, node: dict, schema: dict) -> list:
    value = placeholder(node, schema)
    desc = node.get("description")
    if isinstance(value, list):
        if not value:
            return comment_lines(f"{key}: []", desc)
        items = ["  - " + item.replace("\n", "\n    ") for item in value]
        return comment_lines(f"{key}:", desc) + "\n".join(items).split("\n")
    return comment_lines(f"{key}: {value}".rstrip(), desc)


def template(spec: Spec) -> str:
    doc, schema = spec.doc, spec.schema
    label = doc.get("label", spec.subtype or schema["title"])
    historian = doc.get("historian", [])
    base_opt = doc.get("base", BASE_OPTIONAL)
    out = ["---", "# --- MANDATORY (entity base) ---"]
    for key in BASE_MANDATORY:
        if key == "tags":
            tags = doc.get("tags", [f"{schema['title']}/"])
            if not tags:
                out += comment_lines("tags: []", spec.field("tags").get("description"))
            else:
                out.append("tags:")
                out += [f"  - {t}" for t in tags]
        elif key == "subtype" and spec.subtype:
            out.append(f"subtype: {spec.subtype}")
        elif key not in ("subtype", "state") or key in spec.props:
            out += render_field(key, spec.field(key), schema)
    own = [k for k in spec.props if k not in SKIP and k not in base_opt and k not in historian]
    sections = [
        (f"MANDATORY ({label})", [k for k in own if k in spec.required]),
        ("OPTIONAL (entity base)", base_opt),
        (f"OPTIONAL ({label})", [k for k in own if k not in spec.required]),
    ]
    for title, keys in sections:
        if keys:
            out += ["", f"# --- {title} ---"]
            for key in keys:
                out += render_field(key, spec.field(key), schema)
    if historian:
        out += ["", "# --- HISTORIAN ONLY (mandatory when moved) ---"]
        for key in historian:
            out += ["# " + ln for ln in render_field(key, spec.field(key), schema)]
    out.append("---")
    return "```yaml\n" + "\n".join(out) + "\n```"


def states(spec: Spec) -> str | None:
    node = spec.props.get("state")
    if not node or "enum" not in node:
        return None
    meanings = node.get("x-states", {})
    if list(meanings) != node["enum"]:
        raise SystemExit(
            f"{spec.file}: x-states for {spec.subtype or 'state'} must list {node['enum']} in order"
        )
    rows = "\n".join(f"| `{s}` | {m} |" for s, m in meanings.items())
    return f"| State | Meaning |\n|---|---|\n{rows}"


def spec_for(doc: Path) -> Spec | None:
    stem = doc.stem
    if (SCHEMAS / f"{stem}.schema.yaml").exists() and stem != "entity":
        return Spec(f"{stem}.schema.yaml", None)
    head, _, sub = stem.partition("-")
    if sub and (SCHEMAS / f"{head}.schema.yaml").exists():
        return Spec(f"{head}.schema.yaml", sub)
    return None


def wrap(kind: str, spec: Spec, body: str) -> str:
    return (
        f"<!-- generated: {kind} from {spec.file} by scripts/gen-schema-docs.py; "
        f"edit the schema, not this block -->\n{body}\n<!-- end generated -->"
    )


def regenerate(text: str, spec: Spec) -> tuple:
    """(new text, problems): the doc with each generated block rewritten."""
    want = {"template": template(spec), "states": states(spec)}
    problems, seen = [], set()

    def sub(m):
        seen.add(m.group(1))
        body = want[m.group(1)]
        if body is None:
            problems.append(f"has a {m.group(1)} block but the schema has no state enum")
            return m.group(0)
        return wrap(m.group(1), spec, body)

    new = BLOCK.sub(sub, text.replace("\r\n", "\n"))
    for kind, body in want.items():
        if body is not None and kind not in seen:
            problems.append(f"no generated {kind} block")
    return new, problems


def sync(write: bool) -> list:
    """Problems ("<doc>: <text>") with the docs' generated blocks; rewrites stale blocks when `write`."""
    stale = []
    for doc in sorted(SCHEMAS.glob("*.md")):
        spec = spec_for(doc)
        if spec is None:
            continue
        raw = doc.read_bytes().decode("utf-8")
        new, problems = regenerate(raw, spec)
        stale += [f"{doc.name}: {p}" for p in problems]
        if new != raw.replace("\r\n", "\n"):
            if not write:
                stale.append(f"{doc.name}: generated blocks out of date")
            else:
                crlf = "\r\n" in raw
                doc.write_bytes((new.replace("\n", "\r\n") if crlf else new).encode("utf-8"))
                cwrite(f"  wrote {doc.name}", "green")
    return stale


def main():
    ap = argparse.ArgumentParser(description="Write the generated blocks of the schema docs.")
    ap.add_argument("--check", action="store_true", help="list stale docs, write nothing")
    args = ap.parse_args()
    stale = sync(write=not args.check)
    for line in stale:
        cwrite(f"  {line}", "red")
    if args.check and stale:
        cwrite("Run: uv run scripts/gen-schema-docs.py", "yellow")
    sys.exit(1 if stale and args.check else 0)


if __name__ == "__main__":
    main()
