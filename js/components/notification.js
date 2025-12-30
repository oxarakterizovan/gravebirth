// Notification Component
const NotificationComponent = {
    container: null,
    
    init: () => {
        NotificationComponent.container = DOM.get('notificationContainer');
    },
    
    show: (title, message, type = 'info', duration = 5000) => {
        if (!AppState.get('notifications')) return;
        
        const notification = DOM.create('div', `notification notification-${type}`);
        
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        NotificationComponent.container.appendChild(notification);
        
        setTimeout(() => DOM.addClass(notification, 'show'), 10);
        
        const closeBtn = notification.querySelector('.notification-close');
        DOM.on(closeBtn, 'click', () => NotificationComponent.remove(notification));
        
        if (duration > 0) {
            setTimeout(() => NotificationComponent.remove(notification), duration);
        }
        
        if (AppState.get('sound') && type !== 'info') {
            NotificationComponent.playSound(type);
        }
        
        return notification;
    },
    
    remove: (notification) => {
        DOM.removeClass(notification, 'show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },
    
    playSound: (type) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = type === 'success' ? 800 : type === 'error' ? 400 : 600;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio context not supported');
        }
    }
};