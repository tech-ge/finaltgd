# Identity and Traceback

## Purpose

Verify national ID and bind each account to a single device.

## Device Binding

Every account is bound to exactly one device fingerprint at registration.
The fingerprint combines hardware identifiers available to the app.

A second device attempt is rejected. Recovery requires a formal dispute
record with evidence. Dispute access is logged to the immutable trail.

## Traceback

National ID, nationality, and identity documents are encrypted at rest.
Keys are held in a managed KMS. Decryption requires a dispute record
created by an authorized admin and approved by a second authorized admin.

Every read is written to audit_logs with actor, timestamp, target, and
reason. Reads are never deleted.

## Data Minimization

The system stores the minimum necessary to satisfy regulatory and dispute
requirements. Identity data is not used for marketing, analytics, or AI
training.
