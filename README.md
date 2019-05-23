# 💰obolus

## 🛠development

```bash
// Clone
git clone https://github.com/CupCakeArmy/obolus.git
cd obolus

// Local
npm run dev:local

// With docker
npm run dev:docker
```

### 🗒notes

- All code is hot-reloaded.
- When switching from `local` to `docker` please run `npm run clean` as the `sqlite3` package needs to download the right binaries for the current maschine.
