# Inkarnate Fetch Helper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-free Python helper that fetches an Inkarnate map image by its CDN ID and returns the raw bytes, so the repo's ~497MB of images can be deleted and re-fetched on demand.

**Architecture:** Two pure-ish functions in one module — `build_url(image_id, width, height)` constructs the CDN transform URL (no network, fully testable), and `fetch_image(image_id, width=8192, height=6144)` GETs that URL via stdlib `urllib.request` and returns `bytes`, raising with the ID and HTTP status on non-200 or network failure.

**Tech Stack:** Python 3 standard library only (`urllib.request`). Tests use stdlib `unittest` (no pytest in this repo), run with `python3 -m unittest`.

---

### Task 1: `build_url` — construct the CDN URL

**Files:**
- Create: `scripts/inkarnate-fetch.py`
- Test: `scripts/test_inkarnate_fetch.py`

Note: the module filename has a hyphen, which is not importable via a normal `import`. The test loads it through `importlib` so both files stay in `scripts/` next to the other scripts. The loader helper is written once in Task 1 and reused.

- [ ] **Step 1: Write the failing test**

Create `scripts/test_inkarnate_fetch.py`:

```python
import importlib.util
import unittest
from pathlib import Path

_MODULE_PATH = Path(__file__).with_name("inkarnate-fetch.py")
_spec = importlib.util.spec_from_file_location("inkarnate_fetch", _MODULE_PATH)
inkarnate_fetch = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(inkarnate_fetch)


class TestBuildUrl(unittest.TestCase):
    def test_builds_url_with_custom_dimensions(self):
        url = inkarnate_fetch.build_url("abc123/map.png", 1800, 1000)
        self.assertEqual(
            url,
            "https://cdn2.inkarnate.com/cdn-cgi/image/width=1800,height=1000/"
            "https://cdn2.inkarnate.com/abc123/map.png",
        )

    def test_builds_url_passes_id_verbatim(self):
        url = inkarnate_fetch.build_url("XYZ/nested/file.png", 512, 472)
        self.assertTrue(url.endswith("https://cdn2.inkarnate.com/XYZ/nested/file.png"))
        self.assertIn("width=512,height=472", url)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest scripts.test_inkarnate_fetch 2>&1 || python3 scripts/test_inkarnate_fetch.py`
Expected: FAIL — the module file does not exist yet (`FileNotFoundError` / spec load error), or `build_url` is undefined.

- [ ] **Step 3: Write minimal implementation**

Create `scripts/inkarnate-fetch.py`:

```python
"""Fetch Inkarnate map images by CDN ID.

Images in this repo are deleted to keep it small; re-fetch any image on demand
given its Inkarnate ID. See docs/superpowers/specs/2026-06-14-inkarnate-fetch-design.md.
"""

_CDN_HOST = "https://cdn2.inkarnate.com"


def build_url(image_id: str, width: int, height: int) -> str:
    """Construct the Inkarnate CDN transform URL for an image ID."""
    return (
        f"{_CDN_HOST}/cdn-cgi/image/width={width},height={height}/"
        f"{_CDN_HOST}/{image_id}"
    )
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 scripts/test_inkarnate_fetch.py`
Expected: PASS (2 tests, in `TestBuildUrl`).

- [ ] **Step 5: Commit**

```bash
git add scripts/inkarnate-fetch.py scripts/test_inkarnate_fetch.py
git commit -m "feat: add build_url for inkarnate image helper"
```

---

### Task 2: `fetch_image` — happy path returns bytes

**Files:**
- Modify: `scripts/inkarnate-fetch.py`
- Test: `scripts/test_inkarnate_fetch.py`

- [ ] **Step 1: Write the failing test**

Append to `scripts/test_inkarnate_fetch.py` (before the `if __name__` block), and add `from unittest import mock` and `import io` to the imports at the top:

```python
class TestFetchImage(unittest.TestCase):
    def test_returns_response_bytes_and_requests_correct_url(self):
        fake_body = b"\x89PNG\r\n\x1a\nfakebytes"
        captured = {}

        class FakeResponse:
            status = 200

            def read(self):
                return fake_body

            def __enter__(self):
                return self

            def __exit__(self, *exc):
                return False

        def fake_urlopen(url, timeout=None):
            captured["url"] = url
            return FakeResponse()

        with mock.patch.object(inkarnate_fetch.urllib.request, "urlopen", fake_urlopen):
            result = inkarnate_fetch.fetch_image("abc123/map.png", width=1800, height=1000)

        self.assertEqual(result, fake_body)
        self.assertEqual(
            captured["url"],
            "https://cdn2.inkarnate.com/cdn-cgi/image/width=1800,height=1000/"
            "https://cdn2.inkarnate.com/abc123/map.png",
        )

    def test_defaults_to_full_resolution(self):
        captured = {}

        class FakeResponse:
            status = 200

            def read(self):
                return b"data"

            def __enter__(self):
                return self

            def __exit__(self, *exc):
                return False

        def fake_urlopen(url, timeout=None):
            captured["url"] = url
            return FakeResponse()

        with mock.patch.object(inkarnate_fetch.urllib.request, "urlopen", fake_urlopen):
            inkarnate_fetch.fetch_image("id.png")

        self.assertIn("width=8192,height=6144", captured["url"])
```

The top-of-file imports should now read:

```python
import importlib.util
import io
import unittest
from pathlib import Path
from unittest import mock
```

(`io` is imported for parity with the error-path test added in Task 3; harmless if unused now.)

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 scripts/test_inkarnate_fetch.py`
Expected: FAIL — `AttributeError: module 'inkarnate_fetch' has no attribute 'fetch_image'` (and `urllib` not present on the module).

- [ ] **Step 3: Write minimal implementation**

Add to the top of `scripts/inkarnate-fetch.py` (imports) and append the function:

```python
import urllib.error
import urllib.request
```

```python
def fetch_image(image_id: str, width: int = 8192, height: int = 6144) -> bytes:
    """Fetch a map image from Inkarnate's CDN by ID. Returns raw image bytes."""
    url = build_url(image_id, width, height)
    with urllib.request.urlopen(url, timeout=60) as response:
        status = getattr(response, "status", None)
        if status is not None and status != 200:
            raise RuntimeError(
                f"Failed to fetch image '{image_id}': HTTP {status}"
            )
        return response.read()
```

- [ ] **Step 4: Run test to verify it passes**

Run: `python3 scripts/test_inkarnate_fetch.py`
Expected: PASS (4 tests total).

- [ ] **Step 5: Commit**

```bash
git add scripts/inkarnate-fetch.py scripts/test_inkarnate_fetch.py
git commit -m "feat: fetch_image returns image bytes from inkarnate"
```

---

### Task 3: `fetch_image` — error path raises with ID and status

**Files:**
- Modify: `scripts/inkarnate-fetch.py`
- Test: `scripts/test_inkarnate_fetch.py`

`urllib.request.urlopen` raises `urllib.error.HTTPError` on a 4xx/5xx, so the
real failure surfaces as an exception, not a non-200 `.status`. The handler must
catch `HTTPError` and re-raise with the ID and code in the message.

- [ ] **Step 1: Write the failing test**

Append to `TestFetchImage` in `scripts/test_inkarnate_fetch.py`:

```python
    def test_http_error_raises_with_id_and_status(self):
        def fake_urlopen(url, timeout=None):
            raise inkarnate_fetch.urllib.error.HTTPError(
                url=url, code=404, msg="Not Found", hdrs=None, fp=io.BytesIO(b"")
            )

        with mock.patch.object(inkarnate_fetch.urllib.request, "urlopen", fake_urlopen):
            with self.assertRaises(RuntimeError) as ctx:
                inkarnate_fetch.fetch_image("missing/map.png")

        message = str(ctx.exception)
        self.assertIn("missing/map.png", message)
        self.assertIn("404", message)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 scripts/test_inkarnate_fetch.py`
Expected: FAIL — the `HTTPError` propagates uncaught (raised as `HTTPError`, not `RuntimeError`), so `assertRaises(RuntimeError)` fails.

- [ ] **Step 3: Write minimal implementation**

Replace the body of `fetch_image` in `scripts/inkarnate-fetch.py` with:

```python
def fetch_image(image_id: str, width: int = 8192, height: int = 6144) -> bytes:
    """Fetch a map image from Inkarnate's CDN by ID. Returns raw image bytes."""
    url = build_url(image_id, width, height)
    try:
        with urllib.request.urlopen(url, timeout=60) as response:
            status = getattr(response, "status", None)
            if status is not None and status != 200:
                raise RuntimeError(
                    f"Failed to fetch image '{image_id}': HTTP {status}"
                )
            return response.read()
    except urllib.error.HTTPError as exc:
        raise RuntimeError(
            f"Failed to fetch image '{image_id}': HTTP {exc.code}"
        ) from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(
            f"Failed to fetch image '{image_id}': {exc.reason}"
        ) from exc
```

- [ ] **Step 4: Run full test suite to verify all pass**

Run: `python3 scripts/test_inkarnate_fetch.py`
Expected: PASS (5 tests total).

- [ ] **Step 5: Commit**

```bash
git add scripts/inkarnate-fetch.py scripts/test_inkarnate_fetch.py
git commit -m "feat: fetch_image raises with id and status on failure"
```

---

## Self-Review

**Spec coverage:**
- `build_url` (testable URL construction) → Task 1. ✓
- `fetch_image` returns bytes, configurable dims with full-res default → Task 2. ✓
- URL form matches spec exactly → Tasks 1 & 2 assert the literal string. ✓
- Stdlib only (`urllib`), no new dependency → Tasks 2 & 3 import `urllib.request`/`urllib.error`. ✓
- Errors raise with ID + status, no retries, no silent None → Task 3. ✓
- `image_id` passed verbatim → Task 1 `test_builds_url_passes_id_verbatim`. ✓
- Out-of-scope items (registry, disk save, CLI, batch) → not in any task. ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"; every code step shows full code. ✓

**Type/name consistency:** `build_url(image_id, width, height)` and `fetch_image(image_id, width=8192, height=6144)` referenced identically across all tasks. Module loaded as `inkarnate_fetch` from `inkarnate-fetch.py` consistently. ✓

**Note on the 200-check:** real `urllib` raises `HTTPError` for non-2xx, so the explicit `status != 200` branch is defensive (covers the mocked-non-200 case and any redirect-followed odd status); the `HTTPError` catch handles the real 404 path. Both are tested.
