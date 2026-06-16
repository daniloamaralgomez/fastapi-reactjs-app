from typing import Protocol, List, Optional

from app.domain.joke import Joke


class JokeRepository(Protocol):
    """
    Contract for all joke storage implementations.
    """

    def save(self, joke: Joke) -> Joke: ...

    def list(self) -> List[Joke]: ...

    def delete(self, joke_id: str) -> Optional[Joke]: ...

    def exists(self, joke_id: str) -> bool: ...
