from app.domain.joke import Joke
from app.clients.joke_client import JokeClient
from app.repositories.base import JokeRepository


class JokeService:
    """
    Application service (use-case layer).

    Responsibilities:
    - Orchestrate external calls via JokeClient
    - Apply business rules (filtering, fallback)
    - Convert raw data → domain model (Joke)
    """

    def __init__(self, client: JokeClient, repository: JokeRepository):
        self.client = client
        self.repository = repository

    async def get_random_joke(self) -> Joke:
        """
        Fetch joke, apply profanity filter, return clean response.
        """
        raw_joke = await self.client.fetch_random_joke()

        try:
            # API-Ninjas response looks like:
            # { "original": "...", "censored": "...", "has_profanity": false }
            filter_result = await self.client.filter_text(raw_joke["value"])

            value = filter_result.get(
                "censored",
                raw_joke["value"],
            )

            safe = not filter_result.get(
                "has_profanity",
                False,
            )

        except Exception:
            value = raw_joke["value"]
            safe = True

        return Joke(
            id=raw_joke["id"],
            value=value,
            icon_url=raw_joke["icon_url"],
            safe=safe,
        )

    def get_fixed_joke(self) -> Joke:
        """
        Return static joke wrapped in domain model.
        """
        raw = self.client.get_fixed_joke()

        return Joke(
            id=raw["id"],
            value=raw["value"],
            icon_url=raw["icon_url"],
        )

    def save_joke(self, joke):
        """
        Save a joke into repository.
        """
        return self.repository.save(joke)

    def get_saved_jokes(self):
        """
        Return all saved jokes.
        """
        return self.repository.list()

    def delete_joke(self, joke_id: str):
        """
        Remove joke from storage.
        """
        return self.repository.delete(joke_id)
