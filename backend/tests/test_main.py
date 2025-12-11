"""
Tests for main application endpoints
"""
import pytest
from unittest.mock import patch, MagicMock


class TestHealthEndpoint:
    """Tests for health check endpoint."""
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns app info."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "name" in data
        assert "status" in data
        assert data["status"] == "operational"
        assert "endpoints" in data


class TestCORSHeaders:
    """Tests for CORS configuration."""
    
    def test_cors_allowed_origin(self, client):
        """Test CORS headers for allowed origin."""
        response = client.options(
            "/",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET"
            }
        )
        # FastAPI returns 200 for OPTIONS with CORS
        assert response.status_code == 200
    
    def test_cors_headers_present(self, client):
        """Test that CORS headers are present in response."""
        response = client.get(
            "/",
            headers={"Origin": "http://localhost:3000"}
        )
        assert response.status_code == 200
        # Check CORS header is present
        assert "access-control-allow-origin" in response.headers


class TestStatsEndpoint:
    """Tests for statistics endpoints."""
    
    def test_stats_endpoint_structure(self, client):
        """Test stats endpoint returns expected structure."""
        with patch("app.api.stats.get_siege_engine") as mock_get_engine:
            mock_engine = MagicMock()
            mock_engine.get_stats.return_value = MagicMock(
                total_attacks=100,
                blocked=99,
                success=1,
                uptime_seconds=3600,
                attacks_per_second=10.0,
                total_vectors=10,
                active_vectors=10,
                model_dump=MagicMock(return_value={
                    "total_attacks": 100,
                    "blocked": 99,
                    "uptime_seconds": 3600,
                })
            )
            mock_get_engine.return_value = mock_engine
            
            response = client.get("/api/stats")
            assert response.status_code == 200


class TestControlEndpoints:
    """Tests for control endpoints."""
    
    def test_start_endpoint(self, client):
        """Test start siege endpoint."""
        with patch("app.api.control.get_siege_engine") as mock_get_engine:
            mock_engine = MagicMock()
            mock_engine.running = False
            mock_engine.start = MagicMock()
            mock_get_engine.return_value = mock_engine
            
            response = client.post("/api/control/start")
            assert response.status_code == 200
            data = response.json()
            assert "status" in data
    
    def test_stop_endpoint(self, client):
        """Test stop siege endpoint."""
        with patch("app.api.control.get_siege_engine") as mock_get_engine:
            mock_engine = MagicMock()
            mock_engine.running = True
            mock_engine.stop = MagicMock()
            mock_get_engine.return_value = mock_engine
            
            response = client.post("/api/control/stop")
            assert response.status_code == 200
            data = response.json()
            assert "status" in data
    
    def test_status_endpoint(self, client):
        """Test status endpoint."""
        with patch("app.api.control.get_siege_engine") as mock_get_engine:
            mock_engine = MagicMock()
            mock_engine.running = True
            mock_get_engine.return_value = mock_engine
            
            response = client.get("/api/control/status")
            assert response.status_code == 200
            data = response.json()
            assert "running" in data
