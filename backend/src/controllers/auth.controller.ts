import { Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const registerSchema = z.object({
  email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein.'),
  password: z.string().min(10, 'Das Passwort muss mindestens 10 Zeichen lang sein.'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Bitte gib eine gültige E-Mail-Adresse ein.'),
  password: z.string().min(1, 'Passwort erforderlich.'),
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Ungültige E-Mail').optional(),
  currentPassword: z.string().optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Altes Passwort erforderlich.'),
  newPassword: z.string().min(10, 'Das neue Passwort muss mindestens 10 Zeichen lang sein.'),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Passwort erforderlich.'),
});

export class AuthController {
  public async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register(email, password, name);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  public async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      const profile = await authService.getProfile(req.user.id);
      res.json(profile);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      const updated = await authService.updateProfile(req.user.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      await authService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
      res.json({ message: 'Passwort erfolgreich geändert.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public async deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Nicht angemeldet.' });
        return;
      }
      await authService.deleteAccount(req.user.id, req.body.password);
      res.json({ message: 'Konto und alle Daten wurden endgültig gelöscht.' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export const authController = new AuthController();
