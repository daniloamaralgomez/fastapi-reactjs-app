from typing import List, Optional

from sqlalchemy import text

from app.domain.joke import Joke
from app.db.session import engine


class PostgresJokeRepository:
    """
    PostgreSQL implementation of JokeRepository.
    """

    def __init__(self):
        self.engine = engine

    def save(self, joke: Joke) -> Joke:
        query = text("""
            INSERT INTO jokes (
                id,
                value,
                icon_url,
                safe
            )
            VALUES (
                :id,
                :value,
                :icon_url,
                :safe
            )
            ON CONFLICT (id)
            DO UPDATE SET
                value = EXCLUDED.value,
                icon_url = EXCLUDED.icon_url,
                safe = EXCLUDED.safe
        """)

        with self.engine.begin() as conn:
            conn.execute(
                query,
                {
                    "id": joke.id,
                    "value": joke.value,
                    "icon_url": joke.icon_url,
                    "safe": joke.safe,
                },
            )

        return joke

    def list(self) -> List[Joke]:
        query = text("""
            SELECT
                id,
                value,
                icon_url,
                safe
            FROM jokes
            ORDER BY created_at DESC
        """)

        with self.engine.connect() as conn:
            result = conn.execute(query)

            return [
                Joke(
                    id=row.id,
                    value=row.value,
                    icon_url=row.icon_url,
                    safe=row.safe,
                )
                for row in result
            ]

    def delete(self, joke_id: str) -> Optional[Joke]:
        query = text("""
            DELETE FROM jokes
            WHERE id = :id
            RETURNING
                id,
                value,
                icon_url,
                safe
        """)

        with self.engine.begin() as conn:
            result = conn.execute(
                query,
                {"id": joke_id},
            )

            row = result.fetchone()

        if row is None:
            return None

        return Joke(
            id=row.id,
            value=row.value,
            icon_url=row.icon_url,
            safe=row.safe,
        )

    def exists(self, joke_id: str) -> bool:
        query = text("""
            SELECT 1
            FROM jokes
            WHERE id = :id
        """)

        with self.engine.connect() as conn:
            result = conn.execute(
                query,
                {"id": joke_id},
            )

            return result.first() is not None
