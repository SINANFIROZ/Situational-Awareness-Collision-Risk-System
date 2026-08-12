# Situational Awareness & Collision Risk System

## Overview
This project implements a situational awareness system that simulates vessel motion and evaluates collision risk using **CPA (Closest Point of Approach)** and **TCPA (Time to Closest Point of Approach)**.

It remains a browser-based simulation and now includes a **Phase 1 backend skeleton** with a shared risk engine and API surface for production-oriented expansion.

---

## Key Features
- Simulation of own vessel and multiple target vessels
- Real-time CPA and TCPA calculations
- Risk classification: SAFE, WARNING, DANGER
- Visual risk indication on canvas
- Emergency detection on collision
- Critical target prioritization
- Interactive identification (hover-to-highlight)
- Shared risk domain module used by both frontend and backend
- Backend API skeleton for health and risk evaluation

---

## Technology Stack
- HTML5 Canvas
- Vanilla JavaScript (ES Modules)
- CSS (no frameworks)
- Node.js + Express (Phase 1 API skeleton)

---

## Phase 1 Architecture
- `shared/risk-engine.js`: central risk domain logic (TCPA/CPA/classification)
- `JS/risk.js`: frontend re-export of shared risk engine
- `backend/src/app.js`: Express app with API routes
- `backend/src/server.js`: API startup entrypoint
- `tests/`: Node test suites for domain and API behavior

---

## How to Run Frontend
1. Clone/download the repository
2. Open `index.html` in a modern browser
3. Click **Start** to begin simulation

---

## How to Run Backend (Phase 1)
1. Install dependencies:
   - `npm install`
2. Start API server:
   - `npm run start:api`
3. Health endpoint:
   - `GET /api/v1/health`
4. Risk evaluation endpoint:
   - `POST /api/v1/risk/evaluate`

Example request body for risk evaluation:
```json
{
  "ownShip": { "x": 0, "y": 0, "velocity": { "vx": 0, "vy": 0 } },
  "target": { "x": 100, "y": 0, "velocity": { "vx": -10, "vy": 0 } }
}
```

---

## Testing
Run:
- `npm test`

This executes:
- Risk engine unit tests
- API behavior tests

---

## Assumptions & Limitations
- Simplified 2D Cartesian plane (not geospatial)
- No real-world nautical charts or AIS data
- No autonomous navigation or avoidance logic
- Backend currently provides a skeleton API (Phase 1 scope)
