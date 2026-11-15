<div align="center">

# 🔄 Synq

**Local-first note-taking app — data on device, syncs when online.**

[![Go](https://img.shields.io/badge/Go-1.24-00ADD8?logo=go&logoColor=white)](https://go.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ How it works

1. Keep an in-memory copy on the frontend; persist to **IndexedDB**.
2. Queue every user action in order; replay (batched) on a timer.
3. On load, hydrate UI from IndexedDB while fetching from server in background.
4. Server (Go/Fiber + Postgres via sqlc) stores the canonical copy.

## 🛠 Tech

`Go` · `Fiber` · `Postgres` · `sqlc` · `React` · `IndexedDB` · `Docker`

## 📦 Quick start

```bash
git clone https://github.com/m3rashid/synq.git
cd synq
docker compose up
cd client && pnpm install && pnpm dev
```

## 📄 License

MIT
