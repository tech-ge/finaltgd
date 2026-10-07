# Pub/Sub Channels

    payments.pending.<account_id>      Payment accepted, awaiting settlement
    payments.settled.<account_id>      Payment settled
    gps.live.<org_id>                  Live worker positions for a supervisor
    attendance.event.<org_id>          Attendance event stream
    ai.event.<account_id>              AI action notifications

Channels are namespaced by tenant. Subscribers must authenticate before
joining any channel.
