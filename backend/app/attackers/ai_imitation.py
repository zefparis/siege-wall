import random
from .base import BaseAttacker
from ..models.attack import AttackPayload, AttackCategory


class GPT4Simulator(BaseAttacker):
    """Simulates GPT-4 attempting to pass cognitive tests."""
    
    name = "GPT-4 Turbo"
    category = AttackCategory.AI_IMITATION
    description = "Uses GPT-4-like reasoning to generate human-like responses"
    
    # Simulated GPT-4 response patterns (in real implementation, would call OpenAI API)
    REASONING_PATTERNS = [
        "Based on the pattern, the next element should be...",
        "Analyzing the sequence logically...",
        "The relationship between elements suggests...",
        "Following the established pattern...",
    ]
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Simulate GPT-4 "reasoning" about cognitive tests
        # In reality, this would call the OpenAI API
        cognitive_response = {
            "pattern_match": self._gpt4_pattern_analysis(),
            "sequence_completion": self._gpt4_sequence_reasoning(),
            "word_association": self._gpt4_word_association(),
            "image_selection": random.randint(1, 6),
            "reasoning_answer": self._gpt4_reasoning(),
        }
        
        # GPT-4 tends to respond quickly and consistently
        timing_data = {
            "keystroke_intervals": [random.randint(80, 120) for _ in range(10)],
            "mouse_movements": self._generate_timing_data()["mouse_movements"],
            "response_delay_ms": random.randint(200, 800),  # Fast responses
            "total_time_ms": random.randint(3000, 8000),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={"attacker": self.name, "model": "gpt-4-turbo"}
        )
    
    def _gpt4_pattern_analysis(self) -> list:
        """Simulate GPT-4 analyzing number patterns."""
        # GPT-4 would try to find mathematical relationships
        patterns = [
            [2, 4, 6, 8, 10],  # Arithmetic
            [1, 2, 4, 8, 16],  # Geometric
            [1, 1, 2, 3, 5],   # Fibonacci
            [1, 4, 9, 16, 25], # Squares
        ]
        return random.choice(patterns)
    
    def _gpt4_sequence_reasoning(self) -> str:
        """Simulate GPT-4 reasoning about sequences."""
        return random.choice(["A", "B", "C", "D"])
    
    def _gpt4_word_association(self) -> str:
        """Simulate GPT-4 word associations."""
        associations = ["logical", "systematic", "analytical", "coherent", "structured"]
        return random.choice(associations)
    
    def _gpt4_reasoning(self) -> str:
        """Simulate GPT-4 reasoning responses."""
        return random.choice(["yes", "no", "uncertain"])


class ClaudeSimulator(BaseAttacker):
    """Simulates Claude attempting to pass cognitive tests."""
    
    name = "Claude 3.5 Sonnet"
    category = AttackCategory.AI_IMITATION
    description = "Uses Claude-like reasoning patterns"
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Claude tends to be more verbose and careful
        cognitive_response = {
            "pattern_match": [random.randint(1, 9) for _ in range(5)],
            "sequence_completion": random.choice(["A", "B", "C", "D"]),
            "word_association": random.choice(["thoughtful", "careful", "nuanced", "considered"]),
            "image_selection": random.randint(1, 6),
            "reasoning_answer": random.choice(["yes", "no"]),
        }
        
        # Claude might take slightly longer to "think"
        timing_data = {
            "keystroke_intervals": [random.randint(90, 140) for _ in range(12)],
            "mouse_movements": self._generate_timing_data()["mouse_movements"],
            "response_delay_ms": random.randint(300, 1200),
            "total_time_ms": random.randint(4000, 10000),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={"attacker": self.name, "model": "claude-3.5-sonnet"}
        )


class GeminiSimulator(BaseAttacker):
    """Simulates Google Gemini attempting to pass cognitive tests."""
    
    name = "Gemini Ultra"
    category = AttackCategory.AI_IMITATION
    description = "Uses Gemini-like multimodal reasoning"
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        cognitive_response = {
            "pattern_match": [random.randint(1, 9) for _ in range(5)],
            "sequence_completion": random.choice(["A", "B", "C", "D"]),
            "word_association": random.choice(["multimodal", "integrated", "comprehensive"]),
            "image_selection": random.randint(1, 6),
            "reasoning_answer": random.choice(["yes", "no"]),
        }
        
        timing_data = {
            "keystroke_intervals": [random.randint(70, 130) for _ in range(10)],
            "mouse_movements": self._generate_timing_data()["mouse_movements"],
            "response_delay_ms": random.randint(250, 900),
            "total_time_ms": random.randint(3500, 9000),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={"attacker": self.name, "model": "gemini-ultra"}
        )
