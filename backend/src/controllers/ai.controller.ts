import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { aiService } from '../services/ai.service';
import { financeService } from '../services/finance.service';
import { config } from '../config';

export class AiController {
  public async analyze(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }

      // Can analyze either provided data or stored user data
      const data = req.body && Object.keys(req.body).length > 0
        ? req.body
        : await financeService.getFinances(req.user.id);

      const result = await aiService.analyze(data);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public getStatus(req: AuthenticatedRequest, res: Response): void {
    res.json({
      useMock: config.ai.useMock,
      provider: config.ai.useMock ? 'Mock-Assistent' : 'Mistral AI',
      model: config.ai.mistralModel,
      readyForMistral: Boolean(config.ai.mistralApiKey && config.ai.mistralApiKey !== 'mock-key'),
    });
  }
}

export const aiController = new AiController();
