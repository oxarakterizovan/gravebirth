const express = require('express');
const Forum = require('../models/Forum');
const auth = require('../middleware/auth');

const router = express.Router();

// Получение всех тем
router.get('/topics', (req, res) => {
    const topics = Forum.getAllTopics();
    res.json(topics);
});

// Создание новой темы
router.post('/topics', auth, (req, res) => {
    const { title, content, category, tags } = req.body;
    
    const topic = Forum.createTopic({
        title,
        content,
        category,
        tags,
        authorId: req.userId
    });
    
    res.json(topic);
});

// Получение темы по ID
router.get('/topics/:id', (req, res) => {
    const topic = Forum.getTopicById(req.params.id);
    if (!topic) {
        return res.status(404).json({ error: 'Тема не найдена' });
    }
    
    // Увеличиваем счетчик просмотров
    Forum.incrementViews(req.params.id);
    
    res.json(topic);
});

// Добавление ответа к теме
router.post('/topics/:id/replies', auth, (req, res) => {
    const { content } = req.body;
    
    const reply = Forum.addReply(req.params.id, {
        content,
        authorId: req.userId
    });
    
    if (!reply) {
        return res.status(404).json({ error: 'Тема не найдена' });
    }
    
    res.json(reply);
});

// Получение статистики форума
router.get('/stats', (req, res) => {
    const stats = Forum.getStats();
    res.json(stats);
});

module.exports = router;