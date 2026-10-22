import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BookingDirection } from '../types';
import { ArrowLeftRight, Trash2, Plus, Info } from 'lucide-react';

export const Bookings: React.FC = () => {
  const { data, addBooking, deleteBooking } = useFinance();
  const [name, setName] = useState('');
  const [amt, setAmt] = useState('');
  const [dir, setDir] = useState<BookingDirection>('Abbuchung');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [bank, setBank] = useState('');
  const [link, setLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eur = (n: number) =>
    n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Bitte gib eine Beschreibung ein.');
      return;
    }

    const cleanAmt = parseFloat(amt.toString().replace(',', '.'));
    if (isNaN(cleanAmt) || cleanAmt <= 0) {
      setError('Bitte gib einen gültigen Betrag größer als 0 € ein.');
      return;
    }

    setSaving(true);
    try {
      await addBooking({
        name: name.trim(),
        amt: cleanAmt,
        dir,
        date,
        bank: bank || undefined,
        link: link || undefined,
      });

      setName('');
      setAmt('');
      setBank('');
      setLink('');
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern der Buchung.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h1>Buchungen</h1>
        <p className="subtext">
          Erfasse manuelle Geldbewegungen von deinem Konto. Keine Bankanbindung erforderlich.
        </p>
      </div>

      <div className="notice-box" style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <Info size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-gold)' }} />
        <div>
          Trage ein, was von deinem Konto abgebucht oder überwiesen wurde. Ordnest du die Buchung einem Abo oder einer Rate zu, rückt deren Fälligkeitstermin automatisch vor und eine Rate zählt herunter.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <strong style={{ fontSize: '15px' }}>Buchung eintragen</strong>
        </div>

        <div className="form-group">
          <label>Beschreibung</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Gehalt, Supermarkt, Miete"
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
            placeholder="z. B. 49.90"
            required
          />
        </div>

        <div className="form-group">
          <label>Art der Buchung</label>
          <select
            className="input-field"
            value={dir}
            onChange={(e) => setDir(e.target.value as BookingDirection)}
          >
            <option value="Abbuchung">Abbuchung (Ausgabe)</option>
            <option value="Überweisung">Überweisung (Ausgabe)</option>
            <option value="Einnahme">Einnahme (+ Plus)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Buchungsdatum</label>
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Bankkonto (optional)</label>
          <select
            className="input-field"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
          >
            <option value="">Keine Bank zugeordnet</option>
            {data.banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.type})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Zahlung zuordnen (optional)</label>
          <select
            className="input-field"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          >
            <option value="">Keiner Zahlung zuordnen</option>
            <optgroup label="Abonnements">
              {data.subs.map((s) => (
                <option key={s.id} value={`s:${s.id}`}>
                  Abo: {s.name} ({eur(Number(s.amt))})
                </option>
              ))}
            </optgroup>
            <optgroup label="Ratenzahlungen">
              {data.rates.map((r) => (
                <option key={r.id} value={`r:${r.id}`}>
                  Rate: {r.name} ({eur(Number(r.amt))})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {error && (
          <div
            style={{
              gridColumn: '1 / -1',
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

        <div className="form-group" style={{ justifyContent: 'flex-end', gridColumn: '1 / -1' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ height: '44px', opacity: saving ? 0.7 : 1 }}
          >
            <Plus size={18} />
            <span>{saving ? 'Wird gespeichert …' : 'Buchung speichern'}</span>
          </button>
        </div>
      </form>

      {data.book.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-secondary)' }}>
          <ArrowLeftRight size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>Noch keine Buchungen erfasst. Notiere Ausgaben oder Einnahmen für deine Monatsübersicht.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {data.book.map((b) => {
            const isIncome = b.dir === 'Einnahme';
            const bankObj = data.banks.find((x) => x.id === b.bank);
            const linkedObj = b.li
              ? (b.lt === 's' ? data.subs : data.rates).find((x) => x.id === b.li)
              : null;

            return (
              <div key={b.id} className="data-row">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <b style={{ fontSize: '15px' }}>{b.name}</b>
                  <span className="subtext">
                    {formatDate(b.date)} · {b.dir}
                    {bankObj ? ` · ${bankObj.name}` : ''}
                    {linkedObj ? ` · Verknüpft: ${linkedObj.name}` : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <b
                    style={{
                      fontSize: '16px',
                      color: isIncome ? 'var(--success)' : 'var(--ink)',
                    }}
                  >
                    {isIncome ? '+ ' : '− '}
                    {eur(Number(b.amt))}
                  </b>
                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="btn-secondary"
                    style={{ padding: '7px 9px', color: 'var(--danger)', borderColor: 'transparent' }}
                    title="Buchung rückgängig machen / löschen"
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
