"""Export gold logs from MongoDB to JSONL for training."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from pymongo import MongoClient


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Gold log export")
    parser.add_argument("--source", required=True, help="MongoDB connection URI")
    parser.add_argument("--out", required=True, help="Output directory")
    parser.add_argument("--limit", type=int, default=10000)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    output_dir = Path(args.out)
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / "gold_logs.jsonl"

    client = MongoClient(args.source)
    try:
        db = client.get_default_database()
        collection = db["gold_logs"]
        cursor = collection.find({}).limit(args.limit)
        count = 0
        with output_file.open("w", encoding="utf-8") as fh:
            for document in cursor:
                document.pop("_id", None)
                if isinstance(document.get("createdAt"), dict):
                    pass
                elif hasattr(document.get("createdAt"), "isoformat"):
                    document["createdAt"] = document["createdAt"].isoformat()
                fh.write(json.dumps(document, default=str) + "\n")
                count += 1
        print(f"exported {count} gold logs to {output_file}")
    finally:
        client.close()


if __name__ == "__main__":
    main()
