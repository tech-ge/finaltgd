SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

.PHONY: help install dev build lint typecheck test clean \
        infra-up infra-down db-migrate db-seed \
        deploy-render deploy-zeabur deploy-vercel deploy-hf deploy-cf \
        build-apk build-ios train-shadow

help:
	@grep -E "^[a-zA-Z_-]+:.*?## .*$$" $(MAKEFILE_LIST) \
		| awk "BEGIN {FS = \":.*?## \"}; {printf \"%-20s %s\n\", \$$1, \$$2}"

install: ## Install all dependencies
	pnpm install

dev: ## Run all services in development mode
	pnpm dev

build: ## Build all packages and services
	pnpm build

lint: ## Lint all sources
	pnpm lint

typecheck: ## Run TypeScript type checking
	pnpm typecheck

test: ## Run all unit tests
	pnpm test

clean: ## Remove all build artifacts
	pnpm clean

infra-up: ## Start local Docker infrastructure
	bash scripts/dev-up.sh

infra-down: ## Stop local Docker infrastructure
	bash scripts/dev-down.sh

db-migrate: ## Run database migrations
	bash scripts/db-migrate.sh

db-seed: ## Seed databases with initial data
	bash scripts/db-seed.sh

deploy-render: ## Deploy backend services to Render
	bash scripts/deploy-render.sh

deploy-zeabur: ## Deploy always-on services to Zeabur
	bash scripts/deploy-zeabur.sh

deploy-vercel: ## Deploy web frontends to Vercel
	bash scripts/deploy-vercel.sh

deploy-hf: ## Push AI models to Hugging Face Spaces
	bash scripts/deploy-huggingface.sh

deploy-cf: ## Deploy Cloudflare edge worker
	bash scripts/deploy-cloudflare.sh

build-apk: ## Build Android APK for user app
	bash scripts/build-apk.sh

build-ios: ## Build iOS IPA for user app
	bash scripts/build-ios.sh

train-shadow: ## Train Shadow Student model
	bash scripts/train-shadow.sh
