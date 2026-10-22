import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';

interface AuthProps {
  openLegal: (type: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ openLegal }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      if (password.length < 10) {
        setError('Das Passwort muss mindestens 10 Zeichen lang sein.');
        return;
      }
      if (password !== passwordConfirm) {
        setError('Die Passwörter stimmen nicht überein.');
        return;
      }
      if (!agreeTerms) {
        setError('Bitte stimme den AGB und der Datenschutzerklärung zu.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentifizierungsfehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '40px auto', padding: '0 16px' }}>
      <div className="card" style={{ padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--acc)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 800,
              marginBottom: '10px',
            }}
          >
            Ü
          </div>
          <h1>{isRegister ? 'Konto erstellen' : 'Anmelden'}</h1>
          <p className="subtext" style={{ marginTop: '4px' }}>
            {isRegister
              ? 'Verwalte deine Finanzen, Abos und Aufgaben zentral an einem Ort.'
              : 'Willkommen zurück bei Mein Überblick.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div className="form-group">
              <label>Name (optional)</label>
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein Vorname"
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label>E-Mail-Adresse</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@beispiel.de"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Passwort {isRegister ? '(mind. 10 Zeichen)' : ''}</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label>Passwort wiederholen</label>
                <input
                  type="password"
                  className="input-field"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '9px',
                  fontSize: '12.5px',
                  color: 'var(--ink-secondary)',
                  cursor: 'pointer',
                  margin: '4px 0',
                }}
              >
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: 'var(--acc)' }}
                  required
                />
                <span>
                  Ich stimme den{' '}
                  <button
                    type="button"
                    onClick={() => openLegal('agb')}
                    style={{ background: 'none', border: 'none', color: 'var(--acc)', textDecoration: 'underline', padding: 0, cursor: 'pointer', font: 'inherit' }}
                  >
                    AGB
                  </button>{' '}
                  zu und habe die{' '}
                  <button
                    type="button"
                    onClick={() => openLegal('datenschutz')}
                    style={{ background: 'none', border: 'none', color: 'var(--acc)', textDecoration: 'underline', padding: 0, cursor: 'pointer', font: 'inherit' }}
                  >
                    Datenschutzerklärung
                  </button>{' '}
                  gelesen.
                </span>
              </label>
            </>
          )}

          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--danger-bg)',
                color: 'var(--danger)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', height: '46px', marginTop: '6px' }}
          >
            {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
            <span>{loading ? 'Bitte warten …' : isRegister ? 'Registrieren' : 'Anmelden'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px' }}>
          <span style={{ color: 'var(--ink-secondary)' }}>
            {isRegister ? 'Bereits ein Konto? ' : 'Noch kein Konto? '}
          </span>
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--acc)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {isRegister ? 'Hier anmelden' : 'Jetzt registrieren'}
          </button>
        </div>
      </div>
    </div>
  );
};
