from app.core.config import DATABASE_URL, REPOSITORY_TYPE

from app.clients.joke_client import JokeClient

from app.repositories.memory import InMemoryJokeRepository
from app.repositories.postgres import PostgresJokeRepository

from app.services.joke_service import JokeService


def build_joke_service() -> JokeService:
    """
    Composition root:
    builds the full dependency graph.
    """

    client = JokeClient()

    if REPOSITORY_TYPE == "postgres":
        repo = PostgresJokeRepository(DATABASE_URL)
    else:
        repo = InMemoryJokeRepository()

    return JokeService(client=client, repository=repo)
