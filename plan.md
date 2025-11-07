# Avyra Website - Phase 2: Data Ingestion Plan

This plan outlines the steps to re-architect the data flow to use a "push" method from the FiveM server instead of a "pull" method from the web backend.

## Phase 1: Backend Overhaul

- [ ] **Remove MySQL Dependencies:**
  - [ ] Remove `mysql2` from `package.json`.
  - [ ] Delete or comment out the `fivemDB` connection logic in `backend/config/database.js`.
- [ ] **Update Database Schema:**
  - [ ] Create a new `players` table in the Neon (PostgreSQL) database to store the character data.
- [ ] **Create Data Ingestion Endpoint:**
  - [ ] Add a new route `POST /api/ingest/player-data`.
  - [ ] Secure the endpoint with a secret key/token.
  - [ ] Write the logic to handle `INSERT` and `UPDATE` (UPSERT) operations for player data.
- [ ] **Update API Endpoints:**
  - [ ] Rewrite the `GET /api/user/characters` endpoint to query the new `players` table in the Neon database.

## Phase 2: FiveM Script Creation

- [ ] **Create Resource Structure:**
  - [ ] Create a new resource folder `player_data_sync`.
  - [ ] Create `fxmanifest.lua` and `server/main.lua`.
- [ ] **Implement Data Sync Logic:**
  - [ ] Hook into a QBCore player save event.
  - [ ] Collect all necessary character data.
  - [ ] Format the data into a JSON payload.
- [ ] **Implement HTTP Push:**
  - [ ] Use `PerformHttpRequest` to send the data to the Render backend.
  - [ ] Include the secret key for authentication.
  - [ ] Add error handling and logging.

## Phase 3: Deployment & Testing

- [ ] **Deploy Backend Changes:**
  - [ ] Push the updated backend code to GitHub to trigger a new Render deployment.
- [ ] **Install and Test FiveM Script:**
  - [ ] Add the `player_data_sync` resource to the server.
  - [ ] Start the server and verify that data is being pushed correctly after a player logs in/out.
- [ ] **End-to-End Test:**
  - [ ] Log in to the website and confirm the player dashboard displays the correct, synced data.

