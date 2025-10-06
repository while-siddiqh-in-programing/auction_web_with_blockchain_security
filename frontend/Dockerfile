# Frontend Dockerfile: build with node, serve with nginx
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
# If lockfile exists (bun.lockb or package-lock.json) copy it too
COPY frontend/bun.lockb ./ || true
COPY frontend/package-lock.json ./ || true
RUN npm ci --silent
COPY frontend/ .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy a default nginx config if needed (optional)
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
