## Bcards Backend

Node.js/Express backend for a Business Cards app using MongoDB (local and Atlas), JWT auth, request logging, and basic seeding for initial users/cards.

## Requirements
- Node.js 18+
- npm 9+
- MongoDB (optional for local dev)

## Project layout
The app code and `package.json` live under `src/`.

```
Bcards Backend/
  └─ src/
      ├─ server.js
      ├─ DB/
      ├─ users/
      ├─ cards/
      ├─ auth/
      └─ config/
```

## Installation
Run all commands from the `src` directory.

```bash
cd src
npm install
```

## Configuration

- App config is in `src/config/*.json` and is selected by `NODE_ENV`.
  - `development.json`: default for local development (connects to local MongoDB).
  - `production.json`: used when `NODE_ENV=production` (connects to Atlas).

- Environment variables (create a `.env` file in `src/`):

```bash
# For Atlas (recommended)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority

# OR if you prefer separate pieces (optional)
DB_USER=<atlasUser>
DB_PASS=<atlasPassword>
DB_HOST=<cluster-host>
DB_NAME=<database>
```

Notes:
- If your Atlas password contains special characters, URL-encode it before placing in the URI.
- By default, the app seeds initial users/cards on startup.

## Git ignore of secrets
Make sure your `.env` is not committed. If you keep `.env` under `src/`, ensure `src/.gitignore` includes:

```gitignore
.env
.env.*
!.env.example
```

If your `.env` is at the repository root, create a root `.gitignore` with the same rules.

If a `.env` was already committed, untrack it:

```bash
git rm --cached .env
git commit -m "Stop tracking .env"
```

## Running the app

All commands are from `src/`.

### Development (local MongoDB)
This uses `src/DB/mongoDB/connectLocally.js` and `development.json`.

```bash
cd src
npm run dev
```

- Exposes: `http://localhost:8181` (from `development.json`).
- Requires a local MongoDB instance at `mongodb://localhost:27017/business_card_app`.

### Production (Atlas)
This uses `src/DB/mongoDB/connectToAtlasDb.js` and `production.json`.

1) Ensure your `.env` contains a working `MONGODB_URI` (or the separate vars).
2) Whitelist your current IP in Atlas (Project → Network Access → Add IP Address). For testing you can temporarily allow `0.0.0.0/0`.
3) Start the server:

```bash
cd src
npm start
```

- Exposes: `http://localhost:9191` (from `production.json`).

## Troubleshooting Atlas connection
- Error: `MongooseServerSelectionError: Could not connect to any servers...` usually means IP not whitelisted or DNS/VPN issues.
  - Add your public IP to Atlas Network Access.
  - Verify the SRV host resolves:
    ```bash
    nslookup -type=SRV _mongodb._tcp.<cluster-host>
    nslookup <cluster-host>
    ```
  - Test with mongosh:
    ```bash
    mongosh "${MONGODB_URI}"
    ```
  - If password has special characters, URL-encode it.
  - Temporarily disable VPN/AV or switch networks if DNS fails.

## Available npm scripts

```json
{
  "dev": "set NODE_ENV=development&& nodemon .",
  "start": "set NODE_ENV=production&& node server.js"
}
```

Windows note: scripts use Windows-friendly `set`. Run them via `npm run ...` from `cmd`, PowerShell, or Git Bash (npm handles the shell). If you need cross-platform `NODE_ENV`, consider `cross-env`.

## API
- The server registers routes via `src/router/router.js` and controllers in `src/users/routes` and `src/cards/routes`.
- Base URL is `http://localhost:<PORT>` where `<PORT>` is from the active config.

## Seeding
On startup, the server invokes initial data generators in `src/initialData/initialDataService.js` to create sample users/cards if needed.

## License
ISC


