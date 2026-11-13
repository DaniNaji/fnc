"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.financeRepository = exports.FinanceRepository = void 0;
const db_1 = require("../database/db");
const defaultFinanceData = {
    subs: [],
    rates: [],
    todos: [],
    banks: [],
    book: [],
    accts: [],
};
class FinanceRepository {
    async getByUserId(userId) {
        const data = db_1.db.getData();
        if (!data.finances[userId]) {
            data.finances[userId] = JSON.parse(JSON.stringify(defaultFinanceData));
            db_1.db.persist();
        }
        return data.finances[userId];
    }
    async saveByUserId(userId, financeData) {
        const data = db_1.db.getData();
        data.finances[userId] = {
            subs: financeData.subs || [],
            rates: financeData.rates || [],
            todos: financeData.todos || [],
            banks: financeData.banks || [],
            book: financeData.book || [],
            accts: financeData.accts || [],
        };
        db_1.db.persist();
        return data.finances[userId];
    }
    async resetByUserId(userId) {
        const data = db_1.db.getData();
        data.finances[userId] = JSON.parse(JSON.stringify(defaultFinanceData));
        db_1.db.persist();
        return data.finances[userId];
    }
}
exports.FinanceRepository = FinanceRepository;
exports.financeRepository = new FinanceRepository();
