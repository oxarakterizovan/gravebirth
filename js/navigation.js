// ============================================
// НАВИГАЦИЯ И УПРАВЛЕНИЕ СТРАНИЦАМИ
// ============================================

// История навигации
let navigationHistory = ['home'];
let currentHistoryIndex = 0;

function showPage(pageId) {
    // Добавляем в историю только если это новая страница
    if (pageId !== navigationHistory[currentHistoryIndex]) {
        navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
        navigationHistory.push(pageId);
        currentHistoryIndex = navigationHistory.length - 1;
    }
    
    currentPage = pageId;
    localStorage.setItem('currentPage', pageId);
    
    const profileDropdown = document.getElementById('profileDropdown');
    
    Object.values(pages).forEach(page => {
        if (page) {
            page.style.display = 'none';
            page.classList.remove('active');
        }
    });
    
    if (profileDropdown) profileDropdown.classList.remove('active');
    
    if (pages[pageId]) {
        pages[pageId].style.display = pageId === 'home' ? 'flex' : 'block';
        pages[pageId].classList.add('active');
    }
    
    const navLinks = document.querySelectorAll('.nav-link');
    const leftNavLinks = document.querySelectorAll('.left-content a[data-page]');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    leftNavLinks.forEach(link => {
        if (link.parentElement) {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.parentElement.classList.add('active');
            }
        }
    });
    
    window.scrollTo(0, 0);
    
    if (pageId === 'forum') {
        initForum();
    } else if (pageId === 'settings') {
        loadSettings();
        initSettingsTabs();
    } else if (pageId === 'profile') {
        loadUserPosts();
    }
}

// Делаем функцию глобально доступной
window.showPage = showPage;

function goBack() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        const previousPage = navigationHistory[currentHistoryIndex];
        currentPage = previousPage;
        
        Object.values(pages).forEach(page => {
            if (page) {
                page.style.display = 'none';
                page.classList.remove('active');
            }
        });
        
        if (pages[previousPage]) {
            pages[previousPage].style.display = previousPage === 'home' ? 'flex' : 'block';
            pages[previousPage].classList.add('active');
        }
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === previousPage) {
                link.classList.add('active');
            }
        });
    }
}

function goForward() {
    if (currentHistoryIndex < navigationHistory.length - 1) {
        currentHistoryIndex++;
        const nextPage = navigationHistory[currentHistoryIndex];
        currentPage = nextPage;
        
        Object.values(pages).forEach(page => {
            if (page) {
                page.style.display = 'none';
                page.classList.remove('active');
            }
        });
        
        if (pages[nextPage]) {
            pages[nextPage].style.display = nextPage === 'home' ? 'flex' : 'block';
            pages[nextPage].classList.add('active');
        }
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === nextPage) {
                link.classList.add('active');
            }
        });
    }
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const leftNavLinks = document.querySelectorAll('.left-content a[data-page]');
    const loginModal = document.getElementById('loginModal');
    
    // Обработчик для основных навигационных ссылок в хедере
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            
            if (page === 'profile' || page === 'settings') {
                if (!isLoggedIn) {
                    showNotification('Требуется вход', 'Пожалуйста, войдите в систему для доступа к этой странице', 'warning');
                    if (loginModal) loginModal.classList.add('active');
                    return;
                }
            }
            
            showPage(page);
        });
    });
    
    // Обработчик для навигационных ссылок в левой части главной страницы
    leftNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            
            if (page === 'profile' || page === 'settings') {
                if (!isLoggedIn) {
                    showNotification('Требуется вход', 'Пожалуйста, войдите в систему для доступа к этой странице', 'warning');
                    if (loginModal) loginModal.classList.add('active');
                    return;
                }
            }
            
            showPage(page);
        });
    });
    
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('home');
        });
        logo.style.cursor = 'pointer';
    }
    
    // Обработчик боковых кнопок мыши
    document.addEventListener('mousedown', (e) => {
        if (e.button === 3) { // Кнопка назад
            e.preventDefault();
            goBack();
        } else if (e.button === 4) { // Кнопка вперёд
            e.preventDefault();
            goForward();
        }
    });
}

function setTheme(theme) {
    const body = document.body;
    
    currentTheme = theme;
    body.className = `${theme}-theme`;
    
    localStorage.setItem('theme', theme);
    
    // Убираем уведомление о смене темы при загрузке
}

function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const body = document.body;
    
    currentTheme = newTheme;
    body.className = `${newTheme}-theme`;
    
    localStorage.setItem('theme', newTheme);
    
    showNotification('Тема изменена', `Активирована ${newTheme === 'dark' ? 'тёмная' : 'светлая'} тема`, 'success');
}