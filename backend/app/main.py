from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from .api.websocket import websocket_endpoint, manager
from .api.stats import router as stats_router
from .api.control import router as control_router
from .services.siege_engine import get_siege_engine
from .core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    print(f"[App] Starting {settings.APP_NAME}")
    
    # Get siege engine and set broadcast callback
    engine = get_siege_engine()
    engine.set_broadcast_callback(manager.broadcast)
    
    # Auto-start siege engine
    await engine.start()
    
    yield
    
    # Shutdown
    print("[App] Shutting down...")
    await engine.stop()


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Real-time visualization of AI attacks against HCS-U7 cognitive authentication",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
            "health": "/api/health",
            "control": "/api/control/*",
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
