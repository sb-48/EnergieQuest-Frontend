# Logo Animation Guide

## 🎬 Animation Overview

Das Optimizer-Logo verwendet eine komplexe Multi-Layer-Animation mit mehreren spektakulären Effekten.

## ✨ Animation Features

### 1. **Logo Slide-In (von oben)**
- **Start**: Unsichtbar, 100px über dem Ziel, 50% skaliert
- **Ende**: Sichtbar, am Ziel, 100% skaliert
- **Dauer**: 1.2 Sekunden
- **Easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Bounce-Effekt)
- **Typ**: Netflix-inspiriert

### 2. **Subtile Glitch-Effekte**
- **Frequenz**: Alle 5 Sekunden
- **Dauer**: 3 Frames (sehr kurz)
- **Effekt**: Horizontaler Shift mit Farbwechsel
- **Typ**: Gaming-Inspiriert (Cyberpunk)

### 3. **PlayStation-Style Shine auf Text**
- **Shine-Animation**: Horizontaler Sweep von links nach rechts
- **Dauer**: 3 Sekunden
- **Typ**: Glanz-Reflexion wie bei PlayStation/Apple
- **Text**: "TABAYZUL" mit einzelnen Buchstaben

### 4. **Letter-by-Letter Animation**
- **Start**: Unsichtbar, nach unten verschoben, 50% skaliert
- **Zwischen-Schritt**: Nach oben bounce, 110% skaliert
- **Ende**: Am Ziel, 100% skaliert
- **Typ**: Netflix-Style individual letter entrance
- **Delay**: Jeder Buchstabe 0.1s nach dem vorherigen

### 5. **Floating Animation**
- **Typ**: Kontinuierlich schwebend
- **Bewegung**: Vertikal -10px bis +10px
- **Dauer**: 3 Sekunden pro Zyklus
- **Effekt**: Schwebendes Logo

### 6. **Glow Pulse**
- **Typ**: Radial Gradient Glow
- **Frequenz**: 2 Sekunden
- **Skalierung**: 100% bis 110%
- **Opacity**: 0.6 bis 1.0

### 7. **Particle System**
- **Anzahl**: 20 Partikel
- **Farbe**: Lila Gradient (#667eea → #764ba2)
- **Bewegung**: Von unten nach oben
- **Timing**: Randomisiert für jedes Partikel
- **Typ**: Magic/Sparkle-Effekt

### 8. **Background Gradient Animation**
- **Typ**: Rotierender Radial Gradient
- **Dauer**: 8 Sekunden
- **Rotation**: 180° Hin- und Rückweg
- **Skalierung**: 100% bis 150%
- **Opacity**: 0.5 bis 0.8

## 🎨 Technische Details

### Animation Timing

```css
Logo Slide-In:    0ms - 1200ms
Text Slide-In:    300ms - 1100ms (0.3s delay)
Letters:          100ms - 900ms (staggered 0.1s each)
Float Loop:       3000ms continuous
Glow Pulse:       2000ms continuous
Particles:        2000-4000ms random
Glitch:           5000ms loop
Shine:            3000ms loop
Gradient:         8000ms loop
```

### Z-Index Layers (von unten nach oben)

1. **Layer 0**: Gradient Overlay
2. **Layer 1**: Logo Glow
3. **Layer 2**: Logo Image / Text Container
4. **Layer 3**: Particles

### Easing Functions

- **Logo Entrance**: `cubic-bezier(0.34, 1.56, 0.64, 1)` - Bounce
- **Text Entrance**: `ease-out` - Smooth deceleration
- **Letters**: `ease-out` - Quick bounce
- **Continuous**: `ease-in-out` - Smooth loop

## 📱 Responsive Behavior

### Mobile (< 768px)
- Logo: 90% width
- Text: 2rem font-size
- Spacing: 1.5rem margin

### Tablet (768px - 1024px)
- Logo: 80% width
- Text: 3rem font-size
- Spacing: 2rem margin

### Desktop (> 1024px)
- Logo: 70% width, max 500px
- Text: 4rem font-size
- Hover-Effekte aktiv
- Erweiterte bounce animation

## 🎯 Animation Principle

Die Animation folgt dem **Cascading Animation Pattern**:

1. **Logo** erscheint zuerst (Haupt-Focus)
2. **Text** folgt nach 0.3s (Sekundär-Focus)
3. **Letters** erscheinen nacheinander (Detail-Focus)
4. **Continuous Effects** laufen im Hintergrund (Atmosphere)

## 🔧 Customization

### Animation Speed ändern

```css
/* Schneller: */
.logo-wrapper {
  transition: all 0.6s ...; /* statt 1.2s */
}

/* Langsamer: */
.logo-wrapper {
  transition: all 2s ...; /* statt 1.2s */
}
```

### Glitch-Effekt verstärken

```css
@keyframes glitch {
  91% {
    transform: translateX(10px); /* statt 2px */
  }
  92% {
    transform: translateX(-10px); /* statt -2px */
  }
}
```

### Mehr Partikel

```tsx
{Array.from({ length: 50 }).map(...)} // statt 20
```

### Glow-Farbe ändern

```css
.logo-glow {
  background: radial-gradient(circle, rgba(255, 0, 0, 0.6) 0%, transparent 70%);
  /* Rot statt Lila */
}
```

## 🐛 Performance Tipps

- **GPU Acceleration**: Alle Transforms nutzen `transform` (nicht `top/left`)
- **Will-change**: Nicht benötigt (Browser-optimiert)
- **Repaints**: Minimiert durch transform-basierte Animationen
- **Particles**: Limitiert auf 20 für Performance
- **Animation-count**: Continuous loops sind effizient

## 🎥 Demo Timing

```
0.0s:  Logo startet slide-in von oben
0.3s:  Text startet slide-in von unten
0.4s-1.2s: Letters erscheinen nacheinander
0.5s+: Partikel beginnen zu generieren
1.0s:  Alle Animationen stabil
1.5s:  Erste Glitch (wenn startet)
3.0s:  Erstes Particle reset
5.0s:  Erster Glitch nach Glitch-Loop
```

## 💡 Inspiration

- **Netflix**: Letter-by-letter entrance, Slide-in
- **PlayStation**: Shine effect, Text styling
- **Apple**: Smooth transitions, Glow effects
- **Cyberpunk Games**: Glitch effects, Particles
- **Magic Animations**: Floating, Glow pulses

