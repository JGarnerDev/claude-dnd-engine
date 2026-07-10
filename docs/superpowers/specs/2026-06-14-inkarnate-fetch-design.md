# Design: `scripts/inkarnate-fetch.py`

## Problem

The repository carries ~497MB of map images (Inkarnate-generated PNGs under `maps/`).
This makes the repo unwieldy to clone, share, and update. All images can be
re-sourced from Inkarnate's CDN given an image ID, via a URL of the form:

```text
https://cdn2.inkarnate.com/cdn-cgi/image/width={w},height={h}/https://cdn2.inkarnate.com/{image_id}
```

The goal is a helper that fetches any image by ID so the repo's images can be
deleted and re-fetched on demand.

## Scope

In scope:

- A Python helper that builds the CDN URL from an image ID and dimensions.
- Fetching the image over HTTP and returning the raw bytes in memory.

Out of scope (YAGNI):

- The ID-to-file mapping/registry. IDs are supplied at a future step.
- Saving fetched bytes to disk, batch-restore loops, tile regeneration. The
  caller composes those from the returned bytes.
- CLI argument parsing. The module is importable; a `__main__` entry point can
  be added later if command-line use is wanted.

## Interface

`scripts/inkarnate-fetch.py` exposes two functions.

```python
def build_url(image_id: str, width: int, height: int) -> str:
    """Construct the Inkarnate CDN transform URL for an image ID."""

def fetch_image(image_id: str, width: int = 8192, height: int = 6144) -> bytes:
    """Fetch a map image from Inkarnate's CDN by ID. Returns raw image bytes."""
```

- `image_id` is treated as a bare path segment and passed through verbatim.
- `width` / `height` default to full source resolution (8192x6144, matching
  `maps/world/world-names.png`). Callers wanting tiles or crops pass their own.
- `fetch_image` returns `bytes`; the caller decides what to do with them.
- `build_url` is split out so URL construction is testable without a network
  call.

## Behavior

- **URL construction** interpolates `width` and `height` into the
  `cdn-cgi/image/...` transform path, then appends the bare `image_id` after the
  second CDN host segment, exactly matching the URL form above.
- **Fetch** uses the Python standard library (`urllib.request`) so no new
  dependency is introduced. It performs a GET and reads the response body into
  `bytes`.
- **Errors** raise with clear context. A non-200 HTTP status raises an exception
  whose message includes the image ID and the status code. Network-level
  failures propagate with the image ID in the message. No retries, no silent
  `None`.

## Testing (TDD)

Tests are written first and cover:

- `build_url` produces the exact expected URL for a known ID with custom
  dimensions, and with the defaults. No network.
- `fetch_image` happy path: HTTP layer mocked; asserts the returned value is the
  response bytes and that the correct URL was requested.
- `fetch_image` error path: mocked non-200 response raises, and the raised
  message contains both the image ID and the HTTP status code.
