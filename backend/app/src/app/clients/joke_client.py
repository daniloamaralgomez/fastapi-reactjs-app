import httpx

from app.core.config import PROFANITY_API_KEY, PROFANITY_URL


class JokeClient:
    """
    External API adapter.

    Responsibilities:
    - Fetch jokes from Chuck Norris API
    - Call profanity filter API
    - Return raw JSON-like structures (NOT domain models)
    """

    __URL = "https://api.chucknorris.io/jokes"

    def __init__(self, base_url: str = ""):
        self.base_url = base_url or self.__URL

    async def fetch_random_joke(self) -> dict:
        """Fetch raw joke payload from external API."""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/random")
            response.raise_for_status()

        return response.json()

    async def filter_text(self, text: str) -> dict:
        """Call external profanity filter API."""
        headers = {"X-Api-Key": PROFANITY_API_KEY}
        params = {"text": text}

        async with httpx.AsyncClient() as client:
            res = await client.get(PROFANITY_URL, headers=headers, params=params)

        return res.json()

    def get_fixed_joke(self) -> dict:
        """Static test data (raw format)."""
        return {
            "id": "12345",
            "value": "Chuck Norris can divide by zero.",
            "icon_url": "https://api.chucknorris.io/img/avatar/chuck-norris.png",
        }
