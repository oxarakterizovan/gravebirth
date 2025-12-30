// ============================================
// СИСТЕМА УВЕДОМЛЕНИЙ
// ============================================

function showNotification(title, message, type = 'info', duration = 5000) {
    if (!notificationsEnabled) return;
    
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
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
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    if (duration > 0) {
        setTimeout(() => removeNotification(notification), duration);
    }
    
    if (soundEnabled && type !== 'info') {
        playNotificationSound(type);
    }
    
    return notification;
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function playNotificationSound(type) {
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