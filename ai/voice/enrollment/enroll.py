"""Voice enrollment helper."""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import soundfile as sf


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Voice enrollment")
    parser.add_argument("--input", required=True, help="WAV input file")
    parser.add_argument("--output", required=True, help="Output fingerprint file")
    parser.add_argument("--account-id", required=True, type=int)
    return parser.parse_args()


def load_audio(path: Path) -> tuple[np.ndarray, int]:
    data, sample_rate = sf.read(str(path), dtype="float32", always_2d=False)
    if data.ndim > 1:
        data = data.mean(axis=1)
    return data, sample_rate


def main() -> None:
    args = parse_args()
    src = Path(args.input)
    if not src.is_file():
        raise SystemExit(f"input not found: {args.input}")

    audio, sample_rate = load_audio(src)
    duration_ms = int(len(audio) / sample_rate * 1000)
    if duration_ms < 1500:
        raise SystemExit("sample_too_short: must be at least 1500ms")

    # Placeholder fingerprint: mean and variance of the waveform.
    fingerprint = {
        "accountId": args.account_id,
        "sampleRateHz": sample_rate,
        "durationMs": duration_ms,
        "mean": float(np.mean(audio)),
        "variance": float(np.var(audio)),
    }

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(__import__("json").dumps(fingerprint, indent=2), encoding="utf-8")
    print("fingerprint written:", out)


if __name__ == "__main__":
    main()
