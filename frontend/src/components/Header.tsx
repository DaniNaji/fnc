import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
  openLegal: (type: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setTab, openLegal }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0 18px',
        borderBottom: '1px solid var(--border)',
        marginBottom: '20px',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={() => setTab('home')}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--acc)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '18px',
          }}
        >
          Ü
        </div>
        <div>
          <h1 style={{ fontSize: '20px', lineHeight: 1.1 }}>Mein Überblick</h1>
          <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', fontWeight: 500 }}>
            Finanzen, Abos & KI-Insights
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={toggleTheme}
          className="btn-secondary"
          style={{ padding: '8px 10px', borderRadius: '50%' }}
          aria-label="Theme umschalten"
          title={theme === 'dark' ? 'Helles Design' : 'Dunkles Design'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {user ? (
          <>
            <button
              onClick={() => setTab('set')}
              className={`btn-secondary ${currentTab === 'set' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Einstellungen & Konto"
            >
              <UserIcon size={16} />
              <span>{user.name}</span>
            </button>
            <button
              onClick={logout}
              className="btn-secondary"
              style={{ padding: '8px 10px' }}
              title="Abmelden"
              aria-label="Abmelden"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
};
