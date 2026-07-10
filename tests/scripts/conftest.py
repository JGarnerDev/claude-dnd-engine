"""Shared fixtures for the scripts test suite.

Forces color off so rendered output is plain text regardless of whether
pytest captures stdout (`-s` makes stdout a tty, which would otherwise emit
ANSI codes via common.color()).
"""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
from lib import common  # noqa: E402


@pytest.fixture(autouse=True)
def _no_color(monkeypatch):
    monkeypatch.setattr(common, "_USE_COLOR", False)
