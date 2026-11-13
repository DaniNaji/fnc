"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AiService = void 0;
const config_1 = require("../config");
class AiService {
    formatEuro(amount) {
        return amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    }
    calculateMonthlyAmount(sub) {
        const factor = {
            Monat: 1,
            Quartal: 1 / 3,
            Jahr: 1 / 12,
            Woche: 52 / 12,
        };
        return (sub.amt || 0) * (factor[sub.iv] || 1);
    }
    /**
     * Generates a realistic, highly personalized mock analysis based on real user numbers
     */
    generateMockAnalysis(data) {
        const subs = data.subs || [];
        const rates = data.rates || [];
        const banks = data.banks || [];
        const todos = data.todos || [];
        const accts = data.accts || [];
        const monthlySubs = subs.reduce((sum, s) => sum + this.calculateMonthlyAmount(s), 0);
        const monthlyRates = rates.reduce((sum, r) => sum + (r.amt || 0), 0);
        const monthlyBankFees = banks.reduce((sum, b) => {
            const f = { Monat: 1, Quartal: 1 / 3, Jahr: 1 / 12 };
            return sum + (b.amt || 0) * (f[b.iv] || 1);
        }, 0);
        const totalFixedMonthly = monthlySubs + monthlyRates + monthlyBankFees;
        const totalYearly = totalFixedMonthly * 12;
        // Group subscriptions by category
        const categoryTotals = {};
        for (const sub of subs) {
            if (!categoryTotals[sub.cat]) {
                categoryTotals[sub.cat] = { total: 0, items: [] };
            }
            categoryTotals[sub.cat].total += this.calculateMonthlyAmount(sub);
            categoryTotals[sub.cat].items.push(sub.name);
        }
        // Find category overlaps
        const overlaps = [];
        for (const [cat, info] of Object.entries(categoryTotals)) {
            if (info.items.length > 1) {
                overlaps.push(`${cat} (${info.items.join(', ')})`);
            }
        }
        // Identify biggest cost
        const sortedSubs = [...subs].sort((a, b) => this.calculateMonthlyAmount(b) - this.calculateMonthlyAmount(a));
        const biggestSub = sortedSubs[0];
        let output = '';
        output += `Übersicht der Fixkosten\n`;
        output += `Deine monatlichen festen Verpflichtungen belaufen sich auf ${this.formatEuro(totalFixedMonthly)} (hochgerechnet ${this.formatEuro(totalYearly)} pro Jahr).\n`;
        output += `Davon entfallen ${this.formatEuro(monthlySubs)} auf Abonnements (${subs.length} aktiv), `;
        output += `${this.formatEuro(monthlyRates)} auf laufende Raten und `;
        output += `${this.formatEuro(monthlyBankFees)} auf Kontogebühren.\n\n`;
        output += `Schwerpunkte und Auffälligkeiten\n`;
        if (biggestSub) {
            const share = totalFixedMonthly > 0 ? Math.round((this.calculateMonthlyAmount(biggestSub) / totalFixedMonthly) * 100) : 0;
            output += `• Größter Einzelposten bei den Abos ist „${biggestSub.name}“ mit ${this.formatEuro(this.calculateMonthlyAmount(biggestSub))} monatlich (ca. ${share}% deiner monatlichen Fixkosten).\n`;
        }
        if (overlaps.length > 0) {
            output += `• Überschneidungen bestehen in folgenden Bereichen: ${overlaps.join('; ')}.\n`;
        }
        else {
            output += `• Deine Abonnements verteilen sich gleichmäßig auf unterschiedliche Lebensbereiche ohne direkte Doppler.\n`;
        }
        if (rates.length > 0) {
            const totalRemainingDebt = rates.reduce((sum, r) => sum + (r.amt || 0) * (r.left || 0), 0);
            output += `• Es bestehen ${rates.length} aktive Ratenverpflichtungen mit einer verbleibenden Gesamtsumme von ${this.formatEuro(totalRemainingDebt)}.\n`;
        }
        output += `\nOffene Aufgaben und Konten\n`;
        output += `Du hast aktuell ${todos.filter((t) => !t.done).length} offene Aufgaben und ${accts.length} registrierte Benutzerkonten erfasst.\n\n`;
        output += `Neutrale Reflexionsfragen\n`;
        const q1 = biggestSub
            ? `1. Nutzt du „${biggestSub.name}“ noch so intensiv, dass der monatliche Betrag für dich stimmig ist?`
            : `1. Gibt es Abos, die du im letzten Monat nicht aktiv genutzt hast?`;
        const q2 = overlaps.length > 0
            ? `2. Nutzen du oder Mitbenutzer alle Dienste im Bereich ${overlaps[0]} regelmäßig parallel?`
            : `2. Stehen in den nächsten 30 Tagen Kündigungsfristen oder Ratenabläufe an?`;
        const q3 = banks.length > 0
            ? `3. Erfüllst du bei deinen Banken Bedingungen (z. B. Mindestgeldeingang), um Gebühren zu vermeiden?`
            : `3. Hast du alle regelmäßigen Jahresbeiträge bereits mit einem Fälligkeitsdatum versehen?`;
        output += `${q1}\n${q2}\n${q3}\n`;
        return {
            text: output.trim(),
            source: 'mock',
            generatedAt: new Date().toISOString(),
            disclaimer: 'Von KI erstellt (Mock-Modus). Reine Beschreibung deiner eingetragenen Zahlen – keine Anlage-, Steuer- oder Finanzberatung.',
        };
    }
    /**
     * Calls the official Mistral AI API when a real key is present and USE_MOCK_AI is false
     */
    async generateMistralAnalysis(data) {
        const promptPayload = {
            abos: (data.subs || []).map((x) => ({
                name: x.name,
                betrag: x.amt,
                intervall: x.iv,
                kategorie: x.cat,
            })),
            raten: (data.rates || []).map((r) => ({
                name: r.name,
                rate: r.amt,
                verbleibend: r.left,
            })),
            banken: (data.banks || []).map((b) => ({
                bank: b.name,
                kontoart: b.type,
                gebuehr: b.amt,
                intervall: b.iv,
            })),
            offene_todos: (data.todos || []).filter((t) => !t.done).length,
            konten_anzahl: (data.accts || []).length,
        };
        const systemPrompt = `Du bist ein neutraler Auswertungsassistent in einer Übersichts-App für Abos, Raten und Kontogebühren.
Antworte auf Deutsch in verständlichem, sachlichem Fließtext ohne Markdown-Kopfzeilen (#), mit kurzen Absätzen und Zwischenüberschriften in eigenen Zeilen. Höchstens 250 Wörter.
Beschreibe ausschließlich die gelieferten Zahlen:
1) Die größten Kostenblöcke und ihren Anteil an den monatlichen Fixkosten
2) Überschneidungen innerhalb derselben Kategorie (z. B. mehrere Streamingdienste)
3) Kontogebühren und Jahressummen
4) 3 neutrale Prüffragen an den Nutzer zur Selbstreflexion
WICHTIG: Gib keine Finanz-, Anlage-, Steuer- oder Rechtsberatung. Empfiehl keine Produkte, Anbieter, Banken, Kredite oder Versicherungen. Formuliere als neutrale Beobachtung, nicht als Handlungsanweisung.`;
        const userPrompt = `Hier sind die Finanzdaten als JSON:\n${JSON.stringify(promptPayload, null, 2)}`;
        const response = await fetch(config_1.config.ai.mistralEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config_1.config.ai.mistralApiKey}`,
            },
            body: JSON.stringify({
                model: config_1.config.ai.mistralModel,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.3,
                max_tokens: 600,
            }),
        });
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Mistral API Error (${response.status}): ${errText}`);
        }
        const json = (await response.json());
        const content = json.choices?.[0]?.message?.content || 'Keine Antwort von Mistral generiert.';
        return {
            text: content.trim(),
            source: 'mistral',
            generatedAt: new Date().toISOString(),
            disclaimer: 'Von Mistral KI erstellt. Reine Beschreibung deiner eingetragenen Zahlen – keine Anlage-, Steuer- oder Finanzberatung.',
        };
    }
    /**
     * Main service handler: dynamically chooses between Mock mode and Mistral API
     */
    async analyze(data) {
        const hasAnyData = (data.subs && data.subs.length > 0) ||
            (data.rates && data.rates.length > 0) ||
            (data.banks && data.banks.length > 0);
        if (!hasAnyData) {
            return {
                text: 'Trage zuerst mindestens ein Abonnement, eine Ratenzahlung oder ein Bankkonto ein, um eine aussagekräftige Auswertung zu erhalten.',
                source: config_1.config.ai.useMock ? 'mock' : 'mistral',
                generatedAt: new Date().toISOString(),
                disclaimer: 'Reine Beschreibung deiner eingetragenen Zahlen.',
            };
        }
        if (config_1.config.ai.useMock || !config_1.config.ai.mistralApiKey || config_1.config.ai.mistralApiKey === 'mock-key') {
            return this.generateMockAnalysis(data);
        }
        try {
            return await this.generateMistralAnalysis(data);
        }
        catch (error) {
            console.warn('[AI Service] Mistral API request failed, falling back to smart mock analysis:', error);
            const fallback = this.generateMockAnalysis(data);
            fallback.text = `[Hinweis: Mistral API nicht erreichbar, lokale Auswertung erstellt]\n\n` + fallback.text;
            return fallback;
        }
    }
}
exports.AiService = AiService;
exports.aiService = new AiService();
