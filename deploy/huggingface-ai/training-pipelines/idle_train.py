"""Hugging Face Space entry for the idle training cycle."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

GOLD_LOGS_DIR = os.environ.get("GOLD_LOGS_DIR", "/data/gold-logs")
OUTPUT_DIR = os.environ.get("OUTPUT_DIR", "/data/checkpoints")
CONFIG_PATH = os.environ.get("CONFIG_PATH", "/app/config.yaml")


def main() -> None:
    script = Path(__file__).resolve()
    pipeline = script.parent.parent.parent / "ai" / "pipelines" / "idle_train.py"
    if not pipeline.is_file():
        raise SystemExit(f"pipeline script not found: {pipeline}")

    result = subprocess.run(
        [
            sys.executable,
            str(pipeline),
            "--gold-logs",
            GOLD_LOGS_DIR,
            "--output",
            OUTPUT_DIR,
            "--config",
            CONFIG_PATH,
        ],
        check=False,
    )
    raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
