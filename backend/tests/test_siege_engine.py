"""
Tests for siege engine
"""
import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from datetime import datetime


class TestSiegeEngineInitialization:
    """Tests for siege engine initialization."""
    
    def test_siege_engine_creation(self, mock_settings):
        """Test siege engine can be created."""
        with patch("app.services.siege_engine.ATTACKER_REGISTRY", []):
            from app.services.siege_engine import SiegeEngine
            
            engine = SiegeEngine()
            assert engine.running is False
            assert engine.hcs_client is None
            assert engine.stats is not None
    
    def test_siege_engine_initial_stats(self, mock_settings):
        """Test siege engine has correct initial stats."""
        with patch("app.services.siege_engine.ATTACKER_REGISTRY", []):
            from app.services.siege_engine import SiegeEngine
            
            engine = SiegeEngine()
            stats = engine.get_stats()
            assert stats.total_attacks == 0


class TestSiegeEngineSingleton:
    """Tests for singleton pattern."""
    
    def test_singleton_returns_same_instance(self, mock_settings):
        """Test get_siege_engine returns same instance."""
        with patch("app.services.siege_engine.ATTACKER_REGISTRY", []):
            with patch("app.services.siege_engine._siege_engine", None):
                from app.services.siege_engine import get_siege_engine
                
                engine1 = get_siege_engine()
                engine2 = get_siege_engine()
                
                assert engine1 is engine2
    
    def test_singleton_thread_safe(self, mock_settings):
        """Test singleton is thread-safe."""
        import threading
        from app.services.siege_engine import _siege_engine_lock
        
        # Verify lock exists
        assert isinstance(_siege_engine_lock, type(threading.Lock()))


class TestSiegeEngineOperations:
    """Tests for siege engine operations."""
    
    @pytest.mark.asyncio
    async def test_start_sets_running(self, mock_settings, mock_hcs_client):
        """Test start sets running to True."""
        with patch("app.services.siege_engine.ATTACKER_REGISTRY", []):
            with patch("app.services.siege_engine.get_hcs_client", return_value=mock_hcs_client):
                from app.services.siege_engine import SiegeEngine
                
                engine = SiegeEngine()
                
                # Mock the async tasks
                with patch("asyncio.create_task"):
                    await engine.start()
                
                assert engine.running is True
    
    @pytest.mark.asyncio
    async def test_stop_sets_running_false(self, mock_settings, mock_hcs_client):
        """Test stop sets running to False."""
        with patch("app.services.siege_engine.ATTACKER_REGISTRY", []):
            with patch("app.services.siege_engine.get_hcs_client", return_value=mock_hcs_client):
                from app.services.siege_engine import SiegeEngine
                
                engine = SiegeEngine()
                engine.running = True
                engine.hcs_client = mock_hcs_client
                
                await engine.stop()
                
                assert engine.running is False
    
    @pytest.mark.asyncio
    async def test_start_when_already_running(self, mock_settings, mock_hcs_client):
        """Test start does nothing when already running."""
        with patch("app.services.siege_engine.ATTACKER_REGISTRY", []):
            from app.services.siege_engine import SiegeEngine
            
            engine = SiegeEngine()
            engine.running = True
            
            # Should return early without error
            await engine.start()
            
            assert engine.running is True


class TestAttackerSelection:
    """Tests for attacker selection."""
    
    def test_select_attacker_returns_attacker(self, mock_settings):
        """Test _select_attacker returns an attacker."""
        mock_attacker = MagicMock()
        mock_attacker.category = MagicMock()
        mock_attacker.category.value = "AI_IMITATION"
        
        with patch("app.services.siege_engine.ATTACKER_REGISTRY", [mock_attacker]):
            from app.services.siege_engine import SiegeEngine
            
            engine = SiegeEngine()
            engine.attackers = [mock_attacker]
            
            selected = engine._select_attacker()
            
            assert selected is mock_attacker


class TestBroadcastCallback:
    """Tests for broadcast callback."""
    
    def test_set_broadcast_callback(self, mock_settings):
        """Test setting broadcast callback."""
        with patch("app.services.siege_engine.ATTACKER_REGISTRY", []):
            from app.services.siege_engine import SiegeEngine
            
            engine = SiegeEngine()
            callback = MagicMock()
            
            engine.set_broadcast_callback(callback)
            
            assert engine._broadcast_callback is callback
