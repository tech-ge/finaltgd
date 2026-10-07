# Health Engine

## Purpose

Aggregate sensor data into wellness signals and distribute rewards.

## Sensor Fusion

Inputs:

    Accelerometer
    Gyroscope
    Photoplethysmogram (PPG) where available

Outputs:

    Sleep quality score
    Active hours
    Cardiovascular stress proxy

## Audio Analytics

On-device models classify breathing and voice snippets for early signs
of respiratory distress or fatigue. Raw audio is not uploaded. Only the
classification result and a confidence score are transmitted.

## Move-to-Earn

Step goals are defined per user. When a goal is met, the health service
dispatches a reward event. The currency service mints a fractional TGD
amount to the user's ledger.

Anti-cheat validates step counts against accelerometer patterns and
rejects impossible cadences.

## Medical Disclaimer

The health engine is not a medical device. It does not diagnose or treat
any condition. Users with concerns must consult a licensed professional.
