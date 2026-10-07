"""Nightly training scheduler."""

from __future__ import annotations

import argparse
import subprocess
import sys
import time
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Nightly training scheduler")
    parser.add_argument("--gold-logs", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--config", required=True)
    parser.add_argument("--interval-hours", type=int, default=24)
    parser.add_argument("--once", action="store_true")
    return parser.parse_args()


def run_once(args: argparse.Namespace) -> int:
    entry = Path(__file__).resolve().parent / "idle_train.py"
    result = subprocess.run(
        [
            sys.executable,
            str(entry),
            "--gold-logs",
            args.gold_logs,
            "--output",
            args.output,
            "--config",
            args.config,
        ],
        check=False,
    )
    return result.returncode


def main() -> None:
    args = parse_args()
    if args.once:
        raise SystemExit(run_once(args))

    while True:
        code = run_once(args)
        print(f"training cycle finished with code {code}")
        time.sleep(args.interval_hours * 3600)


if __name__ == "__main__":
    main()
