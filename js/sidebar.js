// Управление боковым меню категорий
class SidebarManager {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebarMenu = document.getElementById('sidebarMenu');
        this.sidebarClose = document.getElementById('sidebarClose');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.categoryItems = document.querySelectorAll('.sidebar-category-item');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkCategoryAccess();
    }
    
    bindEvents() {
        // Открытие меню
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => {
                this.openSidebar();
            });
        }
        
        // Закрытие меню
        if (this.sidebarClose) {
            this.sidebarClose.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
        
        // Закрытие по клику на overlay
        if (this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebarMenu.classList.contains('active')) {
                this.closeSidebar();
            }
        });
        
        // Обработчики для категорий
        this.categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const category = item.getAttribute('data-category');
                
                if (item.classList.contains('restricted')) {
                    this.showAccessDenied(category);
                    return;
                }
                
                this.selectCategory(category);
                this.closeSidebar();
            });
        });
    }
    
    openSidebar() {
        this.sidebarMenu.classList.add('active');
        this.sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Анимация появления элементов
        this.categoryItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(0)';
                item.style.opacity = '1';
            }, index * 50);
        });
    }
    
    closeSidebar() {
        this.sidebarMenu.classList.remove('active');
        this.sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Сброс анимации
        this.categoryItems.forEach(item => {
            item.style.transform = 'translateX(-20px)';
            item.style.opacity = '0.7';
        });
    }
    
    selectCategory(category) {
        // Используем существующую функцию фильтрации
        if (typeof filterByCategory === 'function') {
            filterByCategory(category);
        } else {
            console.error('filterByCategory function not found');
        }
        
        // Показываем уведомление о выборе категории
        const categoryName = this.getCategoryName(category);
        if (typeof showNotification === 'function') {
            showNotification('Категория выбрана', `Переход к: ${categoryName}`, 'info');
        }
    }
    
    checkCategoryAccess() {
        // Проверяем доступ к категориям на основе ролей пользователя
        this.categoryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (this.isCategoryRestricted(category)) {
                item.classList.add('restricted');
                item.title = 'Доступ ограничен';
            } else {
                item.classList.remove('restricted');
                item.title = this.getCategoryDescription(category);
            }
        });
    }
    
    isCategoryRestricted(category) {
        // Проверяем, есть ли ограничения для категории
        if (!window.isLoggedIn || !window.currentUser) {
            // Некоторые категории могут быть доступны только авторизованным пользователям
            const restrictedForGuests = ['character-builds', 'item-builds'];
            return restrictedForGuests.includes(category);
        }
        
        // Проверяем роли для специальных категорий
        const user = window.currentUser;
        
        // Пример: категория support доступна только модераторам и админам
        if (category === 'support') {
            return !this.hasModeratorRights(user);
        }
        
        return false;
    }
    
    hasModeratorRights(user) {
        if (!user) return false;
        return user.isAdmin || user.isModerator || user.isSupport;
    }
    
    showAccessDenied(category) {
        const categoryName = this.getCategoryName(category);
        
        if (typeof showNotification === 'function') {
            if (!window.isLoggedIn) {
                showNotification('Требуется авторизация', `Для доступа к "${categoryName}" необходимо войти в систему`, 'warning');
                // Открываем модальное окно входа
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.classList.add('active');
                }
            } else {
                showNotification('Доступ ограничен', `У вас нет прав для доступа к "${categoryName}"`, 'error');
            }
        }
    }
    
    getCategoryName(category) {
        const names = {
            'team': 'Team Composition',
            'core': 'Core Characters',
            'support': 'Support Characters',
            'character-builds': 'Character Builds',
            'item-builds': 'Item Builds',
            'questions': 'Questions & Answers'
        };
        return names[category] || category;
    }
    
    getCategoryDescription(category) {
        const descriptions = {
            'team': 'Стратегии командной игры и тактики',
            'core': 'Гайды по основным персонажам',
            'support': 'Руководства по персонажам поддержки',
            'character-builds': 'Сборки и билды персонажей',
            'item-builds': 'Сборки предметов и экипировки',
            'questions': 'Вопросы и ответы сообщества'
        };
        return descriptions[category] || 'Нажмите для перехода к категории';
    }
    
    // Обновление доступа при изменении статуса пользователя
    updateAccess() {
        this.checkCategoryAccess();
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
});

// Обновляем доступ при изменении пользователя
document.addEventListener('userStatusChanged', () => {
    if (window.sidebarManager) {
        window.sidebarManager.updateAccess();
    }
});

// Экспортируем для использования в других модулях
window.SidebarManager = SidebarManager;