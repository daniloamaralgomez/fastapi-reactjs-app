import os


# =========================================================
# EXTERNAL APIs
# =========================================================

PROFANITY_API_KEY = os.getenv("PROFANITY_API_KEY")

PROFANITY_URL = "https://api.api-ninjas.com/v1/profanityfilter"


# =========================================================
# DATABASE CONFIG
# =========================================================


REPOSITORY_TYPE = os.getenv(
    "REPOSITORY_TYPE",
    "memory",
)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "jokesdb")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")


DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
