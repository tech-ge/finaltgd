"""TechGeo Voice Clone enrollment and synthesis endpoint."""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel, Field


class SynthesizeRequest(BaseModel):
    account_id: str = Field(..., min_length=1, max_length=128)
    text: str = Field(..., min_length=1, max_length=2000)


class SynthesizeResponse(BaseModel):
    account_id: str
    audio_url: str


class HealthResponse(BaseModel):
    status: str


VOICE_VAULT_PATH = os.environ.get("VOICE_VAULT_PATH", "/app/voices")


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(VOICE_VAULT_PATH, exist_ok=True)
    yield


app = FastAPI(title="TechGeo Voice Clone", version="0.1.0", lifespan=lifespan)


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/enroll")
async def enroll(account_id: str, sample: UploadFile = File(...)) -> dict[str, str]:
    if not account_id:
        raise HTTPException(status_code=400, detail="account_id required")
    account_dir = os.path.join(VOICE_VAULT_PATH, account_id)
    os.makedirs(account_dir, exist_ok=True)
    target = os.path.join(account_dir, "sample.wav")
    content = await sample.read()
    with open(target, "wb") as fh:
        fh.write(content)
    return {"account_id": account_id, "status": "enrolled"}


@app.post("/synthesize", response_model=SynthesizeResponse)
async def synthesize(req: SynthesizeRequest) -> SynthesizeResponse:
    account_dir = os.path.join(VOICE_VAULT_PATH, req.account_id)
    if not os.path.isdir(account_dir):
        raise HTTPException(status_code=404, detail="voice not enrolled")
    return SynthesizeResponse(
        account_id=req.account_id,
        audio_url=f"/static/{req.account_id}/output.wav",
    )
