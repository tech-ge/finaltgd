"""Convert a saved TensorFlow model to TFLite for on-device use."""

from __future__ import annotations

import argparse
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Convert model to TFLite")
    parser.add_argument("--input", required=True, help="SavedModel directory")
    parser.add_argument("--output", required=True, help="Output .tflite file")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    src = Path(args.input)
    if not src.exists():
        raise SystemExit(f"input not found: {args.input}")

    try:
        import tensorflow as tf  # noqa: F401
    except ImportError as err:
        raise SystemExit(f"tensorflow required: {err}")

    converter = tf.lite.TFLiteConverter.from_saved_model(str(src))
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_model = converter.convert()

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(tflite_model)
    print("tflite written:", out)


if __name__ == "__main__":
    main()
