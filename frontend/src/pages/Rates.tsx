import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2, Plus, Clock } from 'lucide-react';

export const Rates: React.FC = () => {
  const { data, addItem, removeItem } = useFinance();
  const [name, setName] = useState('');
  const [amt, setAmt] = useState('');
  const [left, setLeft] = useState('12');
  const [next, setNext] = useState(new Date().toISOString().slice(0, 10));

  const eur = (n: number) =>
    n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amt || !left) return;

    await addItem('rates', {
      name: name.trim(),
      amt: parseFloat(amt),
      left: parseInt(left, 10),
      next,
    });

    setName('');
    setAmt('');
    setLeft('12');
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h1>Ratenzahlungen</h1>
        <p className="subtext">
          Verwalte laufende Raten, Restbeträge und Fälligkeiten ohne Bankverbindung.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <strong style={{ fontSize: '15px' }}>Neue Ratenzahlung anlegen</strong>
        </div>

        <div className="form-group">
          <label>Wofür (Kauf / Gegenstand)</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Smartphone, Laptop, Sofa"
            required
          />
        </div>

        <div className="form-group">
          <label>Rate pro Monat (€)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="input-field"
            value={amt}
            onChange={(e) => setAmt(e.target.value)}
            placeholder="z. B. 45.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Verbleibende Raten</label>
          <input
            type="number"
            min="1"
            className="input-field"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Nächste Fälligkeit</label>
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
            <span>Rate speichern</span>
          </button>
        </div>
      </form>

      {data.rates.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-secondary)' }}>
          <Clock size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>Keine Ratenzahlungen eingetragen. Sehr gut oder trage oben laufende Raten ein.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {data.rates.map((r) => {
            const totalRemaining = (Number(r.amt) || 0) * (Number(r.left) || 0);
            return (
              <div key={r.id} className="data-row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <b style={{ fontSize: '15px' }}>{r.name}</b>
                  <span className="subtext">
                    {r.left} Raten übrig · Noch {eur(totalRemaining)} offen · Nächste: {formatDate(r.next)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <b style={{ fontSize: '16px', display: 'block' }}>{eur(Number(r.amt))}</b>
                    <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>pro Monat</span>
                  </div>
                  <button
                    onClick={() => removeItem('rates', r.id)}
                    className="btn-secondary"
                    style={{ padding: '7px 9px', color: 'var(--danger)', borderColor: 'transparent' }}
                    title="Rate löschen"
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
