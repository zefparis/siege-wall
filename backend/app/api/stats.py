from fastapi import APIRouter
from typing import List

from ..models.stats import SiegeStats, AttackerStats
from ..services.siege_engine import get_siege_engine

router = APIRouter(prefix="/api", tags=["stats"])


@router.get("/stats", response_model=SiegeStats)
async def get_stats():
    """Get current siege statistics."""
    engine = get_siege_engine()
    return engine.get_stats()


@router.get("/attackers", response_model=List[AttackerStats])
async def get_attackers():
    """Get statistics for all attacker types."""
    engine = get_siege_engine()
    return engine.get_attacker_stats()


@router.get("/health")
async def health_check():
    """
    Health check endpoint with detailed status.
    Returns 200 if healthy, 503 if degraded.
    """
    from datetime import datetime
    from fastapi.responses import JSONResponse
    
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "1.0.0",
        "services": {}
    }
    
    # Check Siege Engine
    try:
        engine = get_siege_engine()
        health_status["services"]["siege_engine"] = {
            "status": "healthy",
            "running": engine.running,
            "total_attacks": engine.stats.total_attacks,
            "uptime_seconds": engine.stats.uptime_seconds
        }
    except Exception as e:
        health_status["services"]["siege_engine"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_status["status"] = "degraded"
    
    # Determine HTTP status code
    status_code = 200 if health_status["status"] == "healthy" else 503
    
    return JSONResponse(content=health_status, status_code=status_code)
