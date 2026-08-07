# 🛡️ Tactical Guardian HQ (Foundry OS Edition)

**Tactical Guardian HQ** is an offline-first, high-density disaster response and tactical field operations system designed for emergency management teams, first responders, and disaster coordinators operating in bandwidth-constrained environment settings across the Philippines (e.g., Marikina River Corridor, Laguna, Cebu Field Hubs).

Inspired by tactical intelligence platforms like **Palantir Foundry**, the application pairs precision data dense layouts with tabular typography, night-vision modes, low-bandwidth satellite SMS dispatching, and AI-assisted operational advice.

---

## 📐 Typographic & Aesthetic Design System

The visual identity follows a strict **tactical intelligence aesthetic**:

* **Display / Callouts**: `Chakra Petch` (Geometric, angular tactical headers)
* **Body / Interface**: `IBM Plex Sans` (Clean, legible data density)
* **Telemetry / Metrics**: `IBM Plex Mono` (Tabular numeric alignment, GPS coordinates, timestamps)

### Key Aesthetic Features
* **Tactical Night-Vision Mode (NVG)**: Phosphor green CRT scanline filter overlay for low-light night field ops with high-contrast glowing radar markers.
* **Low-Saturation Neutral Palette**: High contrast dark slate backgrounds (`slate-900`/`slate-950`) combined with domain-specific status accents (`emerald-500` for active link, `amber-500` for warning, `red-600` for critical/SOS).

---

## ⚡ Core Operational Features

1. **Tactical Map Workspace**:
   - Interactive radar canvas with hazard zone overlays (Marikina Basin / Sector 04).
   - **Night-Vision (NVG) Toggle**: One-click CRT phosphor green filter with custom ping halos.
   - **Waypoint Plotting**: `Shift + Click` anywhere on the map to drop custom field waypoints.
   - Category filtering: Incidents, Responding Units, Evacuation Centers.

2. **Offline-First Telemetry & Satellite Buffer**:
   - Simulated network dropouts with local action queuing.
   - Bi-directional buffer synchronization with timestamp logs.

3. **Depot Logistics & Inventory Tracker**:
   - Real-time stock indicators for food packs, medical kits, and capacity percentages across Laguna/Cebu depots.
   - Live editing and instant critical threshold alerts.

4. **Volunteer Field Deployment**:
   - Field observation submission with simulated GPS verification and photo upload authentication.
   - Safety check-in status toggling (`RESOLVED SAFE / ACTIVE`).

5. **Survivor Beacon & Locator Monitor**:
   - Primary **BROADCAST SOS** key with visual alarm pulse.
   - Encrypted low-bandwidth satellite SMS dispatch modal.

6. **Team Comms & Gemini 3.5 AI Advisor**:
   - Secure CH-9 satellite chat loop.
   - **Server-Side Gemini 3.5 Flash Integration** (`/api/advisor`) delivering concise (max 80-word, 3-bullet) risk evaluations with fallback cached telemetry when offline.

---

## 📦 Dependencies & Tech Stack

### Frontend Architecture
* **React 18+** & **Vite**
* **Tailwind CSS v4**: Extended with custom typography tokens (`--font-display`, `--font-sans`, `--font-mono`)
* **Lucide React**: Vector tactical icon set
* **Google Fonts**: IBM Plex Sans, IBM Plex Mono, Chakra Petch

### Backend & Server Infrastructure
* **Express v4**: Standalone Node server (`server.ts`)
* **`@google/genai`**: Server-side Google GenAI SDK initialized lazily
* **`esbuild` & `tsx`**: Server compilation and bundled CommonJS execution (`dist/server.cjs`)
* **`dotenv`**: Environment key management

---

## 🔮 Proposed Future Features & Roadmap

1. **Mesh P2P Local Networking**:
   - Integrate WebRTC and Bluetooth Low Energy (BLE) / Wi-Fi Direct protocols so field responders can sync telemetry device-to-device without active cellular tower access.
2. **GIS & Vector Tile Layering**:
   - Integrate Mapbox GL JS / Leaflet with local offline MBTiles vector caching for topographical contour maps and building footprint layers.
3. **Voice-over-IP (VoIP) & Push-To-Talk (PTT)**:
   - WebRTC audio stream channels simulating tactical radio walkie-talkie loops between field units and base command.
4. **Predictive Flood Elevation AI**:
   - Dynamic river height simulation modeling water flow vectors against PAGASA rainfall forecasts using Gemini or any LLM models grounding fine-tuned for weather related analysis.

---

## 🛠️ Code Refactors to Revisit

1. **State Management Extraction**:
   - Currently, state resides primarily in `App.tsx` and prop-drilled down to components. Refactor to **Zustand** or **React Context** modules (`useIncidentsStore`, `useSuppliesStore`, `useBeaconStore`).
2. **IndexedDB Local Storage Integration**:
   - Upgrade memory-backed `syncQueue` offline buffer to **Dexie.js** (IndexedDB wrapper) for durable persistence across browser restarts.
3. **Component Decomposition**:
   - Split `MapWorkspace.tsx` and `SuppliesTracker.tsx` into modular sub-views (`MapFilterBar`, `MapPinMarker`, `DepotCardItem`, `EditStockModal`).

---

## 📈 Scaling & Production Considerations

1. **PostgreSQL + PostGIS Cloud SQL**:
   - Replace in-memory array storage with PostgreSQL enabled with PostGIS extension for spatial queries (`ST_DWithin`, `ST_Distance`) to find nearest emergency units within radius.
2. **Firebase Firestore / WebSockets**:
   - Connect live WebSocket event channels for real-time multi-user operational map sync between HQ dispatchers and field responders.
3. **Edge Worker API Caching**:
   - Deploy backend API proxies on Cloudflare Workers / Cloud Run with aggressive response caching for weather advisory queries in low-bandwidth regions.
