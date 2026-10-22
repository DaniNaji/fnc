import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, icon }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', fontWeight: 600 }}>
          {label}
        </span>
        {icon && <div style={{ color: 'var(--acc)' }}>{icon}</div>}
      </div>
      <b style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
        {value}
      </b>
      {subtext && (
        <span style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>{subtext}</span>
      )}
    </div>
  );
};
