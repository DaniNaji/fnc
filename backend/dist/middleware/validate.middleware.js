"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod");
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const issues = error.issues.map((i) => i.message);
                res.status(400).json({ error: issues[0] || 'Ungültige Eingabedaten.', details: issues });
                return;
            }
            res.status(400).json({ error: 'Ungültige Anfrage.' });
        }
    };
};
exports.validateBody = validateBody;
