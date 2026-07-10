"""Fetch Inkarnate map images by CDN ID.

Images in this repo are deleted to keep it small; re-fetch any image on demand
given its Inkarnate ID. See docs/superpowers/specs/2026-06-14-inkarnate-fetch-design.md.
"""

import urllib.error
import urllib.request

_CDN_HOST = "https://cdn2.inkarnate.com"


def build_url(image_id: str, width: int, height: int) -> str:
    """Construct the Inkarnate CDN transform URL for an image ID."""
    return (
        f"{_CDN_HOST}/cdn-cgi/image/width={width},height={height}/"
        f"{_CDN_HOST}/{image_id}"
    )


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
