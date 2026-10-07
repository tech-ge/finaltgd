"""Compute a deterministic hash for a voice sample."""

from __future__ import annotations

import argparse
import hashlib
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Voice fingerprint hash")
    parser.add_argument("--input", required=True, help="WAV input file")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    src = Path(args.input)
    if not src.is_file():
        raise SystemExit(f"input not found: {args.input}")

    data = src.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    print(digest)


if __name__ == "__main__":
    main()
