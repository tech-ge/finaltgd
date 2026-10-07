"""Compare Shadow Student output against a baseline reference."""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class EvalCase:
    case_id: str
    prompt: str
    expected_intent: str


@dataclass(frozen=True)
class EvalResult:
    case_id: str
    matched: bool
    output: str


def load_cases(path: Path) -> list[EvalCase]:
    cases: list[EvalCase] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            record = json.loads(line)
            cases.append(
                EvalCase(
                    case_id=str(record["caseId"]),
                    prompt=str(record["prompt"]),
                    expected_intent=str(record["expectedIntent"]),
                )
            )
    return cases


def main() -> None:
    parser = argparse.ArgumentParser(description="Shadow Student head-to-head evaluation")
    parser.add_argument("--cases", required=True, help="Path to cases.jsonl")
    parser.add_argument("--report", required=True, help="Path to write the report")
    args = parser.parse_args()

    cases_path = Path(args.cases)
    if not cases_path.is_file():
        raise SystemExit(f"cases file not found: {args.cases}")

    cases = load_cases(cases_path)
    results: list[EvalResult] = []
    for case in cases:
        # Inference is executed by the GPU environment. Here we record
        # the case so a downstream runner can attach predictions.
        results.append(EvalResult(case_id=case.case_id, matched=False, output=""))

    matched = sum(1 for r in results if r.matched)
    report = {
        "total": len(results),
        "matched": matched,
        "accuracy": matched / len(results) if results else 0.0,
        "results": [r.__dict__ for r in results],
    }
    Path(args.report).write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("eval report written:", args.report)


if __name__ == "__main__":
    main()
