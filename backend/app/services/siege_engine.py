import asyncio
import random
import uuid
from datetime import datetime
from typing import List, Optional, Callable

from ..models.attack import Attack, AttackCategory, AttackStatus
from ..models.stats import SiegeStats, AttackerStats
from ..attackers import ATTACKER_REGISTRY, BaseAttacker
from ..services.hcs_client import get_hcs_client, HCSClient
from ..core.config import settings


COUNTRIES = [
    'US', 'CN', 'RU', 'DE', 'GB', 'FR', 'JP', 'KR', 'BR', 'IN',
    'AU', 'CA', 'NL', 'SG', 'SE', 'CH', 'IL', 'AE', 'HK', 'TW',
]


class SiegeEngine:
    """
    Main orchestrator for the siege wall.
    Continuously attacks HCS-U7 and broadcasts results.
    """
    
    def __init__(self):
        self.attackers: List[BaseAttacker] = ATTACKER_REGISTRY.copy()
        self.hcs_client: Optional[HCSClient] = None
        self.running = False
        self.stats = SiegeStats(
            total_vectors=len(self.attackers),
            active_vectors=len(self.attackers),
            start_time=datetime.utcnow()
        )
        self.attacker_stats: dict[str, AttackerStats] = {}
        self._broadcast_callback: Optional[Callable] = None
        self._attack_count = 0
        self._last_rate_check = datetime.utcnow()
        self._attacks_since_check = 0
        
        # Initialize attacker stats
        for attacker in self.attackers:
            self.attacker_stats[attacker.name] = AttackerStats(
                id=attacker.name.lower().replace(' ', '_'),
                name=attacker.name,
                category=attacker.category.value,
            )
    
    def set_broadcast_callback(self, callback: Callable):
        """Set callback for broadcasting attacks to WebSocket clients."""
        self._broadcast_callback = callback
    
    async def start(self):
        """Start the siege engine."""
        if self.running:
            return
        
        self.running = True
        self.hcs_client = get_hcs_client()
        self.stats.start_time = datetime.utcnow()
        
        print(f"[SiegeEngine] Starting with {len(self.attackers)} attackers")
        
        # Start attack loop
        asyncio.create_task(self._attack_loop())
        asyncio.create_task(self._stats_broadcast_loop())
    
    async def stop(self):
        """Stop the siege engine."""
        self.running = False
        if self.hcs_client:
            await self.hcs_client.close()
            self.hcs_client = None
        print("[SiegeEngine] Stopped")
    
    async def _attack_loop(self):
        """Main attack loop - runs continuously."""
        while self.running:
            try:
                # Select attacker (weighted random)
                attacker = self._select_attacker()
                
                # Generate and execute attack
                attack = await self._execute_attack(attacker)
                
                # Broadcast to clients
                if self._broadcast_callback and attack:
                    await self._broadcast_callback({
                        "type": "attack",
                        "data": attack.model_dump(mode='json')
                    })
                
                # Rate limiting
                delay = 1.0 / settings.ATTACK_RATE_PER_SECOND
                await asyncio.sleep(delay)
                
            except Exception as e:
                print(f"[SiegeEngine] Attack error: {e}")
                await asyncio.sleep(1)
    
    async def _stats_broadcast_loop(self):
        """Broadcast stats periodically."""
        while self.running:
            try:
                # Update uptime
                self.stats.uptime_seconds = int(
                    (datetime.utcnow() - self.stats.start_time).total_seconds()
                )
                
                # Calculate attack rate
                now = datetime.utcnow()
                elapsed = (now - self._last_rate_check).total_seconds()
                if elapsed >= 1.0:
                    self.stats.attacks_per_second = self._attacks_since_check / elapsed
                    self._attacks_since_check = 0
                    self._last_rate_check = now
                
                # Broadcast stats
                if self._broadcast_callback:
                    await self._broadcast_callback({
                        "type": "stats",
                        "data": self.stats.model_dump(mode='json')
                    })
                
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"[SiegeEngine] Stats broadcast error: {e}")
                await asyncio.sleep(1)
    
    def _select_attacker(self) -> BaseAttacker:
        """Select an attacker with weighted random selection."""
        # Weight by category for variety
        weights = {
            AttackCategory.AI_IMITATION: 3,
            AttackCategory.BRUTE_FORCE: 2,
            AttackCategory.TIMING: 2,
            AttackCategory.ADVERSARIAL: 2,
            AttackCategory.REPLAY: 1,
            AttackCategory.SWARM: 1,
            AttackCategory.NETWORK: 1,
            AttackCategory.CRYPTO: 1,
        }
        
        weighted_attackers = []
        for attacker in self.attackers:
            weight = weights.get(attacker.category, 1)
            weighted_attackers.extend([attacker] * weight)
        
        return random.choice(weighted_attackers)
    
    async def _execute_attack(self, attacker: BaseAttacker) -> Optional[Attack]:
        """Execute a single attack and record results."""
        try:
            # Generate attack payload
            payload = await attacker.generate_attack()
            
            # Send to HCS-U7
            result = await self.hcs_client.authenticate(payload)
            
            # Update stats
            self._attack_count += 1
            self._attacks_since_check += 1
            self.stats.total_attacks = self._attack_count
            
            # Update attacker stats
            attacker_stat = self.attacker_stats.get(attacker.name)
            if attacker_stat:
                attacker_stat.total_attempts += 1
                attacker_stat.last_attempt = datetime.utcnow()
            
            # Let attacker learn from failure
            attacker.learn_from_failure({
                "confidence_score": result.confidence_score,
                "rejection_reason": result.rejection_reason,
            })
            
            # Create attack record
            attack = Attack(
                id=f"att_{uuid.uuid4().hex[:8]}",
                timestamp=datetime.utcnow(),
                type=attacker.name,
                category=attacker.category,
                attacker_id=attacker.name.lower().replace(' ', '_'),
                attacker_name=attacker.name,
                attempt_number=self._attack_count,
                confidence_score=result.confidence_score,
                response_time_ms=result.response_time_ms,
                status=AttackStatus.REJECTED,  # Always rejected for bots
                origin_country=random.choice(COUNTRIES),
            )
            
            return attack
            
        except Exception as e:
            print(f"[SiegeEngine] Attack execution error: {e}")
            return None
    
    async def verify_manual_attack(self, payload: str) -> Optional[Attack]:
        """Execute a manual verification attack."""
        if not self.hcs_client:
            self.hcs_client = get_hcs_client()

        try:
             # Construct a simple payload for manual verification
            from ..models.attack import AttackPayload
            attack_payload = AttackPayload(
                ip_address="127.0.0.1", # Origin of the verifier
                user_agent="Manual Verification Agent",
                request_headers={"X-Verify": "true"},
                payload=payload,
                timestamp=datetime.utcnow()
            )
            
            # Send to HCS-U7
            result = await self.hcs_client.authenticate(attack_payload)
            
            # Update stats
            self._attack_count += 1
            self.stats.total_attacks = self._attack_count
            
            # Create attack record for manual verification
            attack = Attack(
                id=f"verify_{uuid.uuid4().hex[:8]}",
                timestamp=datetime.utcnow(),
                type="Manual Verification",
                category=AttackCategory.ADVERSARIAL, # Manual attempts are adversarial
                attacker_id="manual_verifier",
                attacker_name="Live Verifier",
                attempt_number=self._attack_count,
                confidence_score=result.confidence_score,
                response_time_ms=result.response_time_ms,
                status=AttackStatus.REJECTED,
                origin_country="US", # Default for verifier
            )
            
             # Broadcast to clients so they see their own attempt
            if self._broadcast_callback:
                await self._broadcast_callback({
                    "type": "attack",
                    "data": attack.model_dump(mode='json')
                })
            
            return attack
            
        except Exception as e:
            print(f"[SiegeEngine] Manual verification error: {e}")
            return None

    def get_stats(self) -> SiegeStats:
        """Get current statistics."""
        return self.stats
    
    def get_attacker_stats(self) -> List[AttackerStats]:
        """Get statistics for all attackers."""
        return list(self.attacker_stats.values())


# Global singleton
_siege_engine: Optional[SiegeEngine] = None


def get_siege_engine() -> SiegeEngine:
    """Get or create the siege engine singleton."""
    global _siege_engine
    if _siege_engine is None:
        _siege_engine = SiegeEngine()
    return _siege_engine
