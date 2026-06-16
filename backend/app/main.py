from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.joke_router import router as joke_router

app = FastAPI(title="Chuck Norris Jokes API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(joke_router)
