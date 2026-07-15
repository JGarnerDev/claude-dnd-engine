#!/usr/bin/env python3
"""
setup-hooks.py -- One-time per clone. Points git at .githooks/ and ensures the
Markdown formatter binary is installed. Safe to re-run.
"""
# consumers: README.md

import shutil
import subprocess
import sys


def main() -> int:
    subprocess.run(["git", "config", "core.hooksPath", ".githooks"], check=True)
    print("core.hooksPath -> .githooks (pre-commit Markdown formatting enabled)")

    if shutil.which("markdownlint-cli2"):
        print("markdownlint-cli2 already installed.")
        return 0

    npm = shutil.which("npm")
    if not npm:
        print("npm not found; install Node.js, then run: npm install -g markdownlint-cli2@0.13.0")
        return 1

    print("Installing markdownlint-cli2@0.13.0 globally (node 18 pin)...")
    result = subprocess.run([npm, "install", "-g", "markdownlint-cli2@0.13.0"])
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
