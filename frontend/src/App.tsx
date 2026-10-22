import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { TabType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Modal } from './components/Modal';

import { Dashboard } from './pages/Dashboard';
import { Subscriptions } from './pages/Subscriptions';
import { Rates } from './pages/Rates';
import { Bookings } from './pages/Bookings';
import { Todos } from './pages/Todos';
import { Banks } from './pages/Banks';
import { Accounts } from './pages/Accounts';
import { AiAnalysis } from './pages/AiAnalysis';
import { Settings } from './pages/Settings';
import { Legal } from './pages/Legal';
import { Auth } from './pages/Auth';

import {
  CheckSquare,
  Landmark,
  ShieldCheck,
  Settings as SettingsIcon,
  FileText,
  Shield,
  HelpCircle,
} from 'lucide-react';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentTab, setTab] = useState<TabType>('home');
  const [legalType, setLegalType] = useState<string | null>(null);
  const [moreModalOpen, setMoreModalOpen] = useState(false);

  const openLegal = (type: string) => {
    setLegalType(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeLegal = () => {
    setLegalType(null);
  };

  const handleSelectTab = (tab: TabType) => {
    setLegalType(null);
    setTab(tab);
    setMoreModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          color: 'var(--ink)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--acc)',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              marginBottom: '12px',
            }}
          >
            Ü
          </div>
          <p style={{ fontWeight: 600 }}>Mein Überblick lädt …</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {user && <Sidebar currentTab={currentTab} setTab={handleSelectTab} />}

      <div className="main-content">
        <Header currentTab={currentTab} setTab={handleSelectTab} openLegal={openLegal} />

        {legalType ? (
          <Legal type={legalType} onBack={closeLegal} />
        ) : !user ? (
          <Auth openLegal={openLegal} />
        ) : (
          <main>
            {currentTab === 'home' && <Dashboard setTab={handleSelectTab} />}
            {currentTab === 'subs' && <Subscriptions />}
            {currentTab === 'rates' && <Rates />}
            {currentTab === 'book' && <Bookings />}
            {currentTab === 'todos' && <Todos />}
            {currentTab === 'banks' && <Banks />}
            {currentTab === 'accts' && <Accounts />}
            {currentTab === 'ai' && <AiAnalysis openLegal={openLegal} />}
            {currentTab === 'set' && <Settings />}
          </main>
        )}

        {/* Footer */}
        <footer
          style={{
            marginTop: '48px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)',
            fontSize: '12.5px',
            color: 'var(--ink-secondary)',
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '10px' }}>
            <button
              onClick={() => openLegal('impressum')}
              style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', padding: 0 }}
            >
              Impressum
            </button>
            <button
              onClick={() => openLegal('datenschutz')}
              style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', padding: 0 }}
            >
              Datenschutz
            </button>
            <button
              onClick={() => openLegal('agb')}
              style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', padding: 0 }}
            >
              AGB
            </button>
            <button
              onClick={() => openLegal('ki')}
              style={{ background: 'none', border: 'none', color: 'var(--acc)', cursor: 'pointer', padding: 0 }}
            >
              KI-Hinweis
            </button>
          </div>
          <p>
            Reine Übersicht zum Selbsteintragen. Keine Finanzberatung, keine Vermittlung, kein Verkauf, keine Bankanbindung.
            Alle Daten bleiben sicher auf deinem Server oder Gerät.
          </p>
        </footer>
      </div>

      {/* Mobile Bottom Navigation */}
      {user && (
        <BottomNav
          currentTab={currentTab}
          setTab={handleSelectTab}
          onOpenMore={() => setMoreModalOpen(true)}
        />
      )}

      {/* Mobile "Mehr" Sheet / Modal */}
      <Modal
        isOpen={moreModalOpen}
        onClose={() => setMoreModalOpen(false)}
        title="Weitere Bereiche"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
          <button
            onClick={() => handleSelectTab('todos')}
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <CheckSquare size={18} style={{ color: 'var(--acc)' }} />
            <span>To-dos & Fristen</span>
          </button>
          <button
            onClick={() => handleSelectTab('banks')}
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <Landmark size={18} style={{ color: 'var(--acc)' }} />
            <span>Banken & Kontomodelle</span>
          </button>
          <button
            onClick={() => handleSelectTab('accts')}
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <ShieldCheck size={18} style={{ color: 'var(--acc)' }} />
            <span>Konten & Online-Dienste</span>
          </button>
          <button
            onClick={() => handleSelectTab('set')}
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <SettingsIcon size={18} style={{ color: 'var(--acc)' }} />
            <span>Konto & Einstellungen</span>
          </button>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />

          <button
            onClick={() => {
              openLegal('impressum');
              setMoreModalOpen(false);
            }}
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '13px' }}
          >
            <FileText size={16} />
            <span>Impressum</span>
          </button>
          <button
            onClick={() => {
              openLegal('datenschutz');
              setMoreModalOpen(false);
            }}
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '13px' }}
          >
            <Shield size={16} />
            <span>Datenschutzerklärung</span>
          </button>
          <button
            onClick={() => {
              openLegal('ki');
              setMoreModalOpen(false);
            }}
            className="btn-secondary"
            style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '13px' }}
          >
            <HelpCircle size={16} />
            <span>KI-Hinweis (EU AI Act)</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};
