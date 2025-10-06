# Makefile for common tasks
.PHONY: backend-run frontend-run build docker-up docker-down

backend-run:
	cd backend && ./mvnw spring-boot:run

frontend-run:
	cd frontend && npm install && npm run dev

build:
	cd backend && ./mvnw -B -DskipTests package
	cd frontend && npm ci && npm run build

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down
