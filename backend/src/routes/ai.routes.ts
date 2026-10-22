import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/analyze', (req, res) => aiController.analyze(req, res));
router.get('/status', (req, res) => aiController.getStatus(req, res));

export default router;
