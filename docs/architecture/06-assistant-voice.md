# Assistant Voice

## Purpose

Provide a voice interface that speaks in the user's own voice.

## Voice Enrollment

Enrollment captures a short sample of the user's speech. A voice
fingerprint is derived and stored in the account's voice vault. The
fingerprint is encrypted with a per-account key.

## Voice Vault

Every voice asset is scoped to a single account. No account can access
another account's voice vault. Access requires the account's session
token and a biometric handshake on the primary device.

## Daily Learning

The assistant listens for new samples during normal usage. Samples are
processed on device, converted to fingerprint deltas, and uploaded. Raw
audio is discarded after processing.

## Call Handling

Incoming calls are answered by the assistant if the caller is known and
the user has enabled auto-answer. The assistant responds using the user's
voice and the conversation history for context. If the caller is unknown
or the request is unusual, the call is forwarded to the user.

## Emergency

The assistant places emergency calls when it detects an accident or a
health crisis. Detection uses sensor fusion plus audio analytics. The
emergency contact list is user-defined.
