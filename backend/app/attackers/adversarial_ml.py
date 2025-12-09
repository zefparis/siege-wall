import random
import math
from .base import BaseAttacker
from ..models.attack import AttackPayload, AttackCategory


class GradientAttacker(BaseAttacker):
    """Uses gradient-based optimization to find adversarial inputs."""
    
    name = "Gradient Attack"
    category = AttackCategory.ADVERSARIAL
    description = "Uses gradient descent to optimize inputs against the classifier"
    
    def __init__(self):
        super().__init__()
        self.current_input = [5, 5, 5, 5, 5]  # Starting point
        self.learning_rate = 0.1
        self.best_score = 0.0
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Simulate gradient descent step
        # In reality, this would compute gradients from model feedback
        gradient = [random.uniform(-1, 1) for _ in range(5)]
        
        # Update input based on "gradient"
        self.current_input = [
            max(0, min(9, int(x - self.learning_rate * g)))
            for x, g in zip(self.current_input, gradient)
        ]
        
        cognitive_response = {
            "pattern_match": self.current_input,
            "sequence_completion": random.choice(["A", "B", "C", "D"]),
            "word_association": "optimized",
            "image_selection": random.randint(1, 6),
            "reasoning_answer": random.choice(["yes", "no"]),
        }
        
        timing_data = {
            "keystroke_intervals": [random.randint(80, 120) for _ in range(10)],
            "mouse_movements": self._generate_timing_data()["mouse_movements"],
            "response_delay_ms": random.randint(100, 500),
            "total_time_ms": random.randint(2000, 5000),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={
                "attacker": self.name,
                "iteration": self.attempt_count,
                "learning_rate": self.learning_rate
            }
        )
    
    def learn_from_failure(self, result: dict):
        """Adjust learning rate based on feedback."""
        score = result.get("confidence_score", 0)
        if score > self.best_score:
            self.best_score = score
            self.learning_rate *= 0.9  # Slow down near optimum
        else:
            self.learning_rate *= 1.1  # Speed up if not improving
        self.learning_rate = max(0.01, min(1.0, self.learning_rate))


class BoundaryProber(BaseAttacker):
    """Explores decision boundaries of the classifier."""
    
    name = "Boundary Probe"
    category = AttackCategory.ADVERSARIAL
    description = "Systematically probes the decision boundary of the classifier"
    
    def __init__(self):
        super().__init__()
        self.probe_dimension = 0
        self.probe_value = 0
        self.probe_direction = 1
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Systematically probe each dimension
        base_pattern = [5, 5, 5, 5, 5]
        base_pattern[self.probe_dimension] = self.probe_value
        
        # Move probe
        self.probe_value += self.probe_direction
        if self.probe_value > 9:
            self.probe_value = 9
            self.probe_direction = -1
        elif self.probe_value < 0:
            self.probe_value = 0
            self.probe_direction = 1
            self.probe_dimension = (self.probe_dimension + 1) % 5
        
        cognitive_response = {
            "pattern_match": base_pattern,
            "sequence_completion": random.choice(["A", "B", "C", "D"]),
            "word_association": "boundary",
            "image_selection": random.randint(1, 6),
            "reasoning_answer": random.choice(["yes", "no"]),
        }
        
        timing_data = {
            "keystroke_intervals": [random.randint(90, 110) for _ in range(10)],
            "mouse_movements": self._generate_timing_data()["mouse_movements"],
            "response_delay_ms": random.randint(200, 600),
            "total_time_ms": random.randint(3000, 6000),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={
                "attacker": self.name,
                "probe_dim": self.probe_dimension,
                "probe_val": self.probe_value
            }
        )
