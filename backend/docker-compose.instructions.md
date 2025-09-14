
# Docker Compose Instructions for Ecommerce Backend

This guide explains how to run your ecommerce backend using Docker Compose in both development and production environments.

---

## 1. Prerequisites

- Docker and Docker Compose installed
- `.env.development` and/or `.env.production` file present in the `backend/` directory

---

## 2. Development Setup (`docker-compose.dev.yml`)

Use this for local development. It includes hot-reloading, dev tools, and extra services like MailHog and MinIO.

### Example: `docker-compose.dev.yml`

Your file should look like this (already present):

```yaml
# ...existing content from docker-compose.dev.yml...
```

### How to Run (Development)

From the `backend/` directory, run:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- The backend will be available at `http://localhost:3000`
- MongoDB, Redis, MailHog, and MinIO will run as services
- Code changes will hot-reload if volumes are mounted

#### Stopping and Removing Containers (Dev)

To stop:
```bash
docker-compose -f docker-compose.dev.yml down
```
To stop and remove all data (volumes):
```bash
docker-compose -f docker-compose.dev.yml down -v
```

---

## 3. Production Setup (`docker-compose.yml`)

Use this for deploying to production. It is simpler and does not include dev-only services.

### Example: `docker-compose.yml`

```yaml
version: '3.8'
services:
  backend:
    build: .
    container_name: ecommerce-backend
    env_file:
      - .env.production
    ports:
      - "8000:8000"
    restart: unless-stopped
    depends_on:
      - mongo
      - redis
  mongo:
    image: mongo:6
    container_name: ecommerce-mongo
    restart: unless-stopped
    volumes:
      - mongo_data:/data/db
  redis:
    image: redis:7
    container_name: ecommerce-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
volumes:
  mongo_data:
  redis_data:
```

### How to Run (Production)

From the `backend/` directory, run:

```bash
docker-compose up --build
```

- The backend will be available at `http://localhost:8000`
- MongoDB and Redis will run as services and persist data in named volumes

#### Stopping and Removing Containers (Prod)

To stop:
```bash
docker-compose down
```
To stop and remove all data (volumes):
```bash
docker-compose down -v
```

---

## 4. Logs

To view logs for all services:
```bash
docker-compose logs -f
```
or for dev:
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

---

**Notes:**
- Update the `env_file` path if you use a different environment file.
- Make sure your environment variables are set correctly for Docker networking.
- For development, use `docker-compose.dev.yml`. For production, use `docker-compose.yml`.
