import importlib
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
fs = importlib.import_module("flow-status")


@pytest.fixture
def repo(tmp_path):
    sessions = tmp_path / "scheduler" / "sessions"
    session = sessions / "Session 9 Test"
    session.mkdir(parents=True)
    (session / "_flow.md").write_text("```mermaid\nflowchart TD\n```\n", encoding="utf-8")
    act_set = tmp_path / "workshop" / "act-flow"
    act_set.mkdir(parents=True)
    (act_set / "README.md").write_text("See meta/flow-graphs.md.\n", encoding="utf-8")
    return tmp_path, sessions, session, act_set


def test_set_takes_a_bare_session_name(repo):
    root, sessions, session, _ = repo
    found = fs.resolve_set_arg("Session 9 Test", root=root, sessions_dir=sessions)
    assert found == session
    assert fs.is_session_folder(found)


def test_set_takes_a_path_from_the_repo_root(repo):
    root, sessions, _, act_set = repo
    found = fs.resolve_set_arg("workshop/act-flow", root=root, sessions_dir=sessions)
    assert found == act_set
    assert not fs.is_session_folder(found)


def test_set_with_no_such_folder_exits_naming_what_it_tried(repo):
    root, sessions, _, _ = repo
    with pytest.raises(SystemExit) as err:
        fs.resolve_set_arg("Session 99 Missing", root=root, sessions_dir=sessions)
    assert "Session 99 Missing" in str(err.value)
    assert "scheduler" in str(err.value)


def test_discovery_finds_only_readme_sets(repo):
    root, _, _, act_set = repo
    assert fs.discover_sets(root) == [act_set]
