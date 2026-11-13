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
    <header className="app-header">
      <div
        className="app-header-brand"
        onClick={() => setTab('home')}
      >
        <div className="app-header-logo">
          Ü
        </div>
        <div className="app-header-titles">
          <h1>Mein Überblick</h1>
          <span className="app-header-subtitle">
            Finanzen, Abos & KI-Insights
          </span>
        </div>
      </div>

      <div className="app-header-actions">
        <button
          onClick={toggleTheme}
          className="btn-secondary app-header-icon-btn"
          aria-label="Theme umschalten"
          title={theme === 'dark' ? 'Helles Design' : 'Dunkles Design'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {user ? (
          <>
            <button
              onClick={() => setTab('set')}
              className={`btn-secondary app-header-user-btn ${currentTab === 'set' ? 'active' : ''}`}
              title="Einstellungen & Konto"
            >
              <UserIcon size={16} style={{ flexShrink: 0 }} />
              <span className="app-header-username">{user.name}</span>
            </button>
            <button
              onClick={logout}
              className="btn-secondary app-header-icon-btn"
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
