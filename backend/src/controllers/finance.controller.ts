import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { financeService } from '../services/finance.service';
import { authService } from '../services/auth.service';

export class FinanceController {
  public async getFinances(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      const data = await financeService.getFinances(req.user.id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public async saveFinances(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      const updated = await financeService.updateFinances(req.user.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public async addBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      const updated = await financeService.addBooking(req.user.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public async deleteBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      const bookingId = req.params.id;
      const updated = await financeService.deleteBooking(req.user.id, bookingId);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public async resetFinances(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      const reset = await financeService.resetFinances(req.user.id);
      res.json(reset);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public async exportData(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      const user = await authService.getProfile(req.user.id);
      const finances = await financeService.getFinances(req.user.id);
      res.json({
        konto: user,
        daten: finances,
        exportiertAm: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const financeController = new FinanceController();
