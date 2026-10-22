import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, UserProfileResponse } from '../models/user.model';
import { userRepository } from '../repositories/user.repository';

export interface AuthTokens {
  token: string;
  user: UserProfileResponse;
}

export class AuthService {
  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );
  }

  private toProfileResponse(user: User): UserProfileResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  public async register(email: string, password: string, name?: string): Promise<AuthTokens> {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new Error('Für diese E-Mail-Adresse existiert bereits ein Benutzerkonto.');
    }

    if (password.length < 10) {
      throw new Error('Das Passwort muss mindestens 10 Zeichen lang sein.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const now = new Date().toISOString();

    const user: User = {
      id,
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail.split('@')[0],
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    const created = await userRepository.create(user);
    const token = this.generateToken(created);

    return {
      token,
      user: this.toProfileResponse(created),
    };
  }

  public async login(email: string, password: string): Promise<AuthTokens> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new Error('E-Mail-Adresse oder Passwort ist ungültig.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('E-Mail-Adresse oder Passwort ist ungültig.');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: this.toProfileResponse(user),
    };
  }

  public async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Benutzer wurde nicht gefunden.');
    }
    return this.toProfileResponse(user);
  }

  public async updateProfile(
    userId: string,
    params: { name?: string; email?: string; currentPassword?: string }
  ): Promise<UserProfileResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Benutzer nicht gefunden.');
    }

    const updates: Partial<User> = {};

    if (params.name) {
      updates.name = params.name.trim();
    }

    if (params.email && params.email.toLowerCase().trim() !== user.email) {
      if (!params.currentPassword) {
        throw new Error('Für eine Änderung der E-Mail-Adresse muss das aktuelle Passwort angegeben werden.');
      }
      const isPwValid = await bcrypt.compare(params.currentPassword, user.passwordHash);
      if (!isPwValid) {
        throw new Error('Das aktuelle Passwort ist falsch.');
      }

      const emailCheck = await userRepository.findByEmail(params.email);
      if (emailCheck && emailCheck.id !== userId) {
        throw new Error('Diese E-Mail-Adresse wird bereits verwendet.');
      }

      updates.email = params.email.toLowerCase().trim();
    }

    const updated = await userRepository.update(userId, updates);
    if (!updated) {
      throw new Error('Aktualisierung fehlgeschlagen.');
    }

    return this.toProfileResponse(updated);
  }

  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Benutzer nicht gefunden.');
    }

    const isPwValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPwValid) {
      throw new Error('Das aktuelle Passwort ist nicht korrekt.');
    }

    if (newPassword.length < 10) {
      throw new Error('Das neue Passwort muss mindestens 10 Zeichen lang sein.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await userRepository.update(userId, { passwordHash });
  }

  public async deleteAccount(userId: string, passwordConfirm: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('Benutzer nicht gefunden.');
    }

    const isPwValid = await bcrypt.compare(passwordConfirm, user.passwordHash);
    if (!isPwValid) {
      throw new Error('Das eingegebene Passwort ist nicht korrekt.');
    }

    await userRepository.delete(userId);
  }
}

export const authService = new AuthService();
