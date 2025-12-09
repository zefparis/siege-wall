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
    """Health check endpoint."""
    engine = get_siege_engine()
    return {
        "status": "healthy",
        "running": engine.running,
        "total_attacks": engine.stats.total_attacks,
    }
