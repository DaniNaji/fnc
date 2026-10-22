import { db } from '../database/db';
import { UserFinanceData } from '../models/finance.model';

export interface IFinanceRepository {
  getByUserId(userId: string): Promise<UserFinanceData>;
  saveByUserId(userId: string, financeData: UserFinanceData): Promise<UserFinanceData>;
  resetByUserId(userId: string): Promise<UserFinanceData>;
}

const defaultFinanceData: UserFinanceData = {
  subs: [],
  rates: [],
  todos: [],
  banks: [],
  book: [],
  accts: [],
};

export class FinanceRepository implements IFinanceRepository {
  async getByUserId(userId: string): Promise<UserFinanceData> {
    const data = db.getData();
    if (!data.finances[userId]) {
      data.finances[userId] = JSON.parse(JSON.stringify(defaultFinanceData));
      db.persist();
    }
    return data.finances[userId];
  }

  async saveByUserId(userId: string, financeData: UserFinanceData): Promise<UserFinanceData> {
    const data = db.getData();
    data.finances[userId] = {
      subs: financeData.subs || [],
      rates: financeData.rates || [],
      todos: financeData.todos || [],
      banks: financeData.banks || [],
      book: financeData.book || [],
      accts: financeData.accts || [],
    };
    db.persist();
    return data.finances[userId];
  }

  async resetByUserId(userId: string): Promise<UserFinanceData> {
    const data = db.getData();
    data.finances[userId] = JSON.parse(JSON.stringify(defaultFinanceData));
    db.persist();
    return data.finances[userId];
  }
}

export const financeRepository = new FinanceRepository();
