# obolus 💰

## development 🛠

```bash
// clone
git clone https://github.com/CupCakeArmy/obolus.git
cd obolus

// local
npm run dev:local

// or with docker
npm run dev:docker

// -> http://localhost 🚀
```

### notes 🗒

- The first run will take 1-2 minutes before you can see anything as modules needs to be installed and the code compiled.
- All code is hot-reloaded.
- When switching from `local` to `docker` please run `npm run clean` as the `sqlite3` package needs to download the right binaries for the current maschine.
