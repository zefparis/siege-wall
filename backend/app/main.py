from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from .api.websocket import websocket_endpoint, manager
from .api.stats import router as stats_router
from .api.control import router as control_router
from .services.siege_engine import get_siege_engine
from .core.config import settings
from .core.logging_config import setup_logging, get_logger

# Setup logging before anything else
setup_logging(debug=settings.DEBUG, json_format=not settings.DEBUG)
logger = get_logger(__name__, service="siege-wall-backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info(
        f"Starting {settings.APP_NAME}",
        extra={
            "version": "1.0.0",
            "debug": settings.DEBUG,
            "mock_mode": settings.MOCK_MODE,
            "allowed_origins": settings.get_allowed_origins()
        }
    )
    
    # Get siege engine and set broadcast callback
    try:
        engine = get_siege_engine()
        engine.set_broadcast_callback(manager.broadcast)
        logger.info("Siege engine initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize siege engine: {e}", extra={"error": str(e)})
        raise
    
    # Auto-start siege engine
    await engine.start()
    logger.info("Siege engine started")
    
    yield
    
    # Shutdown
    logger.info("Shutting down...")
    await engine.stop()
    logger.info("Shutdown complete")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Real-time visualization of AI attacks against HCS-U7 cognitive authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware - Restricted origins from settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),  # Configured via environment
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Include routers
app.include_router(stats_router)
app.include_router(control_router)


# WebSocket endpoint
@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    await websocket_endpoint(websocket)


# Root endpoint
@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "status": "operational",
        "endpoints": {
            "websocket": "/ws",
            "stats": "/api/stats",
            "attackers": "/api/attackers",
            "health": "/health",
            "control": "/api/control/*",
        }
    }


# Health check endpoint at root level for Docker healthcheck
@app.get("/health")
async def root_health_check():
    """
    Root-level health check for Docker/Kubernetes probes.
    Redirects to the detailed health endpoint.
    """
    from datetime import datetime
    from fastapi.responses import JSONResponse
    
    try:
        engine = get_siege_engine()
        return JSONResponse(
            content={
                "status": "healthy",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "siege_engine": {
                    "running": engine.running,
                    "total_attacks": engine.stats.total_attacks
                }
            },
            status_code=200
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            content={
                "status": "unhealthy",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "error": str(e)
            },
            status_code=503
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
