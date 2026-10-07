#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail() {
  echo "invariant_violation: $1"
  exit 1
}

# 1. No withdrawal operation anywhere in production code.
if grep -RIn --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=tests \
  -E "WITHDRAW|withdrawal" services packages apps 2>/dev/null \
  | grep -v "policy.ts" \
  | grep -v "RedisLock" \
  | grep -v "docs" >/dev/null; then
  fail "withdrawal reference found outside policy.ts"
fi

# 2. Ledger policy excludes withdrawal.
if ! grep -q "FORBIDDEN_OPERATIONS" services/currency/src/ledger/policy.ts; then
  fail "ledger policy missing forbidden operations guard"
fi

# 3. AI refusal engine rejects commands.
if ! grep -q "commands_are_not_permitted" services/ai-orchestrator/src/agent-to-agent/RefusalEngine.ts; then
  fail "refusal engine missing command guard"
fi

# 4. Voice vault enforces ownership.
if ! grep -q "voice_vault_ownership_denied" services/assistant/src/voice-clone/VoiceVault.ts; then
  fail "voice vault missing ownership guard"
fi

# 5. Laptop mirror blocks transactions.
if [[ -f apps/laptop-mirror/src/components/ReadOnlyGuard.tsx ]]; then
  if ! grep -q "Read only" apps/laptop-mirror/src/components/ReadOnlyGuard.tsx; then
    fail "laptop mirror missing read only guard"
  fi
fi

echo "invariants_ok"
