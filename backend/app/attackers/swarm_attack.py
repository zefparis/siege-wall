import random
from .base import BaseAttacker
from ..models.attack import AttackPayload, AttackCategory


class SwarmAttacker(BaseAttacker):
    """Coordinated multi-agent attack simulation."""
    
    name = "Swarm Attack"
    category = AttackCategory.SWARM
    description = "Simulates coordinated attack from multiple agents"
    
    def __init__(self):
        super().__init__()
        self.swarm_size = 10
        self.agents = [self._create_agent(i) for i in range(self.swarm_size)]
        self.current_agent = 0
    
    def _create_agent(self, agent_id: int) -> dict:
        """Create a swarm agent with unique characteristics."""
        return {
            "id": agent_id,
            "strategy": random.choice(["aggressive", "cautious", "random"]),
            "base_pattern": [random.randint(1, 9) for _ in range(5)],
            "timing_profile": random.randint(80, 150),
        }
    
    async def generate_attack(self) -> AttackPayload:
        self.increment_attempt()
        
        # Select agent for this attack
        agent = self.agents[self.current_agent]
        self.current_agent = (self.current_agent + 1) % self.swarm_size
        
        # Generate attack based on agent's strategy
        if agent["strategy"] == "aggressive":
            pattern = [random.randint(0, 9) for _ in range(5)]
            timing_mult = 0.7
        elif agent["strategy"] == "cautious":
            pattern = agent["base_pattern"].copy()
            # Small mutations
            idx = random.randint(0, 4)
            pattern[idx] = (pattern[idx] + random.randint(-1, 1)) % 10
            timing_mult = 1.3
        else:  # random
            pattern = [random.randint(1, 9) for _ in range(5)]
            timing_mult = 1.0
        
        base_timing = agent["timing_profile"]
        
        cognitive_response = {
            "pattern_match": pattern,
            "sequence_completion": random.choice(["A", "B", "C", "D"]),
            "word_association": f"swarm_{agent['id']}",
            "image_selection": random.randint(1, 6),
            "reasoning_answer": random.choice(["yes", "no"]),
        }
        
        timing_data = {
            "keystroke_intervals": [
                int(base_timing * timing_mult + random.randint(-20, 20))
                for _ in range(10)
            ],
            "mouse_movements": self._generate_timing_data()["mouse_movements"],
            "response_delay_ms": int(random.randint(300, 1000) * timing_mult),
            "total_time_ms": int(random.randint(5000, 12000) * timing_mult),
        }
        
        return AttackPayload(
            session_id=self._create_session_id(),
            cognitive_response=cognitive_response,
            timing_data=timing_data,
            metadata={
                "attacker": self.name,
                "agent_id": agent["id"],
                "strategy": agent["strategy"],
                "swarm_size": self.swarm_size
            }
        )
    
    def learn_from_failure(self, result: dict):
        """Share learning across swarm agents."""
        # In a real implementation, agents would share information
        # about what doesn't work
        pass
