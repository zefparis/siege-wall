from abc import ABC, abstractmethod
from typing import Optional
import uuid
import random

from ..models.attack import AttackPayload, AttackCategory


class BaseAttacker(ABC):
    """Base class for all attacker types."""
    
    name: str = "Base Attacker"
    category: AttackCategory = AttackCategory.BRUTE_FORCE
    description: str = "Base attacker class"
    
    def __init__(self):
        self.attempt_count = 0
    
    @abstractmethod
    async def generate_attack(self) -> AttackPayload:
        """
        Generate a single attack attempt.
        
        Returns:
            AttackPayload to send to HCS-U7
        """
        pass
    
    def learn_from_failure(self, result: dict):
        """
        Optional: Adapt strategy based on failures.
        Override in subclasses for adaptive attackers.
        """
        pass
    
    def _create_session_id(self) -> str:
        """Generate a unique session ID for the attack."""
        return f"attack_{uuid.uuid4().hex[:12]}"
    
    def _generate_timing_data(self) -> dict:
        """Generate fake timing data for the attack."""
        return {
            "keystroke_intervals": [random.randint(50, 200) for _ in range(10)],
            "mouse_movements": [
                {"x": random.randint(0, 1920), "y": random.randint(0, 1080), "t": i * 100}
                for i in range(5)
            ],
            "response_delay_ms": random.randint(500, 3000),
            "total_time_ms": random.randint(5000, 30000),
        }
    
    def increment_attempt(self) -> int:
        """Increment and return the attempt count."""
        self.attempt_count += 1
        return self.attempt_count
