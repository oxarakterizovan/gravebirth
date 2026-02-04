// Main Application
const App = {
    init: () => {
        console.log('GRAVEBIRTH Website Loading...');
        
        // Инициализация состояния приложения
        AppState.init();
        
        // Инициализация компонентов
        NotificationComponent.init();
        NavigationComponent.init();
        
        // Загрузка сохраненных данных
        App.loadSavedData();
        
        // Установка темы
        App.setTheme(AppState.get('theme'));
        
        // Показ приветственного уведомления
        setTimeout(() => {
            NotificationComponent.show('Добро пожаловать', 'Сайт VimeTalks успешно загружен', 'success', 3000);
        }, 1000);
        
        console.log('GRAVEBIRTH Website Loaded');
    },
    
    loadSavedData: () => {
        // Загрузка сохраненных постов
        const savedPosts = Storage.get('userPosts', []);
        if (savedPosts.length > 0) {
            window.userPosts = savedPosts;
        }
        
        // Загрузка настроек
        AppState.set('notifications', Storage.get('notificationsEnabled', true));
        AppState.set('sound', Storage.get('soundEnabled', false));
    },
    
    setTheme: (theme) => {
        const body = document.body;
        body.className = `${theme}-theme`;
        AppState.set('theme', theme);
        
        NotificationComponent.show('Тема изменена', `Активирована ${theme === 'dark' ? 'тёмная' : 'светлая'} тема`, 'success');
    },
    
    toggleTheme: () => {
        const currentTheme = AppState.get('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        App.setTheme(newTheme);
    }
};

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', App.init);