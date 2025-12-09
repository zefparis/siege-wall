from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SiegeStats(BaseModel):
    """Overall siege statistics."""
    
    total_attacks: int = 0
    success_rate: float = 0.0
    uptime_seconds: int = 0
    attacks_per_second: float = 0.0
    active_vectors: int = 0
    total_vectors: int = 47
    breaches: int = 0
    start_time: datetime = datetime.utcnow()


class AttackerStats(BaseModel):
    """Statistics for a specific attacker type."""
    
    id: str
    name: str
    category: str
    total_attempts: int = 0
    success_rate: float = 0.0
    last_attempt: Optional[datetime] = None


class Milestone(BaseModel):
    """Milestone achievement."""
    
    value: int
    label: str
    reached: bool = False
    reached_at: Optional[datetime] = None
