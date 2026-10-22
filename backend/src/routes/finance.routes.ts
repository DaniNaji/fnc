import { Router } from 'express';
import { financeController } from '../controllers/finance.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => financeController.getFinances(req, res));
router.put('/', (req, res) => financeController.saveFinances(req, res));
router.post('/bookings', (req, res) => financeController.addBooking(req, res));
router.delete('/bookings/:id', (req, res) => financeController.deleteBooking(req, res));
router.post('/reset', (req, res) => financeController.resetFinances(req, res));
router.get('/export', (req, res) => financeController.exportData(req, res));

export default router;
