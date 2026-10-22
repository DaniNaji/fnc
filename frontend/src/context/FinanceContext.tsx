import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserFinanceData,
  Subscription,
  Rate,
  Todo,
  Bank,
  Booking,
  AccountItem,
} from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface FinanceContextType {
  data: UserFinanceData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addItem: <K extends keyof UserFinanceData>(category: K, item: any) => Promise<void>;
  removeItem: <K extends keyof UserFinanceData>(category: K, id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  addBooking: (booking: Partial<Booking>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  resetAll: () => Promise<void>;
  // Calculated metrics
  metrics: {
    monthlySubs: number;
    monthlyRates: number;
    monthlyBankFees: number;
    totalFixedMonthly: number;
    totalFixedYearly: number;
    totalRemainingDebt: number;
    totalBankBalance: number;
    currentMonthIncome: number;
    currentMonthExpenses: number;
    openTodosCount: number;
    accountsCount: number;
    dueNow: Array<{ type: 'subs' | 'rates'; item: any; name: string; amt: number; date: string }>;
    upcoming30Days: Array<{ date: Date; name: string; amt: number }>;
    categoryTotals: Record<string, number>;
  };
}

const emptyData: UserFinanceData = {
  subs: [],
  rates: [],
  todos: [],
  banks: [],
  book: [],
  accts: [],
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState<UserFinanceData>(emptyData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!user) {
      setData(emptyData);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.getFinances();
      setData({
        subs: res.subs || [],
        rates: res.rates || [],
        todos: res.todos || [],
        banks: res.banks || [],
        book: res.book || [],
        accts: res.accts || [],
      });
    } catch (err: any) {
      console.error('Fehler beim Laden der Finanzdaten:', err);
      setError(err.message || 'Ladefehler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [user]);

  const syncData = async (newData: UserFinanceData) => {
    setData(newData);
    try {
      await api.saveFinances(newData);
    } catch (err: any) {
      console.error('Speichern fehlgeschlagen:', err);
      setError(err.message);
    }
  };

  const addItem = async <K extends keyof UserFinanceData>(category: K, item: any) => {
    const id = item.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const newItem = { ...item, id };
    const currentList = (data[category] as any[]) || [];
    const updatedList = [newItem, ...currentList];

    const newData = { ...data, [category]: updatedList };
    await syncData(newData);
  };

  const removeItem = async <K extends keyof UserFinanceData>(category: K, id: string) => {
    if (category === 'book') {
      await deleteBooking(id);
      return;
    }
    const currentList = (data[category] as any[]) || [];
    const updatedList = currentList.filter((item: any) => item.id !== id);
    const newData = { ...data, [category]: updatedList };
    await syncData(newData);
  };

  const toggleTodo = async (id: string) => {
    const updatedTodos = data.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    const newData = { ...data, todos: updatedTodos };
    await syncData(newData);
  };

  const addBooking = async (booking: Partial<Booking>) => {
    try {
      const updated = await api.addBooking(booking);
      setData(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const updated = await api.deleteBooking(id);
      setData(updated);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetAll = async () => {
    try {
      const reset = await api.resetFinances();
      setData(reset);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Helper calculations
  const metrics = useMemo(() => {
    const monthlyRateForSub = (s: Subscription) => {
      const factor: Record<string, number> = {
        Monat: 1,
        Quartal: 1 / 3,
        Jahr: 1 / 12,
        Woche: 52 / 12,
      };
      return (Number(s.amt) || 0) * (factor[s.iv] || 1);
    };

    const nextDueDate = (nextStr?: string, iv: string = 'Monat') => {
      if (!nextStr) return null;
      const d = new Date(nextStr + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let loop = 0;
      while (d < today && loop < 500) {
        loop++;
        if (iv === 'Jahr') d.setFullYear(d.getFullYear() + 1);
        else if (iv === 'Quartal') d.setMonth(d.getMonth() + 3);
        else if (iv === 'Woche') d.setDate(d.getDate() + 7);
        else d.setMonth(d.getMonth() + 1);
      }
      return d;
    };

    const monthlySubs = data.subs.reduce((sum, s) => sum + monthlyRateForSub(s), 0);
    const monthlyRates = data.rates.reduce((sum, r) => sum + (Number(r.amt) || 0), 0);
    const monthlyBankFees = data.banks.reduce((sum, b) => {
      const f: Record<string, number> = { Monat: 1, Quartal: 1 / 3, Jahr: 1 / 12 };
      return sum + (Number(b.amt) || 0) * (f[b.iv] || 1);
    }, 0);

    const totalFixedMonthly = monthlySubs + monthlyRates + monthlyBankFees;
    const totalFixedYearly = totalFixedMonthly * 12;

    const totalRemainingDebt = data.rates.reduce(
      (sum, r) => sum + (Number(r.amt) || 0) * (Number(r.left) || 0),
      0
    );

    const totalBankBalance = data.banks.reduce(
      (sum, b) => (b.bal !== undefined && b.bal !== null && !isNaN(Number(b.bal)) ? sum + Number(b.bal) : sum),
      0
    );

    const currentYearMonth = new Date().toISOString().slice(0, 7);
    let currentMonthIncome = 0;
    let currentMonthExpenses = 0;

    data.book.forEach((b) => {
      if ((b.date || '').slice(0, 7) === currentYearMonth) {
        if (b.dir === 'Einnahme') currentMonthIncome += Number(b.amt) || 0;
        else currentMonthExpenses += Number(b.amt) || 0;
      }
    });

    const todayStr = new Date().toISOString().slice(0, 10);
    const dueNow: Array<{
      type: 'subs' | 'rates';
      item: any;
      name: string;
      amt: number;
      date: string;
    }> = [];

    data.subs.forEach((s) => {
      if (s.next && s.next <= todayStr) {
        dueNow.push({ type: 'subs', item: s, name: s.name, amt: Number(s.amt) || 0, date: s.next });
      }
    });

    data.rates.forEach((r) => {
      if (r.next && r.next <= todayStr && Number(r.left) > 0) {
        dueNow.push({
          type: 'rates',
          item: r,
          name: `${r.name} (Rate)`,
          amt: Number(r.amt) || 0,
          date: r.next,
        });
      }
    });

    const upcomingLimit = new Date();
    upcomingLimit.setDate(upcomingLimit.getDate() + 30);
    const upcoming30Days: Array<{ date: Date; name: string; amt: number }> = [];

    data.subs.forEach((s) => {
      const d = nextDueDate(s.next, s.iv);
      if (d && d <= upcomingLimit) {
        upcoming30Days.push({ date: d, name: s.name, amt: Number(s.amt) || 0 });
      }
    });

    data.rates.forEach((r) => {
      if (Number(r.left) > 0) {
        const d = nextDueDate(r.next, 'Monat');
        if (d && d <= upcomingLimit) {
          upcoming30Days.push({ date: d, name: `${r.name} (Rate)`, amt: Number(r.amt) || 0 });
        }
      }
    });

    upcoming30Days.sort((a, b) => a.date.getTime() - b.date.getTime());

    const categoryTotals: Record<string, number> = {};
    data.subs.forEach((s) => {
      categoryTotals[s.cat] = (categoryTotals[s.cat] || 0) + monthlyRateForSub(s);
    });

    return {
      monthlySubs,
      monthlyRates,
      monthlyBankFees,
      totalFixedMonthly,
      totalFixedYearly,
      totalRemainingDebt,
      totalBankBalance,
      currentMonthIncome,
      currentMonthExpenses,
      openTodosCount: data.todos.filter((t) => !t.done).length,
      accountsCount: data.accts.length,
      dueNow,
      upcoming30Days,
      categoryTotals,
    };
  }, [data]);

  return (
    <FinanceContext.Provider
      value={{
        data,
        loading,
        error,
        refresh,
        addItem,
        removeItem,
        toggleTodo,
        addBooking,
        deleteBooking,
        resetAll,
        metrics,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
