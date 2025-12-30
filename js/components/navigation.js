// Navigation Component
const NavigationComponent = {
    pages: {
        'home': DOM.get('home-page'),
        'about': DOM.get('about-page'),
        'contact': DOM.get('contact-page'),
        'forum': DOM.get('forum-page'),
        'settings': DOM.get('settings-page'),
        'profile': DOM.get('profile-page')
    },
    
    init: () => {
        NavigationComponent.bindEvents();
        NavigationComponent.showPage('home');
    },
    
    showPage: (pageId) => {
        AppState.set('currentPage', pageId);
        
        const profileDropdown = DOM.get('profileDropdown');
        
        // Скрываем все страницы
        Object.values(NavigationComponent.pages).forEach(page => {
            if (page) {
                DOM.hide(page);
                DOM.removeClass(page, 'active');
            }
        });
        
        // Скрываем выпадающее меню профиля
        if (profileDropdown) DOM.removeClass(profileDropdown, 'active');
        
        // Показываем выбранную страницу
        if (NavigationComponent.pages[pageId]) {
            NavigationComponent.pages[pageId].style.display = pageId === 'home' ? 'flex' : 'block';
            DOM.addClass(NavigationComponent.pages[pageId], 'active');
        }
        
        // Обновляем активные ссылки
        NavigationComponent.updateActiveLinks(pageId);
        
        // Прокручиваем к началу страницы
        window.scrollTo(0, 0);
        
        // Инициализация страниц при необходимости
        NavigationComponent.initPage(pageId);
    },
    
    updateActiveLinks: (pageId) => {
        const navLinks = DOM.getAll('.nav-link');
        const leftNavLinks = DOM.getAll('.left-content a');
        
        navLinks.forEach(link => {
            DOM.removeClass(link, 'active');
            if (link.getAttribute('data-page') === pageId) {
                DOM.addClass(link, 'active');
            }
        });
        
        leftNavLinks.forEach(link => {
            if (link.parentElement) {
                DOM.removeClass(link.parentElement, 'active');
                if (link.getAttribute('data-page') === pageId) {
                    DOM.addClass(link.parentElement, 'active');
                }
            }
        });
    },
    
    initPage: (pageId) => {
        switch(pageId) {
            case 'forum':
                if (window.ForumComponent) ForumComponent.init();
                break;
            case 'settings':
                if (window.SettingsComponent) SettingsComponent.init();
                break;
            case 'profile':
                if (window.ProfileComponent) ProfileComponent.loadPosts();
                break;
        }
    },
    
    bindEvents: () => {
        const navLinks = DOM.getAll('.nav-link');
        const leftNavLinks = DOM.getAll('.left-content a');
        const loginModal = DOM.get('loginModal');
        
        navLinks.forEach(link => {
            DOM.on(link, 'click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                
                if ((page === 'profile' || page === 'settings') && !AppState.get('isLoggedIn')) {
                    NotificationComponent.show('Требуется вход', 'Пожалуйста, войдите в систему для доступа к этой странице', 'warning');
                    if (loginModal) DOM.addClass(loginModal, 'active');
                    return;
                }
                
                NavigationComponent.showPage(page);
            });
        });
        
        leftNavLinks.forEach(link => {
            DOM.on(link, 'click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                
                if ((page === 'profile' || page === 'settings') && !AppState.get('isLoggedIn')) {
                    NotificationComponent.show('Требуется вход', 'Пожалуйста, войдите в систему для доступа к этой странице', 'warning');
                    if (loginModal) DOM.addClass(loginModal, 'active');
                    return;
                }
                
                NavigationComponent.showPage(page);
            });
        });
        
        // Логотип ведет на главную
        const logo = DOM.get('logo');
        if (logo) {
            DOM.on(logo, 'click', (e) => {
                e.preventDefault();
                NavigationComponent.showPage('home');
            });
        }
    }
};