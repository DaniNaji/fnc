import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface LegalProps {
  type: string;
  onBack: () => void;
}

export const Legal: React.FC<LegalProps> = ({ type, onBack }) => {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <button
        onClick={onBack}
        className="btn-secondary"
        style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Zurück</span>
      </button>

      {type === 'impressum' && (
        <div>
          <h1>Impressum</h1>
          <div className="notice-box" style={{ margin: '14px 0 20px' }}>
            Vorlage: Trage vor einem offiziellen App-Store-Launch deine individuellen Betreiberangaben ein.
          </div>

          <h3>Angaben gemäß § 5 DDG</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            [Vor- und Nachname bzw. Firmenname mit Rechtsform]<br />
            [Straße und Hausnummer]<br />
            [PLZ und Ort, z. B. Berlin, Deutschland]
          </p>

          <h3>Kontakt</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            E-Mail: [kontakt@meinueberblick.de]<br />
            Telefon: [optional]
          </p>

          <h3>Umsatzsteuer-ID</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            [Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG, falls vorhanden]
          </p>

          <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            [Name und Anschrift wie oben]
          </p>

          <h3>Rechtlicher Hinweis zur Dienstleistung</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            „Mein Überblick“ ist ein persönliches Organisations- und Übersichtswerkzeug. Die App bietet keine Finanz-, Anlage-, Steuer- oder Rechtsberatung und vermittelt oder verkauft keine Finanzprodukte.
          </p>
        </div>
      )}

      {type === 'datenschutz' && (
        <div>
          <h1>Datenschutzerklärung</h1>
          <div className="notice-box" style={{ margin: '14px 0 20px' }}>
            Datenschutz nach EU-Datenschutz-Grundverordnung (DSGVO).
          </div>

          <h3>1. Verantwortlicher</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            [Name und Anschrift wie im Impressum angegeben], E-Mail: [datenschutz@meinueberblick.de]
          </p>

          <h3>2. Welche Daten verarbeitet werden</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            • <strong>Kontodaten:</strong> E-Mail-Adresse, Name, Passwort ausschließlich als kryptografischer Einweg-Hash (bcrypt).<br />
            • <strong>Finanzübersichten:</strong> Vom Nutzer selbst manuell eingetragene Daten (Abonnements, Ratenverpflichtungen, Bankbezeichnungen, Konten, Buchungen und Notizen).<br />
            • <strong>Wichtig:</strong> Wir erfragen und speichern niemals Kontonummern, IBANs, Kreditkartennummern oder PINs von echten Bankinstituten. Es besteht keinerlei Schnittstelle zu Bankkonten (PSD2).
          </p>

          <h3>3. Zwecke und Rechtsgrundlagen</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            • Bereitstellung des Benutzerkontos und Datensynchronisation: Art. 6 Abs. 1 lit. b DSGVO.<br />
            • KI-Auswertung: Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO, die durch das aktive Anklicken von „Analyse jetzt starten“ erteilt wird.
          </p>

          <h3>4. KI-Verarbeitung (Mistral AI / Mock)</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            Im Rahmen der KI-Analyse werden anonymisierte Summen und Kategorien an den europäischen KI-Anbieter Mistral AI (Mistral AI SAS, Paris, Frankreich) übertragen. Es werden keine Passwörter oder Bankverbindungsdaten übermittelt.
          </p>

          <h3>5. Betroffenenrechte</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            Du hast jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO) und Datenübertragbarkeit (Art. 20 DSGVO). Über die Einstellungen kannst du deine Daten mit einem Klick vollständig exportieren oder dein gesamtes Konto unwiderruflich löschen.
          </p>
        </div>
      )}

      {type === 'agb' && (
        <div>
          <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
          <div className="notice-box" style={{ margin: '14px 0 20px' }}>
            Musterbedingungen für die Nutzung der App „Mein Überblick“.
          </div>

          <h3>1. Leistungsgegenstand</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            Der Betreiber stellt eine Softwareanwendung bereit, mit der Nutzer persönliche Fixkosten, Raten, Buchungen und Online-Dienste selbst erfassen und übersichtlich darstellen können.
          </p>

          <h3>2. Ausschluss von Finanz- und Anlageberatung</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            Die App und die darin generierten KI-Zusammenfassungen stellen zu keinem Zeitpunkt eine Anlageberatung, Vermögensverwaltung, Steuer- oder Rechtsberatung dar. Sämtliche finanzielle Entscheidungen verbleiben in der alleinigen Verantwortung des Nutzers.
          </p>

          <h3>3. Pflichten des Nutzers</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            Der Nutzer verpflichtet sich, seine Zugangsdaten vor Dritten geheim zu halten und keine sensiblen Zahlungsdaten (wie Online-Banking-PINs oder echte TANs) in Freitextfeldern zu hinterlegen.
          </p>
        </div>
      )}

      {type === 'ki' && (
        <div>
          <h1>Hinweis zum KI-Einsatz & Transparenz</h1>
          <div className="notice-box" style={{ margin: '14px 0 20px' }}>
            Transparenzerklärung gemäß der europäischen KI-Verordnung (EU AI Act).
          </div>

          <h3>Wo KI zum Einsatz kommt</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            Künstliche Intelligenz wird in dieser Anwendung ausschließlich im Bereich „Auswertung“ eingesetzt, um eingetragene Fixkosten und Buchungen zusammenzufassen und neutrale Reflexionsfragen zu formulieren.
          </p>

          <h3>Modell & Anbieter</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            Als KI-Engine kommt Mistral AI (europäischer KI-Anbieter mit Servern innerhalb der EU) oder im Entwicklungsmodus ein lokaler Mock-Algorithmus zum Einsatz.
          </p>

          <h3>Was die KI garantiert nicht tut</h3>
          <p className="subtext" style={{ margin: '6px 0 16px' }}>
            • Die KI trifft keine automatisierten Entscheidungen mit rechtlicher oder finanzieller Wirkung über dich.<br />
            • Sie bewertet weder Kreditwürdigkeit (Scoring) noch Bonität.<br />
            • Sie empfiehlt weder Bankprodukte, Kredite, Versicherungen noch Kündigungen.
          </p>
        </div>
      )}
    </div>
  );
};
