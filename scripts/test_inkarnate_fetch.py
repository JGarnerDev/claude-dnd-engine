import importlib.util
import io
import unittest
from pathlib import Path
from unittest import mock

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


if __name__ == "__main__":
    unittest.main()
