# 📱 Leitfaden: Veröffentlichung im Google Play Store & Apple App Store

Diese Webanwendung ist mit **Capacitor 7** und mobilen Best-Practices (Safe-Area-Insets, Viewport-Fit, Touch-Optimierung, Bottom-Navigation und PWA-Fähigkeit) ausgestattet. Dadurch kann sie direkt als native Android- und iOS-App gebaut und in den Stores eingereicht werden.

---

## 🛠 Voraussetzungen

| Plattform | Voraussetzungen |
|---|---|
| **Android (Google Play)** | [Android Studio](https://developer.android.com/studio) installiert, Java JDK 17+ |
| **iOS (Apple App Store)** | macOS mit [Xcode](https://developer.apple.com/xcode/) installiert, Apple Developer Account |

---

## 🚀 Schritt 1: Backend-URL für die App konfigurieren

Bevor du die App für die Stores baust, erstelle in `frontend/.env.production` deine echte Backend-Adresse (z. B. auf deinem Server oder Docker-Host):

```env
VITE_API_URL=https://api.dein-ueberblick.de
```

---

## 🤖 Schritt 2: Android (Google Play Store)

### 1. Android-Projekt initialisieren
Führe im Ordner `frontend` folgenden Befehl aus:

```bash
cd frontend
npm run build
npx cap add android
npx cap sync
```

### 2. Projekt in Android Studio öffnen
```bash
npx cap open android
```

### 3. App-Berechtigungen & Datenschutz
Da die App reine manuelle Eingaben verarbeitet und **keine** automatische Bankanbindung (PSD2) oder SMS-Auslesung nutzt, benötigt sie lediglich Standard-Internetberechtigungen.

In `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### 4. Release Build (.aab) erzeugen
1. In Android Studio im Menü: **Build** ➜ **Generate Signed Bundle / APK...**
2. **Android App Bundle (.aab)** wählen.
3. Einen Keystore erstellen oder deinen bestehenden Keystore wählen.
4. Release-Typ **release** auswählen und signieren.
5. Das fertige `.aab` in der **Google Play Console** hochladen:
   - **Kategorie:** Finanzen / Produktivität
   - **Finanzfunktion:** Manuelles Haushaltsbuch / Fixkostenübersicht
   - **Datenschutz-URL:** Verlinke auf deine `/datenschutz`-Seite.

---

## 🍏 Schritt 3: iOS (Apple App Store)

> **Hinweis:** Für iOS-Builds wird ein Mac mit aktuellem Xcode benötigt.

### 1. iOS-Projekt initialisieren
Führe im Ordner `frontend` aus:

```bash
cd frontend
npm run build
npx cap add ios
npx cap sync
```

### 2. Projekt in Xcode öffnen
```bash
npx cap open ios
```

### 3. Einstellungen in Xcode
1. Wähle im Navigator das Projekt **App** ➜ Reiter **Signing & Capabilities**.
2. Wähle dein **Team** (Apple Developer Account).
3. Bundle Identifier prüfen: `de.meinueberblick.app`.
4. App-Icon: Über den Asset-Catalog (`AppIcon`) das Icon einpflegen.

### 4. Apple Review & Datenschutz (App Privacy)
- **App-Tracking:** Nein (keine Werbenetzwerke, kein Tracking).
- **Erfasste Daten:**
  - *Benutzer-ID / E-Mail:* Für Authentifizierung & Kontowiederherstellung.
  - *Finanzdaten:* Manuelle Eingaben des Nutzers (nicht für Marketing, keine Weitergabe an Dritte).
- **EU AI Act & Mistral-Hinweis:** Im Prüfungsfragebogen angeben, dass die KI-Funktion rein beschreibend ist und keine automatisierten Finanzentscheidungen oder Kreditbewertungen trifft.

### 5. Archivieren & Hochladen
1. In Xcode oben als Zielgerät **Any iOS Device (arm64)** auswählen.
2. Im Menü: **Product** ➜ **Archive**.
3. Nach Abschluss **Distribute App** ➜ **App Store Connect** auswählen.

---

## 🔄 Updates einspielen

Wenn du Änderungen am Frontend vornimmst, aktualisierst du die nativen Projekte mit einem einzigen Befehl:

```bash
npm run cap:sync
```
Danach in Android Studio bzw. Xcode den neuen Release-Build generieren.
