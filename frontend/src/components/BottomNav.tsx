import React from 'react';
import { TabType } from '../types';
import {
  Home,
  Repeat,
  Clock,
  ArrowLeftRight,
  Sparkles,
  Menu,
} from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
  onOpenMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setTab, onOpenMore }) => {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => setTab('home')}
      >
        <Home />
        <span>Übersicht</span>
      </button>

      <button
        className={`bottom-nav-item ${currentTab === 'subs' ? 'active' : ''}`}
        onClick={() => setTab('subs')}
      >
        <Repeat />
        <span>Abos</span>
      </button>

      <button
        className={`bottom-nav-item ${currentTab === 'rates' ? 'active' : ''}`}
        onClick={() => setTab('rates')}
      >
        <Clock />
        <span>Raten</span>
      </button>

      <button
        className={`bottom-nav-item ${currentTab === 'book' ? 'active' : ''}`}
        onClick={() => setTab('book')}
      >
        <ArrowLeftRight />
        <span>Buchungen</span>
      </button>

      <button
        className={`bottom-nav-item ${currentTab === 'ai' ? 'active' : ''}`}
        onClick={() => setTab('ai')}
      >
        <Sparkles />
        <span>KI</span>
      </button>

      <button
        className={`bottom-nav-item ${['todos', 'banks', 'accts', 'set', 'legal'].includes(currentTab) ? 'active' : ''}`}
        onClick={onOpenMore}
      >
        <Menu />
        <span>Mehr</span>
      </button>
    </nav>
  );
};
