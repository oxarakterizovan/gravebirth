// ============================================
// ГЛАВНОЕ ПРИЛОЖЕНИЕ
// ============================================

import { AuthManager } from './features/auth/AuthManager.js';
import { ForumManager } from './features/forum/ForumManager.js';
import { ProfileManager } from './features/profile/ProfileManager.js';
import { NotificationManager } from './ui/notifications/NotificationManager.js';
import { NavigationManager } from './ui/navigation/NavigationManager.js';

class App {
    constructor() {
        this.auth = new AuthManager();
        this.forum = new ForumManager();
        this.profile = new ProfileManager();
        this.notifications = new NotificationManager();
        this.navigation = new NavigationManager();
    }

    init() {
        this.auth.init();
        this.forum.init();
        this.profile.init();
        this.notifications.init();
        this.navigation.init();
        
        console.log('VimeTalks App initialized');
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});