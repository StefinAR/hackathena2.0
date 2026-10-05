# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analysis import router as analysis_router

app = FastAPI(
    title="NetShield API",
    description="DDoS detection backend using LUCID",
    version="1.0.0",
)

from app.routes.monitoring import router as monitoring_router

app.include_router (monitoring_router)

# CORS
# -------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,

    # React development server
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------------
# Routes
# -------------------------------------------------------------------

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