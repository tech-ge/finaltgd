"""Load gold logs from JSONL files and yield training examples."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Iterator


@dataclass(frozen=True)
class TrainingExample:
    account_id: int
    intent: str
    outcome: str
    latency_ms: int
    score: float


def _iter_jsonl(path: Path) -> Iterator[dict]:
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                continue


def load_examples(
    gold_logs_dir: str,
    min_quality_score: float = 0.7,
) -> list[TrainingExample]:
    root = Path(gold_logs_dir)
    if not root.is_dir():
        raise FileNotFoundError(f"gold_logs_dir not found: {gold_logs_dir}")

    examples: list[TrainingExample] = []
    for path in sorted(root.glob("*.jsonl")):
        for record in _iter_jsonl(path):
            try:
                score = float(record.get("score", 0.0))
                if score < min_quality_score:
                    continue
                examples.append(
                    TrainingExample(
                        account_id=int(record["accountId"]),
                        intent=str(record["intent"]),
                        outcome=str(record["outcome"]),
                        latency_ms=int(record.get("latencyMs", 0)),
                        score=score,
                    )
                )
            except (KeyError, TypeError, ValueError):
                continue
    return examples


def to_prompt_completion(example: TrainingExample) -> dict[str, str]:
    prompt = (
        "You are the TechGeo Shadow Student.\n"
        f"Intent: {example.intent}\n"
        "Respond with a concise action recommendation."
    )
    completion = example.outcome
    return {"prompt": prompt, "completion": completion}


def iter_prompt_completions(
    examples: Iterable[TrainingExample],
) -> Iterator[dict[str, str]]:
    for example in examples:
        yield to_prompt_completion(example)
