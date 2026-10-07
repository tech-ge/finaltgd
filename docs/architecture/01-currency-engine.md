# Currency Engine

## Purpose

The currency engine manages the TechGeo Dollar (TGD) internal ledger.

## Operations

    DEPOSIT_FIAT        Fiat enters via M-Pesa or bank ingestion
    SEND_INTERNAL       User to user transfer
    SEND_BUSINESS       User to business transfer
    ESCROW_LOCK         Funds held pending conditions
    ESCROW_RELEASE      Funds released on condition match

## Non Operations

    WITHDRAW            Does not exist. No route. No function. No table.

## Data Model

All amounts stored as DECIMAL(18, 4). Never floating point.

Balances derived from ledger entries, not stored as a single mutable column.

Every transfer writes two rows: a debit and a credit. Sum of all debits
equals sum of all credits at all times.

## Minting Pipeline

1. User triggers a deposit request in the wallet app.
2. Gateway forwards to currency service with idempotency key.
3. Currency service acquires a distributed lock on the ledger Redis.
4. Currency service reads the current rate from currency_rates.
5. Currency service writes fiat_deposits row with gateway_reference unique.
6. Currency service writes two ledger entries: debit treasury, credit user.
7. Lock released. Response returned to user.

## Escrow

Escrow locks are written to escrow_transactions with a state column.
Release requires GPS arrival at Point B plus a biometric handshake.
Both checks are recorded in the release event for audit.
