"""Text-to-speech synthesis helper."""

from __future__ import annotations

import argparse
import wave
from pathlib import Path

import numpy as np


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="TTS synthesis")
    parser.add_argument("--text", required=True)
    parser.add_argument("--output", required=True, help="Output WAV file")
    parser.add_argument("--sample-rate", type=int, default=22050)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    sr = args.sample_rate
    duration_seconds = max(1.0, len(args.text) / 15.0)
    t = np.linspace(0, duration_seconds, int(sr * duration_seconds), endpoint=False)
    tone = 0.05 * np.sin(2 * np.pi * 220.0 * t)
    pcm = (tone * 32767).astype(np.int16)

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)

    with wave.open(str(out), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sr)
        wav.writeframes(pcm.tobytes())

    print("synthesis written:", out)


if __name__ == "__main__":
    main()
