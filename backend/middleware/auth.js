const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gravebirth_secret_key';

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Недействительный токен' });
    }
};

module.exports = auth;