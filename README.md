# Synq

Local-first note-taking app. Data lives on device (IndexedDB), syncs to server when online.

## Tech

Go · Fiber · Postgres · React · IndexedDB

## How it works

1. Store local copy in IndexedDB
2. Keep in-memory state on frontend
3. Queue user actions; replay in order
4. Sync with server in background

## License

MIT
