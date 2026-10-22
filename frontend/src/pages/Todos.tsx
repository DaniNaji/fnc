import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CheckSquare, Trash2, Plus } from 'lucide-react';

export const Todos: React.FC = () => {
  const { data, addItem, removeItem, toggleTodo } = useFinance();
  const [name, setName] = useState('');
  const [due, setDue] = useState('');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Ohne Frist';
    const d = new Date(dateStr + 'T00:00:00');
    return `Fällig am ${d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addItem('todos', {
      name: name.trim(),
      due: due || undefined,
      done: false,
    });

    setName('');
    setDue('');
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h1>To-dos & Fristen</h1>
        <p className="subtext">
          Notiere Kündigungsfristen, Verträge zur Überprüfung oder geplante Rücklagen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <strong style={{ fontSize: '15px' }}>Neue Aufgabe notieren</strong>
        </div>

        <div className="form-group" style={{ flex: 2 }}>
          <label>Aufgabe / Notiz</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Handyvertrag kündigen, Kfz-Versicherung prüfen"
            required
          />
        </div>

        <div className="form-group">
          <label>Fällig am (optional)</label>
          <input
            type="date"
            className="input-field"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" style={{ height: '44px' }}>
            <Plus size={18} />
            <span>Speichern</span>
          </button>
        </div>
      </form>

      {data.todos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px', color: 'var(--ink-secondary)' }}>
          <CheckSquare size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>Keine offenen Aufgaben. Alles erledigt!</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          {data.todos.map((t) => (
            <div
              key={t.id}
              className="data-row"
              style={{
                opacity: t.done ? 0.6 : 1,
                background: t.done ? 'var(--bg)' : undefined,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTodo(t.id)}
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: 'var(--acc)',
                    cursor: 'pointer',
                  }}
                  aria-label="Erledigt umschalten"
                />
                <div>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      textDecoration: t.done ? 'line-through' : 'none',
                    }}
                  >
                    {t.name}
                  </span>
                  <span className="subtext" style={{ display: 'block', fontSize: '12px' }}>
                    {formatDate(t.due)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeItem('todos', t.id)}
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
