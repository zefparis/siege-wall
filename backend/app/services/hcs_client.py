import httpx
import random
import asyncio
from typing import Optional
from datetime import datetime

from ..models.attack import AttackPayload, AuthResult
from ..core.config import settings


class HCSClient:
    """Client for HCS-U7 authentication API."""
    
    def __init__(self, base_url: str = None, api_key: str = None):
        self.base_url = base_url or settings.HCS_API_URL
        self.api_key = api_key or settings.HCS_API_KEY
        self._client: Optional[httpx.AsyncClient] = None
    
    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=30.0
            )
        return self._client
    
    async def authenticate(self, payload: AttackPayload) -> AuthResult:
        """
        Send authentication attempt to HCS-U7.
        
        Returns:
            AuthResult with success=False for bot attacks
        """
        client = await self._get_client()
        
        start_time = datetime.utcnow()
        
        try:
            response = await client.post(
                "/api/v1/authenticate",
                json=payload.model_dump()
            )
            response_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            
            if response.status_code == 200:
                data = response.json()
                return AuthResult(
                    success=data.get("success", False),
                    confidence_score=data.get("confidence_score", 0.0),
                    response_time_ms=int(response_time),
                    rejection_reason=data.get("rejection_reason")
                )
            else:
                return AuthResult(
                    success=False,
                    confidence_score=0.0,
                    response_time_ms=int(response_time),
                    rejection_reason=f"HTTP {response.status_code}"
                )
        except Exception as e:
            response_time = (datetime.utcnow() - start_time).total_seconds() * 1000
            return AuthResult(
                success=False,
                confidence_score=0.0,
                response_time_ms=int(response_time),
                rejection_reason=str(e)
            )
    
    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None


class MockHCSClient(HCSClient):
    """
    Mock HCS client for demonstration purposes.
    Always returns rejection with realistic-looking scores.
    """
    
    async def authenticate(self, payload: AttackPayload) -> AuthResult:
        """
        Simulate HCS-U7 authentication - always rejects bots.
        """
        # Simulate network latency
        await asyncio.sleep(random.uniform(0.01, 0.05))
        
        # Generate realistic-looking low confidence score for bots
        # Real humans would score 0.85-1.0, bots score 0.0-0.3
        confidence_score = random.uniform(0.02, 0.28)
        
        # Simulate response time
        response_time_ms = random.randint(15, 45)
        
        # Various rejection reasons
        rejection_reasons = [
            "Cognitive pattern mismatch",
            "Timing anomaly detected",
            "Response entropy too low",
            "Pattern recognition failed",
            "Behavioral signature invalid",
            "Neural fingerprint mismatch",
            "Temporal coherence failure",
            "Semantic drift detected",
        ]
        
        return AuthResult(
            success=False,  # ALWAYS false for bot attacks
            confidence_score=confidence_score,
            response_time_ms=response_time_ms,
            rejection_reason=random.choice(rejection_reasons)
        )


def get_hcs_client() -> HCSClient:
    """Factory function to get appropriate HCS client."""
    if settings.MOCK_MODE:
        return MockHCSClient()
    return HCSClient()
