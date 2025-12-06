## Quick start

```bash

# Copy env file
cp env.sample .env

# Creating shared network
docker network create cajuzin-network

# Running PostgreSQL from Docker
docker run -d \
  --name cajuzin_db \
  --restart always \
  --network cajuzin-network \
  --memory=350m \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cajuzin_dev \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16

# Running from Docker
docker compose up -d
```

## Running locally

```bash
bun install

bun run migration:status	# Listing pending migrations
bun run migration:up		# Running pending migrations

bun run start				# Running the application
bun run dev					# Running on watch mode
```

## Migrations

```bash
# Running pending migrations
bun run migration:up

# Undo last migration
bun run migration:down

# Print migration status
bun run migration:status

# Undoing all migrations
bun run migration:destroy
```