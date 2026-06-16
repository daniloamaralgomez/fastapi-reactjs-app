# app/db/init_db.py

import sys
from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

from app.core.config import DATABASE_URL


def get_engine():
    return create_engine(DATABASE_URL)


def check_database_connection() -> bool:
    """
    Verify database connectivity.
    """
    engine = get_engine()

    try:
        with engine.connect() as conn:
            version = conn.execute(text("SELECT version()")).scalar()

        print("Database connection successful")
        print(f"Postgres version: {version}")
        return True

    except OperationalError as e:
        print("Database connection failed")
        print(e)
        return False


def initialize_database():
    engine = get_engine()

    schema_path = Path(__file__).parent / "schema.sql"

    with open(schema_path) as f:
        schema = f.read()

    with engine.begin() as conn:
        conn.execute(text(schema))

    print("Database initialized successfully")


def main():
    if len(sys.argv) != 2:
        print("Usage:")
        print("  python app/db/init_db.py check")
        print("  python app/db/init_db.py init")
        sys.exit(1)

    command = sys.argv[1]

    if command == "check":
        check_database_connection()

    elif command == "init":
        initialize_database()

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
