// ============================================
// НАВИГАЦИЯ И УПРАВЛЕНИЕ СТРАНИЦАМИ
// ============================================

function showPage(pageId) {
    currentPage = pageId;
    
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
    const leftNavLinks = document.querySelectorAll('.left-content a');
    
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

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const leftNavLinks = document.querySelectorAll('.left-content a');
    const loginModal = document.getElementById('loginModal');
    
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
    }
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