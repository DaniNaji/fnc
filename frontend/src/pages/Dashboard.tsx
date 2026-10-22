import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { StatCard } from '../components/StatCard';
import { TabType } from '../types';
import {
  Wallet,
  Repeat,
  Landmark,
  ArrowDownRight,
  ArrowUpRight,
  CheckSquare,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface DashboardProps {
  setTab: (tab: TabType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setTab }) => {
  const { data, metrics, addBooking } = useFinance();

  const eur = (n: number) =>
    n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  const formatDate = (d: Date | string) => {
    const dateObj = typeof d === 'string' ? new Date(d + 'T00:00:00') : d;
    return dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
  };

  const handlePayDue = async (item: any, type: 'subs' | 'rates') => {
    await addBooking({
      name: item.name,
      amt: item.amt,
      dir: 'Abbuchung',
      date: item.next,
      bank: '',
      link: `${type === 'subs' ? 's' : 'r'}:${item.id}`,
    });
  };

  // Find maximum category total for progress bar percentage
  const maxCategoryTotal = Math.max(
    ...Object.values(metrics.categoryTotals),
    1
  );

  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card" style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
          <Wallet size={18} />
          <span style={{ fontSize: '13.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Feste Kosten pro Monat
          </span>
        </div>
        <div className="hero-amount">{eur(metrics.totalFixedMonthly)}</div>
        <div className="hero-sub">{eur(metrics.totalFixedYearly)} hochgerechnet pro Jahr</div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '28px',
        }}
      >
        <StatCard
          label="Abos"
          value={data.subs.length}
          subtext={`${eur(metrics.monthlySubs)}/Monat`}
          icon={<Repeat size={18} />}
        />
        <StatCard
          label="Kontogebühren"
          value={eur(metrics.monthlyBankFees)}
          subtext="pro Monat"
          icon={<Landmark size={18} />}
        />
        <StatCard
          label="Gebuchte Ausgaben"
          value={eur(metrics.currentMonthExpenses)}
          subtext="diesen Monat"
          icon={<ArrowDownRight size={18} style={{ color: 'var(--danger)' }} />}
        />
        <StatCard
          label="Eingänge"
          value={eur(metrics.currentMonthIncome)}
          subtext="diesen Monat"
          icon={<ArrowUpRight size={18} style={{ color: 'var(--success)' }} />}
        />
        {metrics.totalBankBalance > 0 && (
          <StatCard
            label="Kontostände"
            value={eur(metrics.totalBankBalance)}
            subtext="gesamt erfasst"
            icon={<Landmark size={18} />}
          />
        )}
        <StatCard
          label="Offene Raten"
          value={eur(metrics.totalRemainingDebt)}
          subtext={`${data.rates.length} Ratenpläne`}
          icon={<Calendar size={18} />}
        />
        <StatCard
          label="Offene To-dos"
          value={metrics.openTodosCount}
          subtext="anstehende Aufgaben"
          icon={<CheckSquare size={18} />}
        />
        <StatCard
          label="Konten & Logins"
          value={metrics.accountsCount}
          subtext="registriert"
          icon={<ShieldCheck size={18} />}
        />
      </div>

      {/* Due Now Alert Section */}
      {metrics.dueNow.length > 0 && (
        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <AlertCircle size={18} style={{ color: 'var(--accent-gold)' }} />
            <h2 style={{ margin: 0 }}>Noch nicht gebucht ({metrics.dueNow.length})</h2>
          </div>
          <p className="subtext" style={{ marginBottom: '12px' }}>
            Diese Zahlungen waren fällig. Wurden sie von der Bank abgebucht, trage sie mit einem Klick ein:
          </p>
          <div className="card" style={{ padding: 0 }}>
            {metrics.dueNow.map((item, idx) => (
              <div key={idx} className="data-row">
                <div>
                  <b style={{ display: 'block' }}>{item.name}</b>
                  <span className="subtext">fällig seit {formatDate(item.date)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <b style={{ color: 'var(--ink)' }}>{eur(item.amt)}</b>
                  <button
                    onClick={() => handlePayDue(item.item, item.type)}
                    className="btn-secondary"
                    style={{ fontSize: '12.5px', padding: '6px 12px' }}
                  >
                    Als gebucht markieren
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Next 30 Days Forecast */}
      <section style={{ marginBottom: '28px' }}>
        <h2>In den nächsten 30 Tagen</h2>
        {metrics.upcoming30Days.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-secondary)' }}>
            Aktuell keine Fälligkeiten in den nächsten 30 Tagen.
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            {metrics.upcoming30Days.map((item, idx) => (
              <div key={idx} className="data-row">
                <div>
                  <b style={{ display: 'block' }}>{item.name}</b>
                  <span className="subtext">{formatDate(item.date)}</span>
                </div>
                <b style={{ color: 'var(--ink)' }}>{eur(item.amt)}</b>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Category Distribution */}
      {Object.keys(metrics.categoryTotals).length > 0 && (
        <section style={{ marginBottom: '28px' }}>
          <h2>Abos nach Kategorie</h2>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(metrics.categoryTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const percent = Math.round((amount / maxCategoryTotal) * 100);
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{cat}</span>
                      <span style={{ fontWeight: 700 }}>{eur(amount)} / Monat</span>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        background: 'var(--border)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${percent}%`,
                          background: 'var(--acc)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
};
