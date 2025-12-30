const bcrypt = require('bcryptjs');

class User {
    constructor() {
        this.users = new Map();
        this.nextId = 1;
        this.initDefaultUsers();
    }
    
    initDefaultUsers() {
        // Создаем админа по умолчанию
        this.create({
            username: 'GRAVEBIRTH',
            email: 'admin@gravebirth.com',
            password: '$2a$10$example.hash.for.password123',
            avatar: 'GB',
            regDate: '27 Янв 2025',
            isAdmin: true,
            messages: 5,
            reactions: 42,
            topics: 12,
            replies: 45,
            loginCount: 156,
            avatarHistory: []
        });
    }
    
    create(userData) {
        const user = {
            id: this.nextId++,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            avatar: userData.avatar || userData.username.charAt(0).toUpperCase(),
            avatarImage: userData.avatarImage || null,
            avatarHistory: userData.avatarHistory || [],
            regDate: userData.regDate || new Date().toLocaleDateString('ru-RU'),
            messages: userData.messages || 0,
            reactions: userData.reactions || 0,
            topics: userData.topics || 0,
            replies: userData.replies || 0,
            status: 'Online',
            loginCount: userData.loginCount || 1,
            lastLogin: new Date().toLocaleString(),
            userId: `#${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            isAdmin: userData.isAdmin || false,
            privacy: {
                profile: 'public',
                posts: 'public',
                online: true,
                activity: true
            },
            security: {
                twoFactor: false,
                phone: null
            },
            settings: {
                notifications: true,
                language: 'ru',
                theme: 'dark',
                forumNotifications: true,
                messageNotifications: true
            }
        };
        
        this.users.set(user.id, user);
        return user;
    }
    
    findById(id) {
        return this.users.get(id);
    }
    
    findByEmail(email) {
        for (let user of this.users.values()) {
            if (user.email === email) return user;
        }
        return null;
    }
    
    findByUsername(username) {
        for (let user of this.users.values()) {
            if (user.username === username) return user;
        }
        return null;
    }
    
    update(id, updates) {
        const user = this.users.get(id);
        if (!user) return null;
        
        Object.assign(user, updates);
        return user;
    }
    
    updateLoginStats(id) {
        const user = this.users.get(id);
        if (user) {
            user.loginCount = (user.loginCount || 0) + 1;
            user.lastLogin = new Date().toLocaleString();
            user.status = 'Online';
        }
    }
    
    addToAvatarHistory(id, avatarData) {
        const user = this.users.get(id);
        if (!user) return false;
        
        if (!user.avatarHistory) user.avatarHistory = [];
        
        user.avatarHistory.unshift({
            data: avatarData,
            timestamp: Date.now()
        });
        
        if (user.avatarHistory.length > 6) {
            user.avatarHistory = user.avatarHistory.slice(0, 6);
        }
        
        return true;
    }
    
    async changePassword(id, currentPassword, newPassword) {
        const user = this.users.get(id);
        if (!user) return false;
        
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) return false;
        
        user.password = await bcrypt.hash(newPassword, 10);
        return true;
    }
}

module.exports = new User();