"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.JsonDatabase = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
class JsonDatabase {
    static instance;
    dbPath;
    data;
    isWriting = false;
    constructor() {
        this.dbPath = path_1.default.join(config_1.config.storage.dataDir, 'app_database.json');
        this.data = { users: {}, finances: {} };
        this.init();
    }
    static getInstance() {
        if (!JsonDatabase.instance) {
            JsonDatabase.instance = new JsonDatabase();
        }
        return JsonDatabase.instance;
    }
    init() {
        try {
            if (!fs_1.default.existsSync(config_1.config.storage.dataDir)) {
                fs_1.default.mkdirSync(config_1.config.storage.dataDir, { recursive: true });
            }
            if (fs_1.default.existsSync(this.dbPath)) {
                const fileContent = fs_1.default.readFileSync(this.dbPath, 'utf-8');
                if (fileContent.trim()) {
                    this.data = JSON.parse(fileContent);
                    if (!this.data.users)
                        this.data.users = {};
                    if (!this.data.finances)
                        this.data.finances = {};
                }
            }
            else {
                this.persist();
            }
        }
        catch (error) {
            console.error('[DB] Error initializing database:', error);
            this.data = { users: {}, finances: {} };
        }
    }
    persist() {
        if (this.isWriting)
            return;
        this.isWriting = true;
        try {
            const tempPath = `${this.dbPath}.tmp`;
            fs_1.default.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
            fs_1.default.renameSync(tempPath, this.dbPath);
        }
        catch (err) {
            console.error('[DB] Error persisting database:', err);
        }
        finally {
            this.isWriting = false;
        }
    }
    getData() {
        return this.data;
    }
}
exports.JsonDatabase = JsonDatabase;
exports.db = JsonDatabase.getInstance();
