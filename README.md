# Synq

Local-first note-taking app. Data lives on the device (IndexedDB) and syncs to a Go backend when online, with an action queue and conflict handling.

## How it works

1. Keep an in-memory copy of data on the frontend; persist to IndexedDB.
2. Queue every user action in order; replay (batched) on a timer.
3. On load, hydrate UI from IndexedDB while fetching from server in background.
4. Server (Go/Fiber + Postgres via sqlc) stores the canonical copy.

## Tech

Go · Fiber · Postgres · sqlc · React · IndexedDB · Docker

## Quick start

```bash
git clone https://github.com/m3rashid/synq.git
cd synq
docker compose up
cd client && pnpm install && pnpm dev
```

## License

MIT
