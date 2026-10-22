import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { api } from '../services/api';
import { AiAnalysisResult, AiStatus } from '../types';
import { Sparkles, Calculator, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';

interface AiAnalysisProps {
  openLegal: (type: string) => void;
}

export const AiAnalysis: React.FC<AiAnalysisProps> = ({ openLegal }) => {
  const { data, metrics } = useFinance();
  const [goalAmount, setGoalAmount] = useState('');
  const [goalMonths, setGoalMonths] = useState('');
  const [goalResult, setGoalResult] = useState<string | null>(null);

  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eur = (n: number) =>
    n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  useEffect(() => {
    api.getAiStatus()
      .then(setAiStatus)
      .catch((e) => console.warn('Konnte KI-Status nicht laden:', e));
  }, []);

  const handleCalculateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalAmount);
    const months = parseInt(goalMonths, 10);
    if (!target || target <= 0 || !months || months <= 0) return;

    const monthlyNeeded = target / months;
    setGoalResult(
      `Um dein Sparziel von ${eur(target)} in ${months} Monaten zu erreichen, müsstest du ca. ${eur(
        monthlyNeeded
      )} pro Monat zurücklegen. Zum Vergleich betragen deine festen monatlichen Kosten aktuell ${eur(
        metrics.totalFixedMonthly
      )}.`
    );
  };

  const handleRunAnalysis = async () => {
    const hasData =
      data.subs.length > 0 || data.rates.length > 0 || data.banks.length > 0;

    if (!hasData) {
      setError('Trage bitte zuerst mindestens ein Abo, eine Rate oder eine Bank ein.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.analyzeAi();
      setAnalysis(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Die KI-Auswertung konnte nicht erstellt werden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1>Smarte Auswertung & Sparziele</h1>
          {aiStatus && (
            <span
              className="badge"
              style={{
                background: aiStatus.useMock ? 'var(--surface-raised)' : 'var(--acc-glow)',
                color: aiStatus.useMock ? 'var(--ink-secondary)' : 'var(--acc)',
                border: '1px solid var(--border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Cpu size={13} />
              {aiStatus.useMock ? 'Mock-Modus (Testdaten)' : `Mistral AI (${aiStatus.model})`}
            </span>
          )}
        </div>
        <p className="subtext">
          Erhalte eine sachliche Zusammenfassung deiner Fixkosten und prüfe Sparmöglichkeiten.
        </p>
      </div>

      <div className="notice-box">
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          <strong>Transparenzhinweis:</strong> Die Auswertung beschreibt ausschließlich deine selbst eingetragenen Zahlen. Sie ist keine Finanz-, Anlage-, Steuer- oder Rechtsberatung und empfiehlt keine Finanzprodukte oder Banken.{' '}
          <button
            onClick={() => openLegal('ki')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--acc)',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Mehr zum KI-Einsatz & EU AI Act
          </button>
        </p>
      </div>

      {/* Sparziel-Rechner */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Calculator size={18} style={{ color: 'var(--acc)' }} />
          <h2 style={{ margin: 0, fontSize: '17px' }}>Sparziel-Rechner</h2>
        </div>

        <form onSubmit={handleCalculateGoal} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: '1 1 180px' }}>
            <label>Zielbetrag (€)</label>
            <input
              type="number"
              step="1"
              min="1"
              className="input-field"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              placeholder="z. B. 2000"
              required
            />
          </div>

          <div className="form-group" style={{ flex: '1 1 180px' }}>
            <label>In wie vielen Monaten?</label>
            <input
              type="number"
              step="1"
              min="1"
              className="input-field"
              value={goalMonths}
              onChange={(e) => setGoalMonths(e.target.value)}
              placeholder="z. B. 12"
              required
            />
          </div>

          <button type="submit" className="btn-secondary" style={{ height: '44px' }}>
            Berechnen
          </button>
        </form>

        {goalResult && (
          <div
            style={{
              marginTop: '14px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              fontSize: '13.5px',
            }}
          >
            {goalResult}
          </div>
        )}
      </div>

      {/* KI-Analyse Sektion */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-gold)' }} />
            <h2 style={{ margin: 0, fontSize: '17px' }}>KI-Kostenanalyse</h2>
          </div>
        </div>

        <p className="subtext" style={{ marginBottom: '16px' }}>
          Analysiert größte Kostenblöcke, eventuelle Überschneidungen bei Diensten und formuliert 3 neutrale Prüffragen für dich.
        </p>

        <button
          onClick={handleRunAnalysis}
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', height: '48px', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>Analyse wird erstellt …</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Analyse jetzt starten</span>
            </>
          )}
        </button>

        {error && (
          <div
            style={{
              marginTop: '14px',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              fontSize: '13.5px',
            }}
          >
            {error}
          </div>
        )}

        {analysis && (
          <div className="ai-output-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-secondary)' }}>
                {analysis.disclaimer}
              </span>
            </div>
            <div>{analysis.text}</div>
          </div>
        )}
      </div>
    </div>
  );
};
