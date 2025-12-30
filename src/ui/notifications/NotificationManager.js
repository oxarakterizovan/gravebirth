// ============================================
// МЕНЕДЖЕР УВЕДОМЛЕНИЙ
// ============================================

export class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
    }

    init() {
        this.createContainer();
    }

    show(title, message, type = 'info', duration = 5000) {
        const notification = this.createNotification(title, message, type);
        this.container.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }
    }

    createNotification(title, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${this.getIcon(type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">×</button>
        `;
        
        notification.querySelector('.notification-close').onclick = () => this.remove(notification);
        return notification;
    }

    remove(notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.id = 'notificationContainer';
        document.body.appendChild(this.container);
    }

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}