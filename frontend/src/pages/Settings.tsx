import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { api } from '../services/api';
import { User, KeyRound, Download, Trash2, AlertTriangle, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const { resetAll } = useFinance();

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPwForEmail, setCurrentPwForEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Password Change Form
  const [oldPw, setOldPw] = useState('');
  const [newPw1, setNewPw1] = useState('');
  const [newPw2, setNewPw2] = useState('');
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Export Data
  const [exportJson, setExportJson] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Delete Account
  const [delPw, setDelPw] = useState('');
  const [delMsg, setDelMsg] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      await api.updateProfile({
        name,
        email: email !== user?.email ? email : undefined,
        currentPassword: currentPwForEmail || undefined,
      });
      await refreshUser();
      setProfileMsg({ text: 'Profil erfolgreich gespeichert.', ok: true });
      setCurrentPwForEmail('');
    } catch (err: any) {
      setProfileMsg({ text: err.message, ok: false });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (newPw1.length < 10) {
      setPwMsg({ text: 'Das neue Passwort muss mindestens 10 Zeichen lang sein.', ok: false });
      return;
    }
    if (newPw1 !== newPw2) {
      setPwMsg({ text: 'Die neuen Passwörter stimmen nicht überein.', ok: false });
      return;
    }

    try {
      await api.changePassword({ oldPassword: oldPw, newPassword: newPw1 });
      setPwMsg({ text: 'Passwort erfolgreich geändert.', ok: true });
      setOldPw('');
      setNewPw1('');
      setNewPw2('');
    } catch (err: any) {
      setPwMsg({ text: err.message, ok: false });
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const data = await api.exportData();
      setExportJson(JSON.stringify(data, null, 2));
    } catch (err: any) {
      alert('Export fehlgeschlagen: ' + err.message);
    } finally {
      setExportLoading(false);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Möchtest du wirklich alle eingetragenen Daten (Abos, Raten, Buchungen, etc.) unwiderruflich leeren? Dein Konto bleibt bestehen.')) {
      try {
        await resetAll();
        alert('Alle Finanzdaten wurden zurückgesetzt.');
      } catch (err: any) {
        alert('Fehler: ' + err.message);
      }
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delPw) return;

    if (
      window.confirm(
        'Bist du absolut sicher? Dein Benutzerkonto und alle gespeicherten Daten werden unwiderruflich und DSGVO-konform gelöscht.'
      )
    ) {
      try {
        await api.deleteAccount(delPw);
        logout();
      } catch (err: any) {
        setDelMsg(err.message);
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1>Einstellungen & Daten</h1>
        <p className="subtext">
          Verwalte deine Benutzerdaten, exportiere deine Einträge oder lösche dein Konto.
        </p>
      </div>

      {/* Profil */}
      <div className="card" style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <User size={18} style={{ color: 'var(--acc)' }} />
          <h2 style={{ margin: 0, fontSize: '17px' }}>Benutzerprofil</h2>
        </div>

        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label>Name</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>E-Mail-Adresse</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {email !== user?.email && (
            <div className="form-group">
              <label>Aktuelles Passwort (zur Bestätigung der neuen E-Mail)</label>
              <input
                type="password"
                className="input-field"
                value={currentPwForEmail}
                onChange={(e) => setCurrentPwForEmail(e.target.value)}
                required
              />
            </div>
          )}

          {profileMsg && (
            <div
              style={{
                fontSize: '13.5px',
                color: profileMsg.ok ? 'var(--success)' : 'var(--danger)',
                fontWeight: 600,
              }}
            >
              {profileMsg.text}
            </div>
          )}

          <div>
            <button type="submit" className="btn-primary">
              Änderungen speichern
            </button>
          </div>
        </form>
      </div>

      {/* Passwort ändern */}
      <div className="card" style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <KeyRound size={18} style={{ color: 'var(--accent-gold)' }} />
          <h2 style={{ margin: 0, fontSize: '17px' }}>Passwort ändern</h2>
        </div>

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label>Aktuelles Passwort</label>
            <input
              type="password"
              className="input-field"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Neues Passwort (mind. 10 Zeichen)</label>
            <input
              type="password"
              className="input-field"
              value={newPw1}
              onChange={(e) => setNewPw1(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Neues Passwort wiederholen</label>
            <input
              type="password"
              className="input-field"
              value={newPw2}
              onChange={(e) => setNewPw2(e.target.value)}
              required
            />
          </div>

          {pwMsg && (
            <div
              style={{
                fontSize: '13.5px',
                color: pwMsg.ok ? 'var(--success)' : 'var(--danger)',
                fontWeight: 600,
              }}
            >
              {pwMsg.text}
            </div>
          )}

          <div>
            <button type="submit" className="btn-secondary">
              Passwort aktualisieren
            </button>
          </div>
        </form>
      </div>

      {/* Daten exportieren */}
      <div className="card" style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Download size={18} style={{ color: 'var(--acc)' }} />
          <h2 style={{ margin: 0, fontSize: '17px' }}>Meine Daten (DSGVO-Auskunft)</h2>
        </div>
        <p className="subtext" style={{ marginBottom: '14px' }}>
          Lade alle über dich gespeicherten Daten als strukturierte JSON-Datei herunter.
        </p>

        <button onClick={handleExportData} disabled={exportLoading} className="btn-secondary">
          {exportLoading ? 'Exportiere …' : 'Daten anzeigen / exportieren'}
        </button>

        {exportJson && (
          <div style={{ marginTop: '14px' }}>
            <pre
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontSize: '12px',
                maxHeight: '260px',
                overflow: 'auto',
                color: 'var(--ink)',
              }}
            >
              {exportJson}
            </pre>
          </div>
        )}
      </div>

      {/* Gefahrenzone: Daten leeren & Konto löschen */}
      <div className="card" style={{ borderColor: 'var(--danger)', background: 'var(--danger-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
          <h2 style={{ margin: 0, fontSize: '17px', color: 'var(--danger)' }}>Gefahrenbereich</h2>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p className="subtext" style={{ marginBottom: '8px' }}>
            Alle Abos, Raten, Banken und Buchungen unwiderruflich löschen, aber das Konto behalten:
          </p>
          <button onClick={handleResetData} className="btn-secondary" style={{ color: 'var(--danger)' }}>
            Alle Finanzdaten zurücksetzen
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />

        <div>
          <strong style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>
            Konto endgültig löschen
          </strong>
          <p className="subtext" style={{ marginBottom: '12px' }}>
            Löscht dein Konto, dein Login und alle damit verknüpften Datensätze dauerhaft.
          </p>

          <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <input
              type="password"
              className="input-field"
              placeholder="Passwort zur Bestätigung"
              value={delPw}
              onChange={(e) => setDelPw(e.target.value)}
              style={{ maxWidth: '280px' }}
              required
            />
            <button type="submit" className="btn-danger">
              Konto dauerhaft löschen
            </button>
          </form>

          {delMsg && (
            <div style={{ marginTop: '10px', color: 'var(--danger)', fontSize: '13px' }}>
              {delMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
