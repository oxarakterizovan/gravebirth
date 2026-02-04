const crypto = require('crypto');

// Простая CSRF защита для демо-проекта
class CSRFProtection {
    constructor() {
        this.tokens = new Map();
    }

    generateToken(sessionId) {
        const token = crypto.randomBytes(32).toString('hex');
        this.tokens.set(sessionId, token);
        return token;
    }

    validateToken(sessionId, token) {
        const storedToken = this.tokens.get(sessionId);
        return storedToken && storedToken === token;
    }

    middleware() {
        return (req, res, next) => {
            if (req.method === 'GET') {
                // Генерируем токен для GET запросов
                const sessionId = req.sessionID || req.ip;
                const token = this.generateToken(sessionId);
                res.locals.csrfToken = token;
                return next();
            }

            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                const sessionId = req.sessionID || req.ip;
                const token = req.body._csrf || req.headers['x-csrf-token'];
                
                if (!this.validateToken(sessionId, token)) {
                    return res.status(403).json({ error: 'Invalid CSRF token' });
                }
            }

            next();
        };
    }
}

module.exports = new CSRFProtection();