"""
Pytest configuration and fixtures for HCS-U7 Siege Wall Backend
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

# Patch settings before importing app
@pytest.fixture(autouse=True)
def mock_settings():
    """Mock settings for all tests."""
    with patch("app.core.config.settings") as mock:
        mock.APP_NAME = "HCS-U7 Siege Wall Test"
        mock.DEBUG = True
        mock.HCS_API_KEY = "test_key_12345"
        mock.HCS_API_URL = "http://test.example.com"
        mock.MOCK_MODE = True
        mock.REDIS_URL = "redis://localhost:6379/1"
        mock.ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]
        mock.ATTACK_RATE_PER_SECOND = 10
        mock.WS_HEARTBEAT_INTERVAL = 30
        yield mock


@pytest.fixture
def client(mock_settings):
    """Test client with mocked settings."""
    from app.main import app
    return TestClient(app)


@pytest.fixture
def mock_siege_engine():
    """Mock siege engine for testing."""
    engine = MagicMock()
    engine.start = AsyncMock()
    engine.stop = AsyncMock()
    engine.running = False
    engine.stats = MagicMock()
    engine.stats.total_attacks = 0
    engine.stats.blocked = 0
    engine.stats.success = 0
    engine.stats.uptime_seconds = 0
    engine.stats.attacks_per_second = 0.0
    engine.stats.total_vectors = 10
    engine.stats.active_vectors = 10
    engine.stats.model_dump = MagicMock(return_value={
        "total_attacks": 0,
        "blocked": 0,
        "success": 0,
        "uptime_seconds": 0,
        "attacks_per_second": 0.0,
    })
    engine.get_stats = MagicMock(return_value=engine.stats)
    engine.get_attacker_stats = MagicMock(return_value=[])
    engine.set_broadcast_callback = MagicMock()
    
    return engine


@pytest.fixture
def mock_hcs_client():
    """Mock HCS client for testing."""
    client = MagicMock()
    client.authenticate = AsyncMock(return_value=MagicMock(
        confidence_score=0.15,
        rejection_reason="Invalid signature",
        response_time_ms=45,
        is_human=False
    ))
    client.close = AsyncMock()
    return client
