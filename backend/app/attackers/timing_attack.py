import random
from .base import BaseAttacker
from ..models.attack import AttackPayload, AttackCategory


class TimingMimicAttacker(BaseAttacker):
    """Reproduces human timing patterns."""
    
    name = "Timing Mimic"
    category = AttackCategory.TIMING
    description = "Attempts to reproduce human-like timing patterns"
    
    # Simulated "human" timing profiles
    HUMAN_PROFILES = [
        {"avg_keystroke": 120, "variance": 30, "pause_freq": 0.1},
        {"avg_keystroke": 150, "variance": 40, "pause_freq": 0.15},
        {"avg_keystroke": 100, "variance": 25, "pause_freq": 0.08},
    ]
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Select a human profile to mimic
        profile = random.choice(self.HUMAN_PROFILES)
        
        # Generate timing data based on profile
        keystrokes = []
        for _ in range(20):
            interval = random.gauss(profile["avg_keystroke"], profile["variance"])
            if random.random() < profile["pause_freq"]:
                interval += random.randint(500, 2000)  # Thinking pause
            keystrokes.append(max(50, int(interval)))
        
        timing_data = {
            "keystroke_intervals": keystrokes,
            "mouse_movements": self._generate_human_mouse(),
            "response_delay_ms": random.randint(1000, 5000),
            "total_time_ms": sum(keystrokes) + random.randint(2000, 5000),
        }
        
        cognitive_response = {
            "pattern_match": [random.randint(1, 9) for _ in range(5)],
            "sequence_completion": random.choice(["A", "B", "C", "D"]),
            "word_association": "thinking",
            "image_selection": random.randint(1, 6),
            "reasoning_answer": "yes",
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={"attacker": self.name, "profile": profile}
        )
    
    def _generate_human_mouse(self) -> list:
        """Generate human-like mouse movements with curves."""
        movements = []
        x, y = 960, 540  # Start center
        for i in range(10):
            # Add some curve to movement
            dx = random.randint(-200, 200)
            dy = random.randint(-150, 150)
            x = max(0, min(1920, x + dx))
            y = max(0, min(1080, y + dy))
            movements.append({"x": x, "y": y, "t": i * random.randint(80, 150)})
        return movements


class JitterInjectionAttacker(BaseAttacker):
    """Adds natural-looking timing variations."""
    
    name = "Jitter Injection"
    category = AttackCategory.TIMING
    description = "Injects natural-looking jitter into timing patterns"
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Base timing with injected jitter
        base_interval = 100
        jitter_range = 50
        
        keystrokes = []
        for _ in range(15):
            # Add various types of jitter
            jitter = random.gauss(0, jitter_range)
            micro_jitter = random.uniform(-5, 5)
            interval = base_interval + jitter + micro_jitter
            keystrokes.append(max(30, int(interval)))
        
        timing_data = {
            "keystroke_intervals": keystrokes,
            "mouse_movements": self._generate_timing_data()["mouse_movements"],
            "response_delay_ms": random.randint(800, 3000),
            "total_time_ms": sum(keystrokes) + random.randint(1000, 3000),
        }
        
        cognitive_response = {
            "pattern_match": [random.randint(1, 9) for _ in range(5)],
            "sequence_completion": random.choice(["A", "B", "C", "D"]),
            "word_association": "natural",
            "image_selection": random.randint(1, 6),
            "reasoning_answer": random.choice(["yes", "no"]),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={"attacker": self.name, "jitter_range": jitter_range}
        )
