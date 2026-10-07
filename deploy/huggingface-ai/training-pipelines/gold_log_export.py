"""Hugging Face Space entry for gold log export."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

MONGO_URL = os.environ.get("MONGO_URL", "")
OUT_DIR = os.environ.get("GOLD_LOGS_DIR", "/data/gold-logs")


def main() -> None:
    if not MONGO_URL:
        raise SystemExit("MONGO_URL must be set")

    script = Path(__file__).resolve()
    pipeline = script.parent.parent.parent / "ai" / "pipelines" / "gold_log_export.py"
    if not pipeline.is_file():
        raise SystemExit(f"pipeline script not found: {pipeline}")

    result = subprocess.run(
        [
            sys.executable,
            str(pipeline),
            "--source",
            MONGO_URL,
            "--out",
            OUT_DIR,
        ],
        check=False,
    )
    raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
