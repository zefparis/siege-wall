from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Optional, List, Union
import os
import logging
import json


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )
    
    # App
    APP_NAME: str = "HCS-U7 Siege Wall"
    DEBUG: bool = False  # ⚠️ SECURITY: False by default
    
    # HCS-U7 API
    HCS_API_URL: str = "http://localhost:9000"
    HCS_API_KEY: str = ""  # Required in production
    
    # CORS - Security (accepts comma-separated string or JSON array)
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # AI APIs (optional - for real AI attackers)
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/siege"
    
    # Siege Engine
    ATTACK_RATE_PER_SECOND: int = 10  # Attacks per second
    MOCK_MODE: bool = True  # Use mock HCS client for demo
    
    # Admin Control
    ADMIN_API_KEY: str = ""  # Required for /api/control/* endpoints
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30
    
    def get_allowed_origins(self) -> List[str]:
        """Parse ALLOWED_ORIGINS as comma-separated string or JSON array."""
        if not self.ALLOWED_ORIGINS:
            return []
        # Try JSON first
        try:
            parsed = json.loads(self.ALLOWED_ORIGINS)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass
        # Fall back to comma-separated
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
    
    def model_post_init(self, __context) -> None:
        """Post-initialization validation and warnings."""
        # Warn if DEBUG is enabled
        if self.DEBUG:
            logging.warning(
                "⚠️  DEBUG mode is ENABLED. "
                "This should NEVER be used in production!"
            )
        
        # Warn if API key is empty in non-mock mode
        if not self.MOCK_MODE and not self.HCS_API_KEY:
            logging.warning(
                "⚠️  HCS_API_KEY is empty but MOCK_MODE is disabled. "
                "API calls will fail!"
            )
    


settings = Settings()
