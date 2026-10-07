"""Hugging Face Space entry for Shadow vs native comparison."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

CASES = os.environ.get("CASES", "/data/cases.jsonl")
SHADOW = os.environ.get("SHADOW_REPORT", "/data/shadow.json")
NATIVE = os.environ.get("NATIVE_REPORT", "/data/native.json")
OUTPUT = os.environ.get("OUTPUT", "/data/comparison.json")


def main() -> None:
    script = Path(__file__).resolve()
    pipeline = script.parent.parent.parent / "ai" / "pipelines" / "shadow_vs_native.py"
    if not pipeline.is_file():
        raise SystemExit(f"pipeline script not found: {pipeline}")

    result = subprocess.run(
        [
            sys.executable,
            str(pipeline),
            "--cases",
            CASES,
            "--shadow-report",
            SHADOW,
            "--native-report",
            NATIVE,
            "--output",
            OUTPUT,
        ],
        check=False,
    )
    raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
