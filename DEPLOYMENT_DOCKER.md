# Docker Deployment

Lightning Decoder can be containerized with Docker for consistent deployment across environments.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for multi-container setups)

## Quick Start

### Build the Docker image

```bash
docker build -t lightning-decoder .
```

### Run the container

```bash
docker run -p 8080:80 lightning-decoder
```

The application will be available at `http://localhost:8080`

## Docker Compose

For easier management, create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  lightning-decoder:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

Stop with:

```bash
docker-compose down
```

## Production Deployment

### With SSL/TLS

Use a reverse proxy like nginx or Traefik to handle SSL:

```yaml
version: '3.8'

services:
  lightning-decoder:
    build: .
    restart: unless-stopped
    networks:
      - web

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - lightning-decoder
    networks:
      - web

networks:
  web:
    driver: bridge
```

### Kubernetes

Create a deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lightning-decoder
spec:
  replicas: 3
  selector:
    matchLabels:
      app: lightning-decoder
  template:
    metadata:
      labels:
        app: lightning-decoder
    spec:
      containers:
      - name: lightning-decoder
        image: lightning-decoder:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: lightning-decoder-service
spec:
  selector:
    app: lightning-decoder
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## Environment Variables

Pass environment variables to the container:

```bash
docker run -p 8080:80 \
  -e NODE_ENV=production \
  lightning-decoder
```

Or in docker-compose.yml:

```yaml
services:
  lightning-decoder:
    build: .
    environment:
      - NODE_ENV=production
    ports:
      - "8080:80"
```

## Custom Nginx Configuration

The Dockerfile uses a custom nginx configuration. To customize:

1. Edit `nginx.conf` in your project root
2. Rebuild the image:

```bash
docker build -t lightning-decoder .
```

## Multi-stage Build Optimization

The Dockerfile uses multi-stage builds to minimize image size:

- **Builder stage**: Installs dependencies and builds the app
- **Production stage**: Only includes the built assets and nginx

This results in a smaller, more secure image.

## Image Size

Check the image size:

```bash
docker images lightning-decoder
```

Typical size: ~25-30 MB

## Health Checks

Add health checks to your container:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
```

## Security Considerations

1. **Run as non-root user**: Modify the Dockerfile:

```dockerfile
# In production stage
RUN adduser -D -u 1000 appuser
USER appuser
```

2. **Scan for vulnerabilities**:

```bash
docker scan lightning-decoder
```

3. **Use specific image tags**:

```dockerfile
FROM node:20.10-alpine AS builder
FROM nginx:1.25-alpine
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          push: true
          tags: yourusername/lightning-decoder:latest
```

### GitLab CI

```yaml
docker-build:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t lightning-decoder .
    - docker tag lightning-decoder registry.gitlab.com/yourusername/lightning-decoder:latest
    - docker push registry.gitlab.com/yourusername/lightning-decoder:latest
```

## Troubleshooting

### Container exits immediately

Check logs:

```bash
docker logs <container-id>
```

### Port already in use

Change the host port:

```bash
docker run -p 9090:80 lightning-decoder
```

### Build fails

Clear Docker cache:

```bash
docker builder prune -a
docker build --no-cache -t lightning-decoder .
```

### Out of memory

Increase Docker memory limit in Docker Desktop settings, or optimize the build:

```dockerfile
# Add to builder stage
ENV NODE_OPTIONS="--max-old-space-size=2048"
```

## Monitoring

### View logs

```bash
docker logs -f <container-name>
```

### Resource usage

```bash
docker stats <container-name>
```

### Access container shell

```bash
docker exec -it <container-name> sh
```
