"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = exports.deleteAccountSchema = exports.changePasswordSchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const auth_service_1 = require("../services/auth.service");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Bitte gib eine gültige E-Mail-Adresse ein.'),
    password: zod_1.z.string().min(10, 'Das Passwort muss mindestens 10 Zeichen lang sein.'),
    name: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Bitte gib eine gültige E-Mail-Adresse ein.'),
    password: zod_1.z.string().min(1, 'Passwort erforderlich.'),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email('Ungültige E-Mail').optional(),
    currentPassword: zod_1.z.string().optional(),
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(1, 'Altes Passwort erforderlich.'),
    newPassword: zod_1.z.string().min(10, 'Das neue Passwort muss mindestens 10 Zeichen lang sein.'),
});
exports.deleteAccountSchema = zod_1.z.object({
    password: zod_1.z.string().min(1, 'Passwort erforderlich.'),
});
class AuthController {
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
            const result = await auth_service_1.authService.register(email, password, name);
            res.status(201).json(result);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login(email, password);
            res.json(result);
        }
        catch (err) {
            res.status(401).json({ error: err.message });
        }
    }
    async me(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            const profile = await auth_service_1.authService.getProfile(req.user.id);
            res.json(profile);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async updateProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            const updated = await auth_service_1.authService.updateProfile(req.user.id, req.body);
            res.json(updated);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async changePassword(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            await auth_service_1.authService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
            res.json({ message: 'Passwort erfolgreich geändert.' });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    async deleteAccount(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            await auth_service_1.authService.deleteAccount(req.user.id, req.body.password);
            res.json({ message: 'Konto und alle Daten wurden endgültig gelöscht.' });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
