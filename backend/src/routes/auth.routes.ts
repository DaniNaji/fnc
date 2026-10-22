import { Router } from 'express';
import {
  authController,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.post('/register', validateBody(registerSchema), (req, res) =>
  authController.register(req, res)
);

router.post('/login', validateBody(loginSchema), (req, res) =>
  authController.login(req, res)
);

router.get('/me', authenticateToken, (req, res) =>
  authController.me(req, res)
);

router.put('/profile', authenticateToken, validateBody(updateProfileSchema), (req, res) =>
  authController.updateProfile(req, res)
);

router.post('/change-password', authenticateToken, validateBody(changePasswordSchema), (req, res) =>
  authController.changePassword(req, res)
);

router.post('/delete-account', authenticateToken, validateBody(deleteAccountSchema), (req, res) =>
  authController.deleteAccount(req, res)
);

export default router;
