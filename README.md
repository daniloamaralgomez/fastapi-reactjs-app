<p align="center">
    <img src="./img/chuck_approved.png" alt="Chuck Approved" width="200" style="background-color: transparent;" />
</p>

# Norris Hub | AWS Full-Stack Application

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.116-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Terraform](https://img.shields.io/badge/Terraform-AWS-7B42BC?logo=terraform)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?logo=googlechrome)](https://fastapi-reactjs-app.onrender.com)

> A production-oriented full-stack application built around a simple idea: retrieving and managing Chuck Norris jokes while showcasing modern software engineering practices and cloud-native architecture.

Although the domain is intentionally playful, this repository is a comprehensive engineering project that demonstrates how to design, build, deploy, and operate a complete full-stack system using industry-standard technologies.

The application retrieves random jokes from the public [Chuck Norris API](https://api.chucknorris.io/), applies an AI-powered profanity filter, and allows users to save their favorite jokes.

#### Technology Stack

* **Frontend**: React, Vite, Tailwind CSS
* **Backend**: Python, FastAPI, Pydantic, SQLAlchemy
* **Database**: PostgreSQL
* **Infrastructure & Cloud**: Docker, Docker Compose, Terraform, AWS

This project demonstrates:

* Modern frontend architecture with React and Vite
* REST API development with FastAPI
* Data validation using Pydantic
* Database persistence with PostgreSQL and SQLAlchemy
* Containerized deployments with Docker
* Infrastructure as Code (IaC) with Terraform
* End-to-end AWS infrastructure provisioning
* Clean separation of concerns across all application layers

#### **[Live Demo](https://fastapi-reactjs-app.onrender.com)**

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
VITE_API_BASE_URL=http://localhost:8000 npm run dev
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
docker build -t my-fastapi-app .
```

Run backend container:

```bash
docker run \
  --name my-fastapi-app \
  -p 8000:8000 \
  -e PROFANITY_API_KEY="$PROFANITY_API_KEY" \
  my-fastapi-app
```

> [!NOTE]
> If you do not set PROFANITY_API_KEY, the application will not apply the profanity filter but still works.

#### Frontend

Build frontend image:

```bash
cd frontend/app

docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8000 \
  -t my-react-app \
  frontend/app
```

The environment variable `VITE_API_BASE_URL` must be set in other to let the frontend where is the backend.
Run frontend container:

```bash
docker run \
  --name my-react-app \
  -p 80:80 \
  my-react-app
```

#### Full-stack application

Your application should be locally available at:

```text
Frontend: http://localhost

Backend: http://localhost:8000

Swagger: http://localhost:8000/docs
```

Cleanup:

```bash
docker stop my-fastapi-app my-react-app

docker rm my-fastapi-app my-react-app

docker rmi my-fastapi-app my-react-app
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

Full-stack Application:

```text
Frontend
http://localhost:3000

Backend
http://localhost:8000

Swagger
http://localhost:8000/docs
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
