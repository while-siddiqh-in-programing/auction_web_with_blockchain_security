# Backend Dockerfile (multi-stage)
FROM maven:3.9.7-eclipse-temurin-17 AS builder
WORKDIR /workspace
COPY . /workspace
# Use backend directory
WORKDIR /workspace/backend
# Build the application and produce the jar
RUN mvn -B -DskipTests package

# Runtime image
FROM eclipse-temurin:17-jre-alpine
ARG JAR_FILE=backend/target/*.jar
COPY --from=builder /workspace/backend/target /app/target
# Find the jar (there may be only one)
RUN ls -la /app/target
COPY --from=builder /workspace/backend/target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
