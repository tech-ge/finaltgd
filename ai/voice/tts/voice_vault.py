"""Per-account voice vault helper."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Voice vault access")
    parser.add_argument("--vault-dir", required=True)
    parser.add_argument("--account-id", required=True, type=int)
    parser.add_argument("--action", choices=["read", "list"], required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    root = Path(args.vault_dir)
    account_dir = root / str(args.account_id)

    if args.action == "list":
        if not account_dir.is_dir():
            print(json.dumps({"accountId": args.account_id, "entries": []}, indent=2))
            return
        entries = sorted(p.name for p in account_dir.iterdir() if p.is_file())
        print(json.dumps({"accountId": args.account_id, "entries": entries}, indent=2))
        return

    fingerprint = account_dir / "fingerprint.json"
    if not fingerprint.is_file():
        raise SystemExit(f"fingerprint not found: {fingerprint}")
    print(fingerprint.read_text(encoding="utf-8"))


if __name__ == "__main__":
    main()
