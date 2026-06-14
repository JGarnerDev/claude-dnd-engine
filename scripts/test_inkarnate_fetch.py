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
