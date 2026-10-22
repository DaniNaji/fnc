import {
  UserFinanceData,
  Subscription,
  Rate,
  Todo,
  Bank,
  Booking,
  AccountItem,
} from '../models/finance.model';
import { financeRepository } from '../repositories/finance.repository';

export class FinanceService {
  private uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  private advanceDate(dateStr: string, interval: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    if (interval === 'Jahr') d.setFullYear(d.getFullYear() + 1);
    else if (interval === 'Quartal') d.setMonth(d.getMonth() + 3);
    else if (interval === 'Woche') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  public async getFinances(userId: string): Promise<UserFinanceData> {
    return await financeRepository.getByUserId(userId);
  }

  public async updateFinances(
    userId: string,
    data: UserFinanceData
  ): Promise<UserFinanceData> {
    return await financeRepository.saveByUserId(userId, data);
  }

  public async resetFinances(userId: string): Promise<UserFinanceData> {
    return await financeRepository.resetByUserId(userId);
  }

  public async addBooking(userId: string, booking: Partial<Booking>): Promise<UserFinanceData> {
    const data = await financeRepository.getByUserId(userId);
    const amt = Number(booking.amt);
    if (!amt || amt <= 0) {
      throw new Error('Ungültiger Buchungsbetrag.');
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const newBooking: Booking = {
      id: booking.id || this.uid(),
      name: booking.name || 'Buchung',
      amt,
      dir: booking.dir || 'Abbuchung',
      date: booking.date || todayStr,
      bank: booking.bank || '',
      link: booking.link || '',
    };

    // If linked to a subscription or rate
    if (newBooking.link) {
      const [type, linkedId] = newBooking.link.split(':');
      if (type === 's') {
        const sub = data.subs.find((s) => s.id === linkedId);
        if (sub) {
          newBooking.lt = 's';
          newBooking.li = linkedId;
          newBooking.prev = sub.next;
          sub.next = this.advanceDate(sub.next || newBooking.date, sub.iv);
        }
      } else if (type === 'r') {
        const rate = data.rates.find((r) => r.id === linkedId);
        if (rate) {
          newBooking.lt = 'r';
          newBooking.li = linkedId;
          newBooking.prev = rate.next;
          newBooking.prevLeft = rate.left;
          rate.left = Math.max(0, (rate.left || 0) - 1);
          rate.next = this.advanceDate(rate.next || newBooking.date, 'Monat');
        }
      }
    }

    // Adjust bank balance if bank is selected
    if (newBooking.bank) {
      const b = data.banks.find((x) => x.id === newBooking.bank);
      if (b && b.bal !== undefined && b.bal !== null) {
        const diff = newBooking.dir === 'Einnahme' ? amt : -amt;
        b.bal = Math.round((Number(b.bal) + diff) * 100) / 100;
        newBooking.bd = diff;
      }
    }

    data.book = data.book || [];
    data.book.unshift(newBooking);
    data.book.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    return await financeRepository.saveByUserId(userId, data);
  }

  public async deleteBooking(userId: string, bookingId: string): Promise<UserFinanceData> {
    const data = await financeRepository.getByUserId(userId);
    const index = (data.book || []).findIndex((b) => b.id === bookingId);
    if (index === -1) {
      throw new Error('Buchung nicht gefunden.');
    }

    const o = data.book[index];

    // Revert subscription or rate advance
    if (o.li) {
      if (o.lt === 's') {
        const sub = data.subs.find((x) => x.id === o.li);
        if (sub && o.prev) sub.next = o.prev;
      } else if (o.lt === 'r') {
        const rate = data.rates.find((x) => x.id === o.li);
        if (rate) {
          if (o.prev) rate.next = o.prev;
          if (o.prevLeft !== undefined) rate.left = o.prevLeft;
        }
      }
    }

    // Revert bank balance
    if (o.bd && o.bank) {
      const b = data.banks.find((x) => x.id === o.bank);
      if (b && b.bal !== undefined && b.bal !== null) {
        b.bal = Math.round((Number(b.bal) - o.bd) * 100) / 100;
      }
    }

    data.book.splice(index, 1);
    return await financeRepository.saveByUserId(userId, data);
  }
}

export const financeService = new FinanceService();
