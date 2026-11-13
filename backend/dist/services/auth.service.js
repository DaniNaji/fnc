"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const user_repository_1 = require("../repositories/user.repository");
class AuthService {
    generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, name: user.name }, config_1.config.jwt.secret, { expiresIn: config_1.config.jwt.expiresIn });
    }
    toProfileResponse(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    }
    async register(email, password, name) {
        const normalizedEmail = email.toLowerCase().trim();
        const existing = await user_repository_1.userRepository.findByEmail(normalizedEmail);
        if (existing) {
            throw new Error('Für diese E-Mail-Adresse existiert bereits ein Benutzerkonto.');
        }
        if (password.length < 10) {
            throw new Error('Das Passwort muss mindestens 10 Zeichen lang sein.');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const now = new Date().toISOString();
        const user = {
            id,
            email: normalizedEmail,
            name: name?.trim() || normalizedEmail.split('@')[0],
            passwordHash,
            createdAt: now,
            updatedAt: now,
        };
        const created = await user_repository_1.userRepository.create(user);
        const token = this.generateToken(created);
        return {
            token,
            user: this.toProfileResponse(created),
        };
    }
    async login(email, password) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await user_repository_1.userRepository.findByEmail(normalizedEmail);
        if (!user) {
            throw new Error('E-Mail-Adresse oder Passwort ist ungültig.');
        }
        const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            throw new Error('E-Mail-Adresse oder Passwort ist ungültig.');
        }
        const token = this.generateToken(user);
        return {
            token,
            user: this.toProfileResponse(user),
        };
    }
    async getProfile(userId) {
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user) {
            throw new Error('Benutzer wurde nicht gefunden.');
        }
        return this.toProfileResponse(user);
    }
    async updateProfile(userId, params) {
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user) {
            throw new Error('Benutzer nicht gefunden.');
        }
        const updates = {};
        if (params.name) {
            updates.name = params.name.trim();
        }
        if (params.email && params.email.toLowerCase().trim() !== user.email) {
            if (!params.currentPassword) {
                throw new Error('Für eine Änderung der E-Mail-Adresse muss das aktuelle Passwort angegeben werden.');
            }
            const isPwValid = await bcryptjs_1.default.compare(params.currentPassword, user.passwordHash);
            if (!isPwValid) {
                throw new Error('Das aktuelle Passwort ist falsch.');
            }
            const emailCheck = await user_repository_1.userRepository.findByEmail(params.email);
            if (emailCheck && emailCheck.id !== userId) {
                throw new Error('Diese E-Mail-Adresse wird bereits verwendet.');
            }
            updates.email = params.email.toLowerCase().trim();
        }
        const updated = await user_repository_1.userRepository.update(userId, updates);
        if (!updated) {
            throw new Error('Aktualisierung fehlgeschlagen.');
        }
        return this.toProfileResponse(updated);
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user) {
            throw new Error('Benutzer nicht gefunden.');
        }
        const isPwValid = await bcryptjs_1.default.compare(oldPassword, user.passwordHash);
        if (!isPwValid) {
            throw new Error('Das aktuelle Passwort ist nicht korrekt.');
        }
        if (newPassword.length < 10) {
            throw new Error('Das neue Passwort muss mindestens 10 Zeichen lang sein.');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
        await user_repository_1.userRepository.update(userId, { passwordHash });
    }
    async deleteAccount(userId, passwordConfirm) {
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user) {
            throw new Error('Benutzer nicht gefunden.');
        }
        const isPwValid = await bcryptjs_1.default.compare(passwordConfirm, user.passwordHash);
        if (!isPwValid) {
            throw new Error('Das eingegebene Passwort ist nicht korrekt.');
        }
        await user_repository_1.userRepository.delete(userId);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
