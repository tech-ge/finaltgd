"""Idle training orchestrator for the Shadow Student."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Idle training loop")
    parser.add_argument("--gold-logs", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--config", required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not Path(args.config).is_file():
        raise SystemExit(f"config not found: {args.config}")

    train_entry = Path(__file__).resolve().parent.parent / "shadow-student" / "training" / "train.py"
    result = subprocess.run(
        [
            sys.executable,
            str(train_entry),
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
        raise SystemExit(f"training failed with code {result.returncode}")
    print("idle training complete")


if __name__ == "__main__":
    main()
