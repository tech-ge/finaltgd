"""TechGeo Speech Analytics endpoint."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel


class AnalyzeResponse(BaseModel):
    label: str
    confidence: float


class HealthResponse(BaseModel):
    status: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model_ready = True
    yield


app = FastAPI(title="TechGeo Speech Analytics", version="0.1.0", lifespan=lifespan)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(segment: UploadFile = File(...)) -> AnalyzeResponse:
    if not segment.filename:
        raise HTTPException(status_code=400, detail="segment file required")
    await segment.read()
    return AnalyzeResponse(label="normal", confidence=0.0)
