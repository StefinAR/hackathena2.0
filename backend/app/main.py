from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analysis import router as analysis_router
from app.database.database import Base, engine
from app.models.detection import Detection
from app.config import settings

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.APP_NAME,
    description="DDoS detection backend using LUCID",
    version=settings.APP_VERSION,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(analysis_router)

# -------------------------------------------------------------------
# Basic health check
# -------------------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "NetShield API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }