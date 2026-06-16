from pydantic import BaseModel


class Joke(BaseModel):
    id: str
    value: str
    icon_url: str
    safe: bool = True
