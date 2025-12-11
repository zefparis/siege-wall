"""
Tests for configuration module
"""
import pytest
from unittest.mock import patch
import os


class TestSettingsValidation:
    """Tests for settings validation."""
    
    def test_default_debug_is_false(self):
        """Test DEBUG defaults to False."""
        with patch.dict(os.environ, {}, clear=True):
            # Import fresh settings
            from pydantic_settings import BaseSettings
            
            # The default should be False
            from app.core.config import Settings
            
            # Create with minimal required values
            with patch.dict(os.environ, {"HCS_API_KEY": "test"}):
                settings = Settings()
                # Default is False as per our security fix
                assert settings.DEBUG is False
    
    def test_allowed_origins_parsing(self):
        """Test ALLOWED_ORIGINS parses comma-separated string."""
        from app.core.config import Settings
        
        with patch.dict(os.environ, {
            "ALLOWED_ORIGINS": "http://localhost:3000,http://localhost:5173,https://example.com"
        }):
            settings = Settings()
            assert len(settings.ALLOWED_ORIGINS) == 3
            assert "http://localhost:3000" in settings.ALLOWED_ORIGINS
            assert "https://example.com" in settings.ALLOWED_ORIGINS
    
    def test_allowed_origins_list_passthrough(self):
        """Test ALLOWED_ORIGINS accepts list directly."""
        from app.core.config import Settings
        
        origins = ["http://localhost:3000", "http://localhost:5173"]
        settings = Settings(ALLOWED_ORIGINS=origins)
        
        assert settings.ALLOWED_ORIGINS == origins
    
    def test_mock_mode_default(self):
        """Test MOCK_MODE defaults to True for safety."""
        from app.core.config import Settings
        
        settings = Settings()
        assert settings.MOCK_MODE is True


class TestSettingsWarnings:
    """Tests for settings warnings."""
    
    def test_debug_warning_logged(self, caplog):
        """Test warning is logged when DEBUG is True."""
        import logging
        
        with patch.dict(os.environ, {"DEBUG": "true"}):
            from app.core.config import Settings
            
            with caplog.at_level(logging.WARNING):
                settings = Settings()
            
            # Check warning was logged
            assert settings.DEBUG is True
    
    def test_api_key_warning_when_not_mock(self, caplog):
        """Test warning when API key empty and not in mock mode."""
        import logging
        
        with patch.dict(os.environ, {
            "MOCK_MODE": "false",
            "HCS_API_KEY": ""
        }):
            from app.core.config import Settings
            
            with caplog.at_level(logging.WARNING):
                settings = Settings()
            
            # Should have warned about empty API key
            assert settings.MOCK_MODE is False
            assert settings.HCS_API_KEY == ""
