<p align="center">
    <img src="./img/chuck_approved.png" alt="Chuck Approved" width="200" style="background-color: transparent;" />
</p>

# Chuck Norris Full Stack Application

The application fetches random Chuck Norris jokes from the [API](https://api.chucknorris.io/), applies a profanity filter (NLP/AI driven), and allows users to save their favorite jokes.

---

## Architecture & Infrastructure

Detailed system architecture, infrastructure blueprints, and core design decisions are maintained in dedicated documentation. 

Please refer to the [Architecture Documentation](./docs/README.md) for full details.

---

## Prerequisites

Install the following tools:

* Python 3.12+
* Node.js 22+
* uv
* PostgreSQL 16+
* Docker (optional)

---
## Running The Application Locally

### Backend Installation

#### Navigate to backend

```bash
cd backend/app
```

#### Create a Python virtual environment

```bash
uv venv
```

Activate it.

Linux/macOS:

```bash
source .venv/bin/activate
```

Windows:

```powershell
.venv\Scripts\activate
```

#### Install dependencies

```bash
uv sync
```

#### Create environment variables

Create a `.env` file.

Example:

```bash
PROFANITY_API_KEY=<your_key_goes_here>


# The following variables mut be provided
# if you want the system to use PostgreSQL
REPOSITORY_TYPE=postgres

DB_HOST=<host>
DB_PORT=<port>
DB_USER=<user>
DB_NAME=<database_name>
DB_PASSWORD=<password>

```

#### Initialize database

You must ensure database `"$DB_NAME"` is created in you PostgreSQL installation.

Verify connectivity:

```bash
uv run python -m app.db.init check
```

Initialize schema:

```bash
uv run python -m app.db.init init
```

#### Run backend

```bash
uv run uvicorn main:app --reload
```

OpenAPI (Swagger) must be visible in your localhost at:

```text
http://localhost:8000/docs
```

### Frontend Installation

#### Navigate to frontend

```bash
cd frontend/app
```

#### Install dependencies

```bash
npm install
```

#### Start the development environment

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

> [!NOTE]
> While `npm run dev` handles requests locally, our production infrastructure utilizes **Nginx** as a reverse proxy to route external traffic to the production Node.js application process.

---

## Deploy with Docker

#### Backend

Build backend image:

```bash
cd backend/app

docker build -t chuck-jokes-backend .
```

Run backend container:

```bash
docker run \
  -p 8000:8000 \
  [-e YOUR_ENV_VARS] \
  chuck-jokes-backend
```

#### Frontend

Build frontend image:

```bash
cd frontend/app

docker build -t chuck-jokes-frontend .
```

Run frontend container:

```bash
docker run -p 5173:5173 chuck-jokes-frontend
```

#### Full-stack application

Your application should be locally available at:

```text
Frontend: http://localhost:5173

Backend: http://localhost:8000

Swagger: http://localhost:8000/docs
```


---

## Deploy with Docker Compose


From repository root:

```bash
docker compose up --build
```

Stop services:

```bash
docker compose down
```

Delete volumes:

```bash
docker compose down -v
```

---

## AWS Infrastructure Deployment

To ensure a separation of concerns, the comprehensive instructions for provisioning and deploying this application's infrastructure to AWS are maintained in a dedicated reference guide.

Please proceed to the [AWS Deployment & Architecture Reference Manual](./infrastructure/README.md) for detailed prerequisites, configuration guidelines, and step-by-step deployment commands.

---

## Backend API Endpoints

Get a random joke:

```http
GET /api/jokes/random
```
Example Response:

```json
{
  "id": "123",
  "value": "Chuck Norris can divide by zero.",
  "icon_url": "https://api.chucknorris.io/img/avatar/chuck-norris.png",
  "safe": true
}
```

Get Saved Jokes:

```http
GET /api/jokes/saved
```

Save a Joke:

```http
POST /api/jokes/saved
```

Delete a Saved Joke:

```http
DELETE /api/jokes/saved/{joke_id}
```

---

# Future Improvements

* Add unit tests
* Add integration tests
* Add GitHub Actions CI/CD
* User authentication (OIDC and SSO)
