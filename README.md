# Auction Web with Blockchain Security

This repository contains a full-stack auction application with a Java Spring Boot backend and a React + TypeScript frontend. The project includes basic blockchain-mock integration for bid settlement, MongoDB persistence, and a simple payment flow.

Contents
- backend/ — Spring Boot (Maven) backend
- frontend/ — React + Vite frontend
- docker-compose.yml — bring up MongoDB, backend and frontend with Docker

Quick start (local, development)

Prerequisites
- Java 17+ (JDK)
- Maven (optional, the project includes Maven wrapper)
- Node.js 18+
- npm or bun (frontend uses npm scripts)
- MongoDB (if not using docker-compose)

Run backend locally
1. Open a terminal and go to `backend/`.
2. Build and run:

```powershell
# Windows PowerShell
cd backend
.\mvnw.cmd spring-boot:run
```

Run frontend locally
1. Open a terminal and go to `frontend/`.
2. Install and run:

```powershell
cd frontend
npm install
npm run dev
```

Run using Docker (recommended for easy setup)
1. Create `.env` from `.env.example` and adjust values if needed.
2. From project root run:

```powershell
docker-compose up --build
```

This will start:
- MongoDB on port 27017 (internal docker network)
- Backend on port 8080
- Frontend (production build served by nginx) on port 3000

Environment
- The backend reads MongoDB URI from `SPRING_DATA_MONGODB_URI` environment variable (see `.env.example`). Adjust as necessary.

Notes
- The currency conversion in the frontend is currently a simple fixed-rate conversion (configurable in the code). For production use, replace with a live FX API.
- Password hashing in the current sample is intentionally simple for demo purposes; replace with BCrypt or a proper auth provider for real deployments.

Files added
- `Dockerfile` in `backend/` and `frontend/` for container images
- `docker-compose.yml` to run the full stack
- `.env.example` with environment variable examples
- `README.md`, `LICENSE` (MIT), `.gitignore`, `CONTRIBUTING.md`, `requirements.txt`

Troubleshooting
- If the backend fails to connect to MongoDB when running locally, ensure MongoDB is running and that `application.properties` (backend) uses the correct URI.
- On Windows, use `mvnw.cmd` instead of `./mvnw`.

Contact
- For more help or to contribute, see `CONTRIBUTING.md`.
