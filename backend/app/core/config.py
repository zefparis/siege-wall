from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App
    APP_NAME: str = "HCS-U7 Siege Wall"
    DEBUG: bool = True
    
    # HCS-U7 API
    HCS_API_URL: str = "http://localhost:9000"
    HCS_API_KEY: str = ""
    
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
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
