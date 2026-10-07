"""Compare Shadow Student with the native model on a case suite."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Shadow vs native comparison")
    parser.add_argument("--cases", required=True)
    parser.add_argument("--shadow-report", required=True)
    parser.add_argument("--native-report", required=True)
    parser.add_argument("--output", required=True)
    return parser.parse_args()


def load_report(path: str) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def main() -> None:
    args = parse_args()
    shadow = load_report(args.shadow_report)
    native = load_report(args.native_report)

    comparison = {
        "cases": args.cases,
        "shadow_accuracy": float(shadow.get("accuracy", 0.0)),
        "native_accuracy": float(native.get("accuracy", 0.0)),
        "shadow_total": int(shadow.get("total", 0)),
        "native_total": int(native.get("total", 0)),
    }
    comparison["promote_shadow"] = (
        comparison["shadow_accuracy"] >= comparison["native_accuracy"]
    )

    Path(args.output).write_text(json.dumps(comparison, indent=2), encoding="utf-8")
    print("comparison written:", args.output)


if __name__ == "__main__":
    main()
