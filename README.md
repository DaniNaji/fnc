# Mein Überblick - Fullstack-Finanzapp (Web & Mobile)

Übersichts-App für Abonnements, Ratenzahlungen, manuelle Buchungen, Banken, To-dos und Konten mit smarter KI-Auswertung. Entwickelt mit sauberer Architektur, Docker-Unterstützung und nativer Lauffähigkeit für Google Play Store und Apple App Store.

---

## 🏛 Architektur-Übersicht

```
fnc/
├── backend/                       # Node.js + Express + TypeScript (Clean Architecture)
│   ├── src/
│   │   ├── config/                # Typisierte Umgebungskonfiguration (.env)
│   │   ├── controllers/           # Auth, Finance & KI-Controller
│   │   ├── middleware/            # JWT-Auth, Zod-Validierung, Error-Handling, CORS
│   │   ├── models/                # Datenstrukturen & TypeScript-Interfaces
│   │   ├── repositories/          # Entkoppelte Datenbankschicht (Repository-Pattern)
│   │   ├── routes/                # REST-Routen (/api/auth, /api/finances, /api/ai)
│   │   ├── services/              # Business Logic & Mistral KI-Service (Mock & Live)
│   │   └── server.ts              # Server-Einstiegspunkt
│   ├── Dockerfile                 # Multi-Stage Build (Node 22 Alpine)
│   └── .env.example
│
├── frontend/                      # React 19 + TypeScript + Vite + Capacitor 7
│   ├── src/
│   │   ├── components/            # Header, Sidebar (Desktop), BottomNav (Mobile), Modals
│   │   ├── context/               # AuthContext, FinanceContext, ThemeContext
│   │   ├── pages/                 # Dashboard, Abos, Raten, Buchungen, To-dos, Banken, KI, Settings
│   │   ├── services/              # API-Client mit automatischer JWT-Autorisierung
│   │   ├── types/                 # Frontend-Datenmodelle
│   │   └── index.css              # Designsystem (Dark/Light Mode, Safe-Areas, Animationen)
│   ├── capacitor.config.ts        # Native Konfiguration für Google Play & App Store
│   ├── nginx.conf                 # Nginx Reverse Proxy & SPA-Routing
│   └── Dockerfile                 # Production Nginx Container
│
├── docker-compose.yml             # 1-Klick-Stack (Backend + Frontend + Daten-Persistenz)
├── APP_STORE_GUIDE.md             # Schritt-für-Schritt-Anleitung für Play Store & App Store
└── README.md
```

---

## 🤖 KI-Funktion (Mistral AI & Mock-Modus)

Die KI-Auswertung analysiert Kostenblöcke, Überschneidungen und formuliert neutrale Selbstreflexionsfragen (streng konform mit DSGVO & EU AI Act).

### 1. Standard: Mock-Modus (Aktive Testdaten)
Standardmäßig ist der Mock-Modus aktiv (`USE_MOCK_AI=true`). Er berechnet dynamisch alle Auswertungen anhand deiner echten eingetragenen Zahlen, ohne dass ein API-Guthaben oder ein Key bei Mistral benötigt wird.

### 2. Live Mistral API aktivieren
Wenn du bereit bist, die echte Mistral-API zu nutzen:
1. Öffne `backend/.env` (oder passe die Umgebungsvariablen in `docker-compose.yml` an).
2. Setze:
   ```env
   USE_MOCK_AI=false
   MISTRAL_API_KEY=dein_echter_mistral_api_key
   MISTRAL_MODEL=mistral-small-latest
   ```
3. Starte das Backend neu – die App schaltet automatisch auf Mistral um.

---

## 🐳 Start mit Docker (Empfohlen)

Mit Docker und Docker Compose startest du das komplette System (Frontend auf Port 3000, Backend auf Port 5000) mit einem einzigen Befehl:

```bash
docker compose up --build -d
```

- **Frontend (Web-App):** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Persistente Daten:** Liegen im gemounteten Verzeichnis `./data`.

Container stoppen:
```bash
docker compose down
```

---

## 💻 Lokale Entwicklung ohne Docker

### 1. Backend starten
```bash
cd backend
npm install
npm run dev
```
Das Backend läuft unter `http://localhost:5000`.

### 2. Frontend starten
```bash
cd frontend
npm install
npm run dev
```
Das Frontend läuft unter `http://localhost:3000` und leitet API-Aufrufe automatisch per Proxy an das Backend weiter.

---

## 📱 Google Play Store & Apple App Store

Die Anwendung ist dank Capacitor voll responsiv und für App Stores vorbereitet:
- **Mobile Bottom Navigation** & Haptik-Support
- **Safe-Area-Insets** für iPhone-Notches & Android-Statusleisten
- **PWA Manifest** mit installierbaren App-Icons

Detaillierte Schritt-für-Schritt-Bauanleitungen für Android Studio und Xcode findest du in:
👉 **[APP_STORE_GUIDE.md](APP_STORE_GUIDE.md)**
