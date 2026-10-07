# Two-Point Protocol

## Purpose

Route a user from Point A (work or event) to Point B (accommodation or
resource) using live conditions.

## Inputs

    Point A coordinates and time window
    Point B coordinates and time window
    Mode of transport

## Signals

    Traffic ingestion from phones on the route (crowd speed)
    Traffic light stop durations logged over time
    Weather forecast for the route corridor
    Historical route durations

## Output

    Primary route with ETA
    Alternative routes with ETA and tradeoffs
    Feasibility verdict (arrives before deadline)
    Congestion forecast at key segments

## Geo-Fenced Meetup

When two users set an appointment, each device monitors its own position
relative to the venue. Within 200 meters, each device shares a coarse
position with the other to reduce search time. Precise position is never
shared outside the fence.

## Path Logging

Every route taken is logged to map_paths with the observed path. Shortcuts
discovered by users are mined into custom road candidates for review.
