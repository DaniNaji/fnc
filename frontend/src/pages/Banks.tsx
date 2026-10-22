import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BankType } from '../types';
import { Landmark, Trash2, Plus, ShieldAlert } from 'lucide-react';

export const Banks: React.FC = () => {
  const { data, addItem, removeItem } = useFinance();
  const [name, setName] = useState('');
  const [type, setType] = useState<BankType>('Girokonto');
  const [amt, setAmt] = useState('0');
  const [iv, setIv] = useState<'Monat' | 'Quartal' | 'Jahr'>('Monat');
  const [bal, setBal] = useState('');
  const [note, setNote] = useState('');

  const eur = (n: number) =>
    n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addItem('banks', {
      name: name.trim(),
      type,
      amt: parseFloat(amt) || 0,
      iv,
      bal: bal !== '' ? parseFloat(bal) : undefined,
      note: note.trim() || undefined,
    });

    setName('');
    setAmt('0');
    setBal('');
    setNote('');
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h1>Banken & Kontomodelle</h1>
        <p className="subtext">
          Erfasse Bankgebühren und Kontostände zur besseren Monatsplanung.
        </p>
      </div>

      <div className="notice-box" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <ShieldAlert size={18} style={{ flexShrink: 0, color: 'var(--accent-gold)' }} />
        <span>
          <strong>Wichtiger Sicherheitshinweis:</strong> Trage hier niemals IBAN, Kontonummern oder Online-Banking-Zugangsdaten ein. Es reichen Bankname, Kontomodell und Gebühr.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <strong style={{ fontSize: '15px' }}>Neue Bank / Konto erfassen</strong>
        </div>

        <div className="form-group">
          <label>Bankname</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. DKB, ING, Sparkasse, Trade Republic"
            required
          />
        </div>

        <div className="form-group">
          <label>Kontoart</label>
          <select
            className="input-field"
            value={type}
            onChange={(e) => setType(e.target.value as BankType)}
          >
            <option value="Girokonto">Girokonto</option>
            <option value="Tagesgeld">Tagesgeld</option>
            <option value="Festgeld">Festgeld</option>
            <option value="Kreditkarte">Kreditkarte</option>
            <option value="Depot">Depot</option>
            <option value="Sparkonto">Sparkonto</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>

        <div className="form-group">
          <label>Kontogebühr (€)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="input-field"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            placeholder="0.00 wenn kostenlos"
          />
        </div>

        <div className="form-group">
          <label>Gebühr pro</label>
          <select
            className="input-field"
            value={iv}
            onChange={(e) => setIv(e.target.value as any)}
          >
            <option value="Monat">Monat</option>
            <option value="Quartal">Quartal</option>
            <option value="Jahr">Jahr</option>
          </select>
        </div>

        <div className="form-group">
          <label>Kontostand (€, optional)</label>
          <input
            type="number"
            step="0.01"
            className="input-field"
            value={bal}
            onChange={(e) => setBal(e.target.value)}
            placeholder="z. B. 1250.00"
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Notiz (z. B. Gebührenbefreiung ab 700 € Geldeingang)</label>
          <input
            className="input-field"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z. B. Nur für Gehaltseingang, Prämie aktiv"
          />
        </div>

        <div className="form-group" style={{ justifyContent: 'flex-end', gridColumn: '1 / -1' }}>
          <button type="submit" className="btn-primary" style={{ height: '44px' }}>
            <Plus size={18} />
            <span>Bank speichern</span>
          </button>
        </div>
      </form>

      {data.banks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-secondary)' }}>
          <Landmark size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>Noch keine Banken erfasst. Notiere deine Konten für einen klaren Überblick.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {data.banks.map((b) => {
            const hasFee = Number(b.amt) > 0;
            const hasBal = b.bal !== undefined && b.bal !== null && !isNaN(Number(b.bal));
            return (
              <div key={b.id} className="data-row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <b style={{ fontSize: '15px' }}>{b.name}</b>
                    <span className="badge">{b.type}</span>
                  </div>
                  <span className="subtext">
                    {hasFee ? `${eur(Number(b.amt))} / ${b.iv}` : 'Gebührenfrei'}
                    {hasBal ? ` · Stand: ${eur(Number(b.bal))}` : ''}
                    {b.note ? ` · ${b.note}` : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {hasBal && <b style={{ fontSize: '15px' }}>{eur(Number(b.bal))}</b>}
                  <button
                    onClick={() => removeItem('banks', b.id)}
                    className="btn-secondary"
                    style={{ padding: '7px 9px', color: 'var(--danger)', borderColor: 'transparent' }}
                    title="Löschen"
                    aria-label="Löschen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
