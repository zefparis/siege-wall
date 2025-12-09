from enum import Enum
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AttackCategory(str, Enum):
    BRUTE_FORCE = "BRUTE_FORCE"
    AI_IMITATION = "AI_IMITATION"
    TIMING = "TIMING"
    REPLAY = "REPLAY"
    NETWORK = "NETWORK"
    CRYPTO = "CRYPTO"
    ADVERSARIAL = "ADVERSARIAL"
    SWARM = "SWARM"


class AttackStatus(str, Enum):
    REJECTED = "REJECTED"
    PENDING = "PENDING"


class Attack(BaseModel):
    """Represents a single attack attempt."""
    
    id: str
    timestamp: datetime
    type: str
    category: AttackCategory
    attacker_id: str
    attacker_name: str
    attempt_number: int
    confidence_score: float  # 0-1, low = bot detected
    response_time_ms: int
    status: AttackStatus
    origin_country: str
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class AttackPayload(BaseModel):
    """Payload sent to HCS-U7 for authentication."""
    
    session_id: str
    cognitive_response: dict
    timing_data: dict
    metadata: Optional[dict] = None


class AuthResult(BaseModel):
    """Result from HCS-U7 authentication."""
    
    success: bool
    confidence_score: float
    response_time_ms: int
    rejection_reason: Optional[str] = None
