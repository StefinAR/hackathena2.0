from fastapi import FastAPI

from app.database.database import Base, engine
from app.database import models
from app.routes.analysis import router as analysis_router
from app.routes.health import router as health_router
from app.routes.history import router as history_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NetShield API",
    description="DoS Detection and Network Security Backend",
    version="1.0.0"
)

app.include_router(analysis_router)
app.include_router(health_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {
        "message": "NetShield Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }