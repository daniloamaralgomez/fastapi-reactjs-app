from fastapi import APIRouter

from app.domain.joke import Joke
from app.core.bootstrap import build_joke_service

router = APIRouter(prefix="/api/jokes", tags=["jokes"])
service = build_joke_service()


@router.get("/random")
async def get_random_joke():
    """
    Endpoint to fetch a random joke.
    Delegates all logic to service.
    """
    return await service.get_random_joke()


@router.get("/fixed")
def get_fixed_joke():
    """
    Returns a static joke.
    """
    return service.get_fixed_joke()


@router.post("/saved")
def save_joke(joke: Joke):
    return service.save_joke(joke)


@router.get("/saved")
def get_saved_jokes():
    return service.get_saved_jokes()


@router.delete("/saved/{joke_id}")
def delete_joke(joke_id: str):
    return service.delete_joke(joke_id)
