"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.financeController = exports.FinanceController = void 0;
const finance_service_1 = require("../services/finance.service");
const auth_service_1 = require("../services/auth.service");
class FinanceController {
    async getFinances(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            const data = await finance_service_1.financeService.getFinances(req.user.id);
            res.json(data);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async saveFinances(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            const updated = await finance_service_1.financeService.updateFinances(req.user.id, req.body);
            res.json(updated);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async addBooking(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            const updated = await finance_service_1.financeService.addBooking(req.user.id, req.body);
            res.json(updated);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async deleteBooking(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            const bookingId = req.params.id;
            const updated = await finance_service_1.financeService.deleteBooking(req.user.id, bookingId);
            res.json(updated);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async resetFinances(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            const reset = await finance_service_1.financeService.resetFinances(req.user.id);
            res.json(reset);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async exportData(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            const user = await auth_service_1.authService.getProfile(req.user.id);
            const finances = await finance_service_1.financeService.getFinances(req.user.id);
            res.json({
                konto: user,
                daten: finances,
                exportiertAm: new Date().toISOString(),
            });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
exports.FinanceController = FinanceController;
exports.financeController = new FinanceController();
