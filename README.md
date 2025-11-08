# Optimizer - Progressive Web Game

Ein mobile-first Progressive Web App (PWA) Spiel mit Three.js, das auf allen Geräten läuft und Web Push Benachrichtigungen unterstützt.

## 🎮 Features

- **Progressive Web App**: Installierbar auf allen Plattformen (iOS, Android, Desktop)
- **Mobile-First Design**: Optimiert für Smartphones und Tablets
- **Three.js Integration**: Animiertes Logo mit 3D-Grafiken
- **Level-System**: 11 Level (0-10) mit Fortschrittsverfolgung
- **Web Push Benachrichtigungen**: Benachrichtigungen über abgeschlossene Level
- **Offline-Fähigkeit**: Service Worker für Offline-Nutzung
- **React + TypeScript**: Moderne Web-Technologien

## 🚀 Installation

### Voraussetzungen

- Node.js 16 oder höher
- npm oder yarn

### Setup

1. In den Frontend-Ordner wechseln:
```bash
cd Frontend
```

2. Dependencies installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm run dev
```

4. Browser öffnen:
   - **Lokal**: `http://localhost:3000`
   - **Im Netzwerk (von anderen Geräten)**: `http://192.168.0.209:3000`
   
   ⚠️ **Wichtig**: Stelle sicher, dass beide Geräte im gleichen WLAN sind.
   Deine aktuelle IP-Adresse findest du mit `ipconfig` (Windows) oder `ifconfig` (Mac/Linux).

### Production Build

```bash
npm run build
```

Die gebauten Dateien befinden sich im `dist` Verzeichnis.

## 📁 Projektstruktur

```
Frontend/
├── public/                     # Statische Assets
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── AnimatedLogo.tsx   # 3D animiertes Logo
│   │   └── AnimatedLogo.css
│   ├── pages/
│   │   ├── HomePage.tsx       # Startseite (/home)
│   │   ├── HomePage.css
│   │   ├── Login.tsx          # Login Seite
│   │   ├── Register.tsx       # Registrierung
│   │   ├── GamePage.tsx       # Spiel Seite
│   │   ├── GamePage.css
│   │   └── Auth.css           # Shared Auth Styles
│   ├── utils/
│   │   ├── notificationService.ts  # Web Push Service
│   │   └── levelService.ts         # Level Management
│   ├── App.tsx                # Haupt-App Komponente
│   ├── main.tsx               # Entry Point
│   ├── serviceWorker.ts       # PWA Service Worker
│   └── index.css              # Globale Styles
├── index.html                 # HTML Template
├── package.json               # Dependencies
├── vite.config.ts             # Vite Config (PWA)
└── tsconfig.json              # TypeScript Config
```

## 🎯 Routen

- `/` - Startseite (redirect zu /home)
- `/home` - Hauptseite mit animiertem Logo
- `/login` - Login Seite
- `/register` - Registrierung
- `/game` - Spielseite mit Level-Übersicht

## 📱 PWA Features

### Installation

Das Spiel kann als PWA installiert werden:

- **iOS**: Safari → Teilen → Zum Home-Bildschirm
- **Android**: Chrome → Menü → App installieren
- **Desktop**: Browser → Installieren Button

### Service Worker

Der Service Worker ermöglicht:
- Offline-Funktionalität
- Schnelleres Laden
- Hintergrund-Updates

### Web Push Benachrichtigungen

Benachrichtigungen funktionieren über:
- `notificationService.ts` - Verwaltung der Benachrichtigungen
- Automatische Permission-Anfrage
- Benachrichtigungen bei Level-Abschluss

**Wichtig**: Für produktiven Einsatz benötigen Sie:
- VAPID-Schlüssel (Public & Private Key)
- HTTPS
- Backend für Push-Subscriptions

## 🎨 Design

### Mobile-First

Alle Komponenten sind für mobile Geräte optimiert:
- Touch-freundliche Buttons (min. 44x44px)
- Responsive Grid-Layouts
- Optimierte Schriftgrößen
- Smooth Scroll-Verhalten

### Breakpoints

- Mobile: < 768px (Standard)
- Tablet: ≥ 768px
- Desktop: ≥ 1024px

### Farben

- Primär: `#667eea` (Lila)
- Sekundär: `#764ba2` (Dunkellila)
- Hintergrund: Gradient von Primär zu Sekundär
- Text: Weiß auf dunklem Hintergrund

## 🎮 Level-System

### Funktionen

- **Level 0** ist initial freigeschaltet
- Maximal **Level 10** erreichbar
- Fortschritt wird in localStorage gespeichert
- XP-System für jeden abgeschlossenen Level
- Automatisches Freischalten des nächsten Levels

### Verwendung

```typescript
import { LevelService } from './utils/levelService'

// Fortschritt laden
const progress = LevelService.loadProgress()

// Level abschließen
const newProgress = LevelService.completeLevel(
  currentLevel, 
  experience, 
  progress
)

// Level freischalten
const updatedProgress = LevelService.unlockLevel(level, progress)
```

## 🔔 Benachrichtigungen

### Verwendung

```typescript
import { notificationService } from './utils/notificationService'

// Permission anfragen
await notificationService.requestPermission()

// Benachrichtigung senden
await notificationService.showNotification('Titel', {
  body: 'Nachricht'
})

// Push Subscription
await notificationService.subscribe()
```

## 🛠️ Technologien

- **React 18** - UI Framework
- **Three.js** - 3D Grafiken
- **React Three Fiber** - React Renderer für Three.js
- **React Three Drei** - Helper-Komponenten
- **React Router** - Navigation
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Vite PWA Plugin** - PWA Features
- **Workbox** - Service Worker

## 📝 TODO / Erweiterungen

- [ ] VAPID-Schlüssel generieren für Push-Benachrichtigungen
- [ ] Backend-Integration für User-Authentifizierung
- [ ] Backend für Push-Subscriptions
- [ ] Datenbank für User-Progress
- [ ] Eigene Logo-Grafik hochladen
- [ ] Weitere Level-Grafiken und Assets
- [ ] Leaderboard-Funktionalität
- [ ] Sound-Effekte und Musik

## 🔐 Produktions-Setup

Für produktiven Einsatz benötigen Sie:

1. **HTTPS** - Mandatory für PWA und Push Notifications
2. **VAPID Keys** - Für Web Push
3. **Backend** - Für Authentifizierung und Daten
4. **Domain** - Für Service Worker

### VAPID Keys generieren

```bash
npm install -g web-push
web-push generate-vapid-keys
```

Fügen Sie den Public Key in `notificationService.ts` ein.

## 📄 Lizenz

MIT

## 👨‍💻 Entwickelt mit

- React
- Three.js
- Progressive Web App Technologien
- Mobile-First Design Principles

