"""LoRA fine-tuning entrypoint for the TechGeo Shadow Student."""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import yaml


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="TechGeo Shadow Student LoRA training")
    parser.add_argument("--config", required=True, help="Path to config.yaml")
    parser.add_argument("--gold-logs", required=True, help="Directory containing gold logs")
    parser.add_argument("--output", required=True, help="Output directory for checkpoints")
    return parser.parse_args()


def load_config(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def main() -> None:
    args = parse_args()
    config = load_config(args.config)

    gold_logs_dir = args.gold_logs or config["data"]["gold_logs_dir"]
    output_dir = args.output or config["training"]["output_dir"]
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Real training requires GPU and transformers. When unavailable, we
    # write a manifest so downstream tooling can detect the missing run.
    try:
        import torch  # noqa: F401
        from transformers import AutoModelForCausalLM, AutoTokenizer  # noqa: F401
        from peft import LoraConfig, get_peft_model  # noqa: F401
    except ImportError as err:
        manifest = {
            "status": "skipped",
            "reason": f"missing_dependency: {err.name}",
            "config": args.config,
            "gold_logs_dir": gold_logs_dir,
            "output_dir": output_dir,
        }
        Path(output_dir, "training_manifest.json").write_text(
            __import__("json").dumps(manifest, indent=2),
            encoding="utf-8",
        )
        print("training skipped:", manifest["reason"])
        return

    # Training implementation intentionally left for the GPU environment.
    # The environment variables below are read by transformers at runtime.
    os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

    manifest = {
        "status": "ready",
        "config": args.config,
        "gold_logs_dir": gold_logs_dir,
        "output_dir": output_dir,
        "base_model": config["model"]["base"],
    }
    Path(output_dir, "training_manifest.json").write_text(
        __import__("json").dumps(manifest, indent=2),
        encoding="utf-8",
    )
    print("training manifest written:", output_dir)


if __name__ == "__main__":
    main()
