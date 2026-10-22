import { db } from '../database/db';
import { User } from '../models/user.model';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const users = db.getData().users;
    return users[id] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = db.getData().users;
    const normalizedEmail = email.toLowerCase().trim();
    for (const id in users) {
      if (users[id].email.toLowerCase().trim() === normalizedEmail) {
        return users[id];
      }
    }
    return null;
  }

  async create(user: User): Promise<User> {
    const data = db.getData();
    data.users[user.id] = user;
    db.persist();
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const data = db.getData();
    if (!data.users[id]) return null;

    data.users[id] = {
      ...data.users[id],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db.persist();
    return data.users[id];
  }

  async delete(id: string): Promise<boolean> {
    const data = db.getData();
    if (!data.users[id]) return false;

    delete data.users[id];
    delete data.finances[id]; // cascade delete finances
    db.persist();
    return true;
  }
}

export const userRepository = new UserRepository();
