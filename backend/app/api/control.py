from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional

from ..services.siege_engine import get_siege_engine
from ..core.config import settings


async def verify_admin_key(x_admin_key: str = Header(None, alias="X-Admin-Key")):
    """Verify admin API key for protected endpoints."""
    if not settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Admin API key not configured on server"
        )
    if x_admin_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing admin API key"
        )
    return True


router = APIRouter(prefix="/api/control", tags=["control"])


class ControlResponse(BaseModel):
    success: bool
    message: str


class ConfigUpdate(BaseModel):
    attack_rate: Optional[int] = None


class VerifyRequest(BaseModel):
    payload: str = "Test Payload"


@router.post("/verify", response_model=ControlResponse)
async def verify_defense(request: VerifyRequest):
    """Trigger a manual verification attack."""
    engine = get_siege_engine()
    
    # Allow verification even if engine is stopped (it will init client on demand)
    result = await engine.verify_manual_attack(request.payload)
    
    if result:
        return ControlResponse(success=True, message=f"Verification attack sent. ID: {result.id}")
    else:
        return ControlResponse(success=False, message="Verification failed to send")


@router.post("/start", response_model=ControlResponse, dependencies=[Depends(verify_admin_key)])
async def start_siege():
    """Start the siege engine. Requires admin API key."""
    engine = get_siege_engine()
    
    if engine.running:
        return ControlResponse(success=False, message="Siege engine already running")
    
    await engine.start()
    return ControlResponse(success=True, message="Siege engine started")


@router.post("/stop", response_model=ControlResponse, dependencies=[Depends(verify_admin_key)])
async def stop_siege():
    """Stop the siege engine. Requires admin API key."""
    engine = get_siege_engine()
    
    if not engine.running:
        return ControlResponse(success=False, message="Siege engine not running")
    
    await engine.stop()
    return ControlResponse(success=True, message="Siege engine stopped")


@router.post("/reset", response_model=ControlResponse, dependencies=[Depends(verify_admin_key)])
async def reset_stats():
    """Reset siege statistics. Requires admin API key."""
    engine = get_siege_engine()
    
    if engine.running:
        raise HTTPException(
            status_code=400,
            detail="Cannot reset while siege engine is running"
        )
    
    # Reset stats
    engine.stats.total_attacks = 0
    engine.stats.uptime_seconds = 0
    engine.stats.attacks_per_second = 0
    engine._attack_count = 0
    
    # Reset attacker stats
    for stat in engine.attacker_stats.values():
        stat.total_attempts = 0
        stat.last_attempt = None
    
    return ControlResponse(success=True, message="Statistics reset")


@router.get("/status")
async def get_status():
    """Get siege engine status."""
    engine = get_siege_engine()
    return {
        "running": engine.running,
        "total_attackers": len(engine.attackers),
        "total_attacks": engine.stats.total_attacks,
        "uptime_seconds": engine.stats.uptime_seconds,
    }
