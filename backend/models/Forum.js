const User = require('./User');

class Forum {
    constructor() {
        this.topics = new Map();
        this.replies = new Map();
        this.nextTopicId = 1;
        this.nextReplyId = 1;
    }
    
    createTopic(topicData) {
        const author = User.findById(topicData.authorId);
        if (!author) return null;
        
        const topic = {
            id: this.nextTopicId++,
            title: topicData.title,
            content: topicData.content,
            category: topicData.category,
            tags: topicData.tags || [],
            author: author.username,
            authorId: topicData.authorId,
            date: new Date().toLocaleString('ru-RU'),
            replies: 0,
            views: 0,
            isPopular: false,
            hasAnswers: false,
            isAdminOnly: author.isAdmin
        };
        
        this.topics.set(topic.id, topic);
        
        // Обновляем статистику пользователя
        author.topics = (author.topics || 0) + 1;
        
        return topic;
    }
    
    getTopicById(id) {
        return this.topics.get(parseInt(id));
    }
    
    getAllTopics() {
        return Array.from(this.topics.values()).sort((a, b) => b.id - a.id);
    }
    
    incrementViews(id) {
        const topic = this.topics.get(parseInt(id));
        if (topic) {
            topic.views++;
        }
    }
    
    addReply(topicId, replyData) {
        const topic = this.topics.get(parseInt(topicId));
        const author = User.findById(replyData.authorId);
        
        if (!topic || !author) return null;
        
        const reply = {
            id: this.nextReplyId++,
            topicId: parseInt(topicId),
            content: replyData.content,
            author: author.username,
            authorId: replyData.authorId,
            date: new Date().toLocaleString('ru-RU')
        };
        
        this.replies.set(reply.id, reply);
        
        // Обновляем статистику темы
        topic.replies++;
        topic.hasAnswers = true;
        
        // Обновляем статистику пользователя
        author.replies = (author.replies || 0) + 1;
        
        return reply;
    }
    
    getTopicReplies(topicId) {
        const replies = [];
        for (let reply of this.replies.values()) {
            if (reply.topicId === parseInt(topicId)) {
                replies.push(reply);
            }
        }
        return replies.sort((a, b) => a.id - b.id);
    }
    
    getStats() {
        const totalTopics = this.topics.size;
        const totalReplies = this.replies.size;
        const totalUsers = User.users ? User.users.size : 1;
        
        let hotTopics = 0;
        for (let topic of this.topics.values()) {
            if (topic.views > 10 || topic.replies > 5) {
                hotTopics++;
            }
        }
        
        return {
            activeTopics: totalTopics,
            communityMembers: totalUsers,
            totalReplies: totalReplies,
            hotTopics: hotTopics
        };
    }
}

module.exports = new Forum();