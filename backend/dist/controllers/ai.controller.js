"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = exports.AiController = void 0;
const ai_service_1 = require("../services/ai.service");
const finance_service_1 = require("../services/finance.service");
const config_1 = require("../config");
class AiController {
    async analyze(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Nicht angemeldet.' });
                return;
            }
            // Can analyze either provided data or stored user data
            const data = req.body && Object.keys(req.body).length > 0
                ? req.body
                : await finance_service_1.financeService.getFinances(req.user.id);
            const result = await ai_service_1.aiService.analyze(data);
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    getStatus(req, res) {
        res.json({
            useMock: config_1.config.ai.useMock,
            provider: config_1.config.ai.useMock ? 'Mock-Assistent' : 'Mistral AI',
            model: config_1.config.ai.mistralModel,
            readyForMistral: Boolean(config_1.config.ai.mistralApiKey && config_1.config.ai.mistralApiKey !== 'mock-key'),
        });
    }
}
exports.AiController = AiController;
exports.aiController = new AiController();
