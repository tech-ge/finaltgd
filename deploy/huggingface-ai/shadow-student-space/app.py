"""TechGeo Shadow Student inference endpoint."""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


class InferRequest(BaseModel):
    context_id: str = Field(..., min_length=1, max_length=128)
    payload: dict[str, Any]


class InferResponse(BaseModel):
    context_id: str
    output: dict[str, Any]
    model_version: str


class HealthResponse(BaseModel):
    status: str


class VersionResponse(BaseModel):
    version: str
    base_model: str


MODEL_PATH = os.environ.get("MODEL_PATH", "/app/model")
MODEL_BASE = os.environ.get("MODEL_BASE", "unset")
MODEL_VERSION = os.environ.get("MODEL_VERSION", "0.0.0")


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model_ready = False
    app.state.model_version = MODEL_VERSION
    try:
        if os.path.isdir(MODEL_PATH) and os.listdir(MODEL_PATH):
            app.state.model_ready = True
    except OSError:
        app.state.model_ready = False
    yield


app = FastAPI(title="TechGeo Shadow Student", version=MODEL_VERSION, lifespan=lifespan)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/version", response_model=VersionResponse)
async def version() -> VersionResponse:
    return VersionResponse(version=app.state.model_version, base_model=MODEL_BASE)


@app.post("/infer", response_model=InferResponse)
async def infer(req: InferRequest) -> InferResponse:
    if not app.state.model_ready:
        raise HTTPException(status_code=503, detail="model not loaded")
    output = {"echo": req.payload, "note": "placeholder inference"}
    return InferResponse(
        context_id=req.context_id,
        output=output,
        model_version=app.state.model_version,
    )
