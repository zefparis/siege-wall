from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional, List
import os
import logging


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App
    APP_NAME: str = "HCS-U7 Siege Wall"
    DEBUG: bool = False  # ⚠️ SECURITY: False by default
    
    # HCS-U7 API
    HCS_API_URL: str = "http://localhost:9000"
    HCS_API_KEY: str = ""  # Required in production
    
    # CORS - Security
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
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
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30
    
    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_origins(cls, v):
        """Parse comma-separated origins string into list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
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
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
