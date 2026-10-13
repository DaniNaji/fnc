# Mein Überblick

Übersichts-App für Abos, Ratenzahlungen, Banken, Buchungen, To-dos und Konten. Alles wird manuell eingetragen: keine Bankanbindung, keine Finanzberatung, kein Verkauf. Mit Konto-Verwaltung und einer KI-Auswertung, die nur beschreibt und nichts empfiehlt.

## Status
Prototyp als einzelne statische Datei (`index.html`), ohne Backend.
- Konten und Daten liegen nur im Browser (localStorage). Die Anmeldung ist eine Demo und nicht für den Produktivbetrieb gedacht.
- Die KI-Auswertung funktioniert nur in der Claude-Artifact-Umgebung. Auf eigenem Hosting zeigt sie „nicht verfügbar".
- Impressum, Datenschutz, AGB und KI-Hinweis sind Vorlagen mit Platzhaltern in [eckigen Klammern]. Sie müssen vor einem Launch ausgefüllt und rechtlich geprüft werden.

## Lokal starten
Datei im Browser öffnen oder einen statischen Server nutzen (Anmeldung braucht einen sicheren Kontext, z. B. localhost):

    python3 -m http.server 8080

Dann http://localhost:8080 öffnen.

## Bekannte Punkte (bewusst unverändert)
- Die Schriftart wird von Google Fonts geladen. Für den Launch in der EU sollte sie selbst gehostet werden.
- Die Anmeldung ist clientseitig. Für den Betrieb braucht es ein Backend mit sicherer Authentifizierung.
