"""Summarize evaluation reports into a single accuracy document."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Aggregate evaluation reports")
    parser.add_argument("--input", required=True, help="Directory of report JSON files")
    parser.add_argument("--output", required=True, help="Path to write summary JSON")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    root = Path(args.input)
    if not root.is_dir():
        raise SystemExit(f"input directory not found: {args.input}")

    totals = 0
    matched = 0
    sources: list[str] = []

    for path in sorted(root.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        totals += int(data.get("total", 0))
        matched += int(data.get("matched", 0))
        sources.append(path.name)

    summary = {
        "sources": sources,
        "total": totals,
        "matched": matched,
        "accuracy": matched / totals if totals else 0.0,
    }
    Path(args.output).write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("accuracy summary written:", args.output)


if __name__ == "__main__":
    main()
