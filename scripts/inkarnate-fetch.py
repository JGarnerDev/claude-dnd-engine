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
