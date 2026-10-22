import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Subscription, IntervalType, SubscriptionCategory } from '../types';
import { Trash2, Plus, Repeat } from 'lucide-react';

export const Subscriptions: React.FC = () => {
  const { data, addItem, removeItem } = useFinance();
  const [name, setName] = useState('');
  const [amt, setAmt] = useState('');
  const [iv, setIv] = useState<IntervalType>('Monat');
  const [next, setNext] = useState(new Date().toISOString().slice(0, 10));
  const [cat, setCat] = useState<SubscriptionCategory>('Streaming');

  const eur = (n: number) =>
    n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amt) return;

    await addItem('subs', {
      name: name.trim(),
      amt: parseFloat(amt),
      iv,
      next,
      cat,
    });

    setName('');
    setAmt('');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1>Abonnements</h1>
          <p className="subtext">Behalte regelmäßige Zahlungen, Intervalle und Kündigungstermine im Blick.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <strong style={{ fontSize: '15px' }}>Neues Abo eintragen</strong>
        </div>

        <div className="form-group">
          <label>Name des Abos</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Netflix, Spotify, BahnCard"
            required
          />
        </div>

        <div className="form-group">
          <label>Betrag (€)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="input-field"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            placeholder="z. B. 12.99"
            required
          />
        </div>

        <div className="form-group">
          <label>Intervall</label>
          <select
            className="input-field"
            value={iv}
            onChange={(e) => setIv(e.target.value as IntervalType)}
          >
            <option value="Monat">Monat</option>
            <option value="Quartal">Quartal</option>
            <option value="Jahr">Jahr</option>
            <option value="Woche">Woche</option>
          </select>
        </div>

        <div className="form-group">
          <label>Kategorie</label>
          <select
            className="input-field"
            value={cat}
            onChange={(e) => setCat(e.target.value as SubscriptionCategory)}
          >
            <option value="Streaming">Streaming</option>
            <option value="Software">Software</option>
            <option value="Gesundheit">Gesundheit</option>
            <option value="Mobilität">Mobilität</option>
            <option value="Versicherung">Versicherung</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nächste Zahlung</label>
          <input
            type="date"
            className="input-field"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" style={{ height: '44px' }}>
            <Plus size={18} />
            <span>Abo speichern</span>
          </button>
        </div>
      </form>

      {data.subs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-secondary)' }}>
          <Repeat size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>Noch kein Abonnement eingetragen. Füge oben dein erstes Abo hinzu.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {data.subs.map((s) => (
            <div key={s.id} className="data-row">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <b style={{ fontSize: '15px' }}>{s.name}</b>
                  <span className="badge">{s.cat}</span>
                </div>
                <span className="subtext">
                  Nächste Zahlung: {formatDate(s.next)} · Intervall: {s.iv}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ textAlign: 'right' }}>
                  <b style={{ fontSize: '16px', display: 'block' }}>{eur(Number(s.amt))}</b>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>pro {s.iv}</span>
                </div>
                <button
                  onClick={() => removeItem('subs', s.id)}
                  className="btn-secondary"
                  style={{ padding: '7px 9px', color: 'var(--danger)', borderColor: 'transparent' }}
                  title="Abo löschen"
                  aria-label="Löschen"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
