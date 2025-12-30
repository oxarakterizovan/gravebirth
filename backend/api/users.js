const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Получение профиля пользователя
router.get('/profile', auth, (req, res) => {
    const user = User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        avatarImage: user.avatarImage,
        avatarHistory: user.avatarHistory,
        regDate: user.regDate,
        messages: user.messages,
        reactions: user.reactions,
        topics: user.topics,
        replies: user.replies,
        status: user.status,
        loginCount: user.loginCount,
        lastLogin: user.lastLogin,
        isAdmin: user.isAdmin
    });
});

// Обновление профиля
router.put('/profile', auth, (req, res) => {
    const { username, email, avatar, avatarImage } = req.body;
    
    const updatedUser = User.update(req.userId, {
        username,
        email,
        avatar,
        avatarImage
    });
    
    if (!updatedUser) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json({ message: 'Профиль обновлен' });
});

// Обновление аватара
router.post('/avatar', auth, (req, res) => {
    const { avatarData } = req.body;
    
    const user = User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    // Добавляем в историю аватаров
    User.addToAvatarHistory(req.userId, avatarData);
    
    res.json({ message: 'Аватар обновлен' });
});

// Смена пароля
router.put('/password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    try {
        const result = await User.changePassword(req.userId, currentPassword, newPassword);
        if (!result) {
            return res.status(400).json({ error: 'Неверный текущий пароль' });
        }
        
        res.json({ message: 'Пароль изменен' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;