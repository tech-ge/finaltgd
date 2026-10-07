# Terraform

Provisioning templates for scale-out environments. Not required for
free-tier development. Use only after the free tier is exhausted.

## Environments

- dev       Single region, single replica per service
- staging   Single region, two replicas per service
- prod      Multi-region, three replicas per service

## Modules

- network   VPC, subnets, firewall rules
- postgres  Managed Postgres
- mongo     Managed MongoDB
- redis     Managed Redis with noeviction for the ledger instance
- kafka     Managed Kafka
- s3        Object storage for backups and model artifacts
- kms       Key management for identity and voice encryption
