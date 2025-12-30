// ============================================
// МЕНЕДЖЕР НАВИГАЦИИ
// ============================================

export class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'about', 'contact', 'forum', 'profile', 'settings'];
    }

    init() {
        this.initEventListeners();
        this.showPage('home');
    }

    showPage(pageId) {
        // Скрыть все страницы
        document.querySelectorAll('.page-content, .main-content, .profile-page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // Показать выбранную страницу
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
        }

        this.currentPage = pageId;
        this.updateNavigation();
    }

    updateNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    initEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
            });
        });
    }
}