import random
from .base import BaseAttacker
from ..models.attack import AttackPayload, AttackCategory


class SessionReplayAttacker(BaseAttacker):
    """Replays captured valid sessions."""
    
    name = "Session Replay"
    category = AttackCategory.REPLAY
    description = "Attempts to replay captured valid authentication sessions"
    
    # Simulated captured sessions (in reality would be from interception)
    CAPTURED_SESSIONS = [
        {
            "cognitive": {"pattern_match": [3, 6, 9, 12, 15], "sequence": "C"},
            "timing": {"avg_interval": 130, "total_time": 12000}
        },
        {
            "cognitive": {"pattern_match": [2, 4, 8, 16, 32], "sequence": "B"},
            "timing": {"avg_interval": 145, "total_time": 15000}
        },
        {
            "cognitive": {"pattern_match": [1, 3, 5, 7, 9], "sequence": "A"},
            "timing": {"avg_interval": 110, "total_time": 9000}
        },
    ]
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Replay a captured session
        session = random.choice(self.CAPTURED_SESSIONS)
        
        cognitive_response = {
            "pattern_match": session["cognitive"]["pattern_match"],
            "sequence_completion": session["cognitive"]["sequence"],
            "word_association": "replayed",
            "image_selection": random.randint(1, 6),
            "reasoning_answer": "yes",
        }
        
        # Replay timing with slight variations
        avg = session["timing"]["avg_interval"]
        timing_data = {
            "keystroke_intervals": [avg + random.randint(-10, 10) for _ in range(10)],
            "mouse_movements": self._generate_timing_data()["mouse_movements"],
            "response_delay_ms": random.randint(500, 1500),
            "total_time_ms": session["timing"]["total_time"] + random.randint(-500, 500),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={"attacker": self.name, "replayed_session": True}
        )


class MosaicAttacker(BaseAttacker):
    """Combines fragments from multiple sessions."""
    
    name = "Mosaic Attack"
    category = AttackCategory.REPLAY
    description = "Combines fragments from multiple valid sessions"
    
    # Fragments from different sessions
    PATTERN_FRAGMENTS = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [2, 4, 6], [3, 6, 9], [1, 3, 5],
    ]
    
    TIMING_FRAGMENTS = [
        [100, 110, 105], [120, 115, 125], [90, 95, 88],
    ]
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Combine fragments from different sources
        pattern_part1 = random.choice(self.PATTERN_FRAGMENTS)[:2]
        pattern_part2 = random.choice(self.PATTERN_FRAGMENTS)[1:]
        combined_pattern = pattern_part1 + pattern_part2
        
        timing_part1 = random.choice(self.TIMING_FRAGMENTS)
        timing_part2 = random.choice(self.TIMING_FRAGMENTS)
        combined_timing = timing_part1 + timing_part2
        
        cognitive_response = {
            "pattern_match": combined_pattern,
            "sequence_completion": random.choice(["A", "B", "C", "D"]),
            "word_association": "mosaic",
            "image_selection": random.randint(1, 6),
            "reasoning_answer": random.choice(["yes", "no"]),
        }
        
        timing_data = {
            "keystroke_intervals": combined_timing + [random.randint(90, 130) for _ in range(4)],
            "mouse_movements": self._generate_timing_data()["mouse_movements"],
            "response_delay_ms": random.randint(600, 1800),
            "total_time_ms": sum(combined_timing) * 10 + random.randint(5000, 10000),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={"attacker": self.name, "fragments_used": 2}
        )
