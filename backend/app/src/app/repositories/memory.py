from typing import Dict, List, Optional
from app.domain.joke import Joke


class InMemoryJokeRepository:
    """
    Simple dict-based storage.
    Used for development and testing.
    """

    def __init__(self):
        self.store: Dict[str, Joke] = {}

    def save(self, joke: Joke) -> Joke:
        self.store[joke.id] = joke
        return joke

    def list(self) -> List[Joke]:
        return list(self.store.values())

    def delete(self, joke_id: str) -> Optional[Joke]:
        return self.store.pop(joke_id, None)

    def exists(self, joke_id: str) -> bool:
        return joke_id in self.store
