// Application State Management
const AppState = {
    // Текущее состояние
    state: {
        isLoggedIn: false,
        currentUser: null,
        currentPage: 'home',
        theme: 'dark',
        language: 'ru',
        notifications: true,
        sound: false
    },
    
    // Подписчики на изменения состояния
    subscribers: {},
    
    // Получение значения из состояния
    get: (key) => {
        return AppState.state[key];
    },
    
    // Установка значения в состояние
    set: (key, value) => {
        const oldValue = AppState.state[key];
        AppState.state[key] = value;
        
        // Уведомляем подписчиков об изменении
        if (AppState.subscribers[key]) {
            AppState.subscribers[key].forEach(callback => {
                callback(value, oldValue);
            });
        }
        
        // Сохраняем в localStorage для некоторых ключей
        const persistentKeys = ['theme', 'language', 'notifications', 'sound'];
        if (persistentKeys.includes(key)) {
            Storage.set(key, value);
        }
    },
    
    // Подписка на изменения состояния
    subscribe: (key, callback) => {
        if (!AppState.subscribers[key]) {
            AppState.subscribers[key] = [];
        }
        AppState.subscribers[key].push(callback);
    },
    
    // Отписка от изменений состояния
    unsubscribe: (key, callback) => {
        if (AppState.subscribers[key]) {
            const index = AppState.subscribers[key].indexOf(callback);
            if (index > -1) {
                AppState.subscribers[key].splice(index, 1);
            }
        }
    },
    
    // Инициализация состояния из localStorage
    init: () => {
        AppState.set('theme', Storage.get('theme', 'dark'));
        AppState.set('language', Storage.get('language', 'ru'));
        AppState.set('notifications', Storage.get('notifications', true));
        AppState.set('sound', Storage.get('sound', false));
        
        const savedUser = Storage.get('currentUser');
        if (savedUser) {
            AppState.set('currentUser', savedUser);
            AppState.set('isLoggedIn', true);
        }
    }
};