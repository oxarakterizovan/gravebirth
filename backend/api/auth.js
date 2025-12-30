const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gravebirth_secret_key';

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Проверка существования пользователя
        const existingUser = User.findByEmail(email) || User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }
        
        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Создание пользователя
        const user = User.create({
            username,
            email,
            password: hashedPassword,
            avatar: username.charAt(0).toUpperCase(),
            regDate: new Date().toLocaleDateString('ru-RU'),
            isAdmin: false
        });
        
        // Создание JWT токена
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Вход
router.post('/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        
        // Поиск пользователя
        const user = User.findByEmail(usernameOrEmail) || User.findByUsername(usernameOrEmail);
        if (!user) {
            return res.status(400).json({ error: 'Неверные данные' });
        }
        
        // Проверка пароля
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Неверные данные' });
        }
        
        // Обновление статистики входа
        User.updateLoginStats(user.id);
        
        // Создание JWT токена
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                avatarImage: user.avatarImage,
                isAdmin: user.isAdmin,
                loginCount: user.loginCount,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Проверка токена
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }
        
        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                avatarImage: user.avatarImage,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(401).json({ error: 'Недействительный токен' });
    }
});

module.exports = router;