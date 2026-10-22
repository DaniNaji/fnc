import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { User } from '../models/user.model';
import { UserFinanceData } from '../models/finance.model';

interface DatabaseSchema {
  users: Record<string, User>;
  finances: Record<string, UserFinanceData>;
}

export class JsonDatabase {
  private static instance: JsonDatabase;
  private dbPath: string;
  private data: DatabaseSchema;
  private isWriting = false;

  private constructor() {
    this.dbPath = path.join(config.storage.dataDir, 'app_database.json');
    this.data = { users: {}, finances: {} };
    this.init();
  }

  public static getInstance(): JsonDatabase {
    if (!JsonDatabase.instance) {
      JsonDatabase.instance = new JsonDatabase();
    }
    return JsonDatabase.instance;
  }

  private init() {
    try {
      if (!fs.existsSync(config.storage.dataDir)) {
        fs.mkdirSync(config.storage.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dbPath)) {
        const fileContent = fs.readFileSync(this.dbPath, 'utf-8');
        if (fileContent.trim()) {
          this.data = JSON.parse(fileContent);
          if (!this.data.users) this.data.users = {};
          if (!this.data.finances) this.data.finances = {};
        }
      } else {
        this.persist();
      }
    } catch (error) {
      console.error('[DB] Error initializing database:', error);
      this.data = { users: {}, finances: {} };
    }
  }

  public persist(): void {
    if (this.isWriting) return;
    this.isWriting = true;
    try {
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.dbPath);
    } catch (err) {
      console.error('[DB] Error persisting database:', err);
    } finally {
      this.isWriting = false;
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }
}

export const db = JsonDatabase.getInstance();
