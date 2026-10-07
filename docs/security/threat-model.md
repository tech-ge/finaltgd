# Threat Model

## Assets

- TGD balances and ledger entries
- National ID records and device fingerprints
- Voice embeddings and call history
- Live location streams and attendance records
- AI context access logs

## Adversaries

- External attacker attempting account takeover
- Malicious user attempting double-spend
- Malicious user attempting mock GPS for attendance fraud
- Insider attempting unauthorized data access
- Compromised client device

## Controls

### Account Takeover

Device binding: one phone maps to one account. A new device requires
formal dispute and re-verification. JWT is short-lived and bound to the
device fingerprint.

### Double-Spend

Distributed lock acquired on the ledger Redis instance before every
transfer. Lock uses SET NX PX with a random token. Release uses a Lua
script that checks the token before deletion. Balance check occurs
inside the lock.

### Mock GPS

Attendance verification requires IP match AND GPS inside 50 meters AND
biometric handshake. Sudden position jumps are flagged.

### Insider Data Access

Traceback fields are encrypted with KMS-held keys. Access requires a
dispute record. Every access is written to the immutable audit trail.

### Compromised Device

Sessions are invalidated on device fingerprint mismatch. Voice
enrollment requires re-authentication. Emergency dialing remains
available as a safety exception.

## Out of Scope

Nation-state adversaries. Physical device seizure. Supply chain attacks
on managed hosting providers.
