import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { AccountCategory } from '../types';
import { ShieldCheck, Trash2, Plus, ShieldAlert } from 'lucide-react';

export const Accounts: React.FC = () => {
  const { data, addItem, removeItem } = useFinance();
  const [name, setName] = useState('');
  const [cat, setCat] = useState<AccountCategory>('Shop');
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addItem('accts', {
      name: name.trim(),
      cat,
      note: note.trim() || undefined,
    });

    setName('');
    setNote('');
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h1>Konten & Online-Dienste</h1>
        <p className="subtext">
          Behalte im Blick, bei welchen Anbietern du registriert bist, um alte Konten leichter aufzuspüren.
        </p>
      </div>

      <div className="notice-box" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <ShieldAlert size={18} style={{ flexShrink: 0, color: 'var(--accent-gold)' }} />
        <span>
          <strong>Wichtiger Sicherheitshinweis:</strong> Trage hier niemals Passwörter oder PINs ein. Notiere lediglich den Anbieternamen und die genutzte Login-E-Mail.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <strong style={{ fontSize: '15px' }}>Dienst eintragen</strong>
        </div>

        <div className="form-group">
          <label>Anbieter / Dienst</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Amazon, PayPal, Telekom, Adobe"
            required
          />
        </div>

        <div className="form-group">
          <label>Kategorie</label>
          <select
            className="input-field"
            value={cat}
            onChange={(e) => setCat(e.target.value as AccountCategory)}
          >
            <option value="Shop">Online-Shop</option>
            <option value="Streaming">Streaming</option>
            <option value="Bank">Bank / Finanzen</option>
            <option value="Versicherung">Versicherung</option>
            <option value="Telekom">Telekommunikation</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Notiz (z. B. Login-E-Mail oder Benutzername)</label>
          <input
            className="input-field"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z. B. privat@mail.de, 2FA aktiv"
          />
        </div>

        <div className="form-group" style={{ justifyContent: 'flex-end', gridColumn: '1 / -1' }}>
          <button type="submit" className="btn-primary" style={{ height: '44px' }}>
            <Plus size={18} />
            <span>Konto speichern</span>
          </button>
        </div>
      </form>

      {data.accts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-secondary)' }}>
          <ShieldCheck size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>Noch keine Konten eingetragen. Erfasse deine Accounts zur besseren Übersicht.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {data.accts.map((a) => (
            <div key={a.id} className="data-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <b style={{ fontSize: '15px' }}>{a.name}</b>
                  <span className="badge">{a.cat}</span>
                </div>
                {a.note && <span className="subtext">{a.note}</span>}
              </div>
              <button
                onClick={() => removeItem('accts', a.id)}
                className="btn-secondary"
                style={{ padding: '7px 9px', color: 'var(--danger)', borderColor: 'transparent' }}
                title="Löschen"
                aria-label="Löschen"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
