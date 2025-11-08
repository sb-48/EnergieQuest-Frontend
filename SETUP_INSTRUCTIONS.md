# Setup-Anleitung für Optimizer

## 🚀 Schnellstart

### 1. Installation

```bash
cd Frontend
npm install
```

### 2. Entwicklungsserver starten

```bash
npm run dev
```

Die App läuft auf: `http://localhost:3000`

### 3. Erstes Ausführen

Beim ersten Ausführen kann es zu einer Fehlermeldung kommen, da die PWA-Icons noch nicht vorhanden sind. Das ist normal!

## 📝 Wichtige Setup-Schritte

### Logo hochladen

Die App verwendet aktuell ein animiertes 3D-Logo. Sie können Ihr eigenes Logo hinzufügen:

1. Platzieren Sie Ihre Logo-Datei im `public/` Ordner
2. Beispiel: `public/logo.png`
3. Bearbeiten Sie `src/components/AnimatedLogo.tsx` und ersetzen Sie die 3D-Animation durch Ihr Logo:

```tsx
<div className="logo-placeholder">
  <img src="/logo.png" alt="Optimizer Logo" className="custom-logo" />
</div>
```

### PWA Icons erstellen

Sie benötigen PWA-Icons für die Installation. Erstellen Sie:

- `public/pwa-192x192.png` (192x192 Pixel)
- `public/pwa-512x512.png` (512x512 Pixel)
- `public/favicon.ico` (32x32 Pixel)
- `public/apple-touch-icon.png` (180x180 Pixel)

Ein Tool wie [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) kann hier helfen.

### Web Push Benachrichtigungen (optional)

Für produktiven Einsatz:

1. **VAPID Keys generieren**:
```bash
npm install -g web-push
web-push generate-vapid-keys
```

2. **Public Key eintragen** in `src/utils/notificationService.ts`:
```typescript
const vapidPublicKey = 'IHRE_PUBLIC_KEY_HIER'
```

3. **HTTPS aktivieren** in `vite.config.ts` (für Produktion):
```typescript
server: {
  https: true
}
```

## 🎮 Funktionalität

### Level-System

- Start: Level 0
- Maximum: Level 10
- Fortschritt wird in localStorage gespeichert
- Automatische Freischaltung des nächsten Levels

### Benachrichtigungen

- Automatische Permission-Anfrage auf der Startseite
- Benachrichtigungen bei Level-Abschluss
- Funktioniert auch im Hintergrund (wenn PWA installiert ist)

### Progressive Web App

- Installierbar auf iOS, Android und Desktop
- Offline-Fähigkeit über Service Worker
- Automatische Updates

## 📱 Testing auf Mobilgeräten

### Lokales Netzwerk

1. Finden Sie Ihre lokale IP-Adresse:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`

2. Starten Sie den Dev-Server mit Host:
```bash
npm run dev -- --host
```

3. Öffnen Sie auf Ihrem Mobilgerät:
```
http://IHRE_IP:3000
```

### Chrome DevTools

1. Öffnen Sie Chrome DevTools (F12)
2. Klicken Sie auf das Gerätesymbol
3. Wählen Sie ein Gerät (z.B. iPhone, iPad)
4. Testen Sie die App

## 🐛 Troubleshooting

### "sw.js not found" Fehler

Dieser Fehler tritt beim ersten Build auf. Lösen Sie durch:
```bash
npm run build
npm run dev
```

### Benachrichtigungen funktionieren nicht

- Stellen Sie sicher, dass Sie `https://` verwenden (wichtig für lokales Testing)
- Prüfen Sie die Browser-Berechtigungen
- Chrome und Firefox unterstützen Web Push nativ
- Safari benötigt iOS 16.4+ oder macOS

### Three.js Animation ist langsam

- Reduzieren Sie die Anzahl der Geometrien in `AnimatedLogo.tsx`
- Nutzen Sie `useFrame` für Performance-Optimierung
- Reduzieren Sie die Polygon-Anzahl

### PWA lässt sich nicht installieren

1. Prüfen Sie die Manifest-Datei: `dist/manifest.webmanifest`
2. Stellen Sie sicher, dass alle Icons vorhanden sind
3. Nutzen Sie HTTPS in Produktion
4. Prüfen Sie die Browser-Konsole auf Fehler

## 📦 Production Build

```bash
npm run build
```

Die gebauten Dateien finden Sie im `dist/` Ordner.

### Deploy auf Vercel

```bash
npm install -g vercel
vercel
```

### Deploy auf Netlify

1. Erstellen Sie `netlify.toml`:
```toml
[build]
  command = "cd Frontend && npm run build"
  publish = "Frontend/dist"
```

2. Deploy mit Netlify CLI oder Dashboard

## 🔗 Wichtige Links

- **React**: https://react.dev
- **Three.js**: https://threejs.org
- **Vite**: https://vitejs.dev
- **PWA**: https://web.dev/progressive-web-apps/
- **Web Push**: https://web.dev/push-notifications-overview/

## 📧 Support

Bei Fragen oder Problemen prüfen Sie:
1. Browser-Konsole auf Fehler
2. Network-Tab auf fehlende Assets
3. Application-Tab auf Service Worker Status

Viel Erfolg! 🎉

