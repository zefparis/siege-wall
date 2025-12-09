import random
import string
from .base import BaseAttacker
from ..models.attack import AttackPayload, AttackCategory


class BruteForceAttacker(BaseAttacker):
    """Random responses to cognitive tests."""
    
    name = "Brute Force"
    category = AttackCategory.BRUTE_FORCE
    description = "Generates random responses hoping to match valid patterns"
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Generate completely random cognitive response
        cognitive_response = {
            "pattern_match": [random.randint(0, 9) for _ in range(5)],
            "sequence_completion": random.choice(["A", "B", "C", "D"]),
            "word_association": ''.join(random.choices(string.ascii_lowercase, k=8)),
            "image_selection": random.randint(1, 6),
            "reasoning_answer": random.choice(["yes", "no", "maybe"]),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=self._generate_timing_data(),
            metadata={"attacker": self.name, "attempt": self.attempt_count}
        )


class DictionaryAttacker(BaseAttacker):
    """Pre-computed response patterns from a dictionary."""
    
    name = "Dictionary Attack"
    category = AttackCategory.BRUTE_FORCE
    description = "Uses pre-computed response patterns from known valid sessions"
    
    # Simulated dictionary of "known" patterns
    PATTERN_DICTIONARY = [
        {"pattern_match": [1, 2, 3, 4, 5], "sequence": "A"},
        {"pattern_match": [2, 4, 6, 8, 10], "sequence": "B"},
        {"pattern_match": [1, 1, 2, 3, 5], "sequence": "C"},
        {"pattern_match": [3, 6, 9, 12, 15], "sequence": "D"},
        {"pattern_match": [5, 4, 3, 2, 1], "sequence": "A"},
    ]
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Pick a pattern from dictionary
        pattern = random.choice(self.PATTERN_DICTIONARY)
        
        cognitive_response = {
            "pattern_match": pattern["pattern_match"],
            "sequence_completion": pattern["sequence"],
            "word_association": random.choice(["apple", "banana", "cherry", "date"]),
            "image_selection": random.randint(1, 6),
            "reasoning_answer": random.choice(["yes", "no"]),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=self._generate_timing_data(),
            metadata={"attacker": self.name, "attempt": self.attempt_count}
        )
