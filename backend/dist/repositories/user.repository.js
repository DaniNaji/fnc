"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const db_1 = require("../database/db");
class UserRepository {
    async findById(id) {
        const users = db_1.db.getData().users;
        return users[id] || null;
    }
    async findByEmail(email) {
        const users = db_1.db.getData().users;
        const normalizedEmail = email.toLowerCase().trim();
        for (const id in users) {
            if (users[id].email.toLowerCase().trim() === normalizedEmail) {
                return users[id];
            }
        }
        return null;
    }
    async create(user) {
        const data = db_1.db.getData();
        data.users[user.id] = user;
        db_1.db.persist();
        return user;
    }
    async update(id, updates) {
        const data = db_1.db.getData();
        if (!data.users[id])
            return null;
        data.users[id] = {
            ...data.users[id],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        db_1.db.persist();
        return data.users[id];
    }
    async delete(id) {
        const data = db_1.db.getData();
        if (!data.users[id])
            return false;
        delete data.users[id];
        delete data.finances[id]; // cascade delete finances
        db_1.db.persist();
        return true;
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
