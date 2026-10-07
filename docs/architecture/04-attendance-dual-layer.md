# Attendance Dual-Layer Verification

## Purpose

Register worker presence at a worksite without requiring manual action.

## Verification Layers

Layer 1: IP match. The phone's public IP must match the organization's
registered gateway IP. This catches remote clock-ins.

Layer 2: GPS match. The phone must be inside a 50-meter radius of the
organization's registered coordinates. This catches IP spoofing.

Both layers must match. The result is written to attendance_logs with
verification_status set to AUTOMATIC_GEO_MATCH.

If only one layer matches, the log is written with FAILED_IP or
FAILED_GEO and the supervisor is alerted.

## Live Monitor

The supervisor console streams attendance events in real time via
WebSocket. Events are pushed from the cache Redis pub/sub channel.

## Fraud Detection

Mock GPS detection flags sudden position jumps incompatible with human
travel speed. Repeated flags trigger a formal review.
