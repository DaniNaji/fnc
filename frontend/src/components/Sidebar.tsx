import React from 'react';
import { TabType } from '../types';
import {
  Home,
  Repeat,
  Clock,
  ArrowLeftRight,
  CheckSquare,
  Landmark,
  ShieldCheck,
  Sparkles,
  Settings,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface SidebarProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab }) => {
  const { metrics } = useFinance();

  const items = [
    { id: 'home' as TabType, label: 'Übersicht', icon: Home },
    { id: 'subs' as TabType, label: 'Abos', icon: Repeat },
    { id: 'rates' as TabType, label: 'Raten', icon: Clock },
    { id: 'book' as TabType, label: 'Buchungen', icon: ArrowLeftRight },
    { id: 'todos' as TabType, label: 'To-dos', icon: CheckSquare, badge: metrics.openTodosCount || undefined },
    { id: 'banks' as TabType, label: 'Banken', icon: Landmark },
    { id: 'accts' as TabType, label: 'Konten', icon: ShieldCheck, badge: metrics.accountsCount || undefined },
    { id: 'ai' as TabType, label: 'KI-Auswertung', icon: Sparkles },
    { id: 'set' as TabType, label: 'Einstellungen', icon: Settings },
  ];

  return (
    <aside className="desktop-sidebar">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            className={`sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            <Icon size={18} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? (
              <span
                style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border)',
                  color: isActive ? '#fff' : 'var(--ink-secondary)',
                  padding: '2px 7px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </aside>
  );
};
