"""High-level training orchestrator for the Shadow Student."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="TechGeo Shadow Student orchestrator")
    parser.add_argument("--config", required=True)
    parser.add_argument("--gold-logs", required=True)
    parser.add_argument("--output", required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    script_dir = Path(__file__).resolve().parent
    finetune = script_dir / "lora_finetune.py"

    result = subprocess.run(
        [
            sys.executable,
            str(finetune),
            "--config",
            args.config,
            "--gold-logs",
            args.gold_logs,
            "--output",
            args.output,
        ],
        check=False,
    )

    if result.returncode != 0:
        raise SystemExit(f"lora_finetune exited with code {result.returncode}")

    print("training orchestrator complete")


if __name__ == "__main__":
    main()
