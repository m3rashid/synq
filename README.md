<div align="center">

# 🔄 Synq

### Local-first note-taking app — data on device, syncs when online

[![Go](https://img.shields.io/badge/Go-1.24-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

**Synq** is a local-first note-taking app. Data lives on the device in IndexedDB and syncs to a Go backend when online. An action queue replays user actions in order, with background server sync, so the UI stays responsive offline.

## 🧠 How it works

1. Keep an in-memory copy on the frontend; persist to **IndexedDB**.
2. Queue every user action in order; replay (batched) on a timer.
3. On load, hydrate UI from IndexedDB while fetching from server in background.
4. Server (Go/Fiber + Postgres via sqlc) stores the canonical copy.

## ✨ Features

- 📴 **Offline-first** — works without network
- 🔄 **Action queue** — ordered replay of user actions
- 🗄️ **IndexedDB** local store
- 🔁 **Background sync** with server
- 🐳 **Dockerized** backend

## 🏗 Architecture

```
synq/
├── main.go          # Fiber entrypoint
├── modules/         # todo, user modules
├── utils/           # env, helpers, server
├── client/          # React + Vite frontend
├── sqlc.json        # sqlc config
└── docker-compose.yml
```

## 🛠 Tech stack

`Go` · `Fiber` · `Postgres` · `sqlc` · `React` · `IndexedDB` · `Docker` · `gofakeit`

## 📦 Quick start

```bash
git clone https://github.com/m3rashid/synq.git
cd synq
docker compose up
cd client && pnpm install && pnpm dev
```

## 📄 License

MIT © [m3rashid](https://github.com/m3rashid)
