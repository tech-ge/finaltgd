# AI Training

## Gold Logs

The admin service extracts high-quality events from Mongo into
ai/shadow-student/gold-logs/extracted. Quality is scored by the admin
service before export.

    bash scripts/export-gold-logs.sh

## Training

Nightly idle training runs LoRA fine-tuning on the base model.

    bash scripts/train-shadow.sh

Checkpoints are written to ai/shadow-student/lora-checkpoints/latest.

## Evaluation

Run the head-to-head evaluation before promoting a checkpoint.

    python3 ai/shadow-student/eval/head_to_head.py

## Promotion

A checkpoint is promoted only if its accuracy on the evaluation suite
matches or exceeds the current production model. Promotion is a manual
step.
