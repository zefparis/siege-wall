from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..services.siege_engine import get_siege_engine

router = APIRouter(prefix="/api/control", tags=["control"])


class ControlResponse(BaseModel):
    success: bool
    message: str


class ConfigUpdate(BaseModel):
    attack_rate: Optional[int] = None


@router.post("/start", response_model=ControlResponse)
async def start_siege():
    """Start the siege engine."""
    engine = get_siege_engine()
    
    if engine.running:
        return ControlResponse(success=False, message="Siege engine already running")
    
    await engine.start()
    return ControlResponse(success=True, message="Siege engine started")


@router.post("/stop", response_model=ControlResponse)
async def stop_siege():
    """Stop the siege engine."""
    engine = get_siege_engine()
    
    if not engine.running:
        return ControlResponse(success=False, message="Siege engine not running")
    
    await engine.stop()
    return ControlResponse(success=True, message="Siege engine stopped")


@router.post("/reset", response_model=ControlResponse)
async def reset_stats():
    """Reset siege statistics (requires engine to be stopped)."""
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
