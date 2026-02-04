# VimeTalks - Структура проекта

## 📁 ОСНОВНЫЕ КАТЕГОРИИ

### 🎯 **АКТИВНЫЕ ФАЙЛЫ (Production)**
```
├── index.html              # Главная страница (монолитная)
├── styles.css              # Основные стили
├── logo.png               # Логотип
└── js/                    # JavaScript модули
    ├── auth.js            # Аутентификация
    ├── data.js            # Данные приложения
    ├── forum.js           # Функции форума
    ├── main.js            # Главная инициализация
    ├── navigation.js      # Навигация
    ├── notifications.js   # Уведомления
    ├── profile.js         # Профиль пользователя
    └── settings.js        # Настройки
```

### 🔄 **НОВАЯ МОДУЛЬНАЯ АРХИТЕКТУРА**
```
src/
├── core/
│   └── App.js             # Главное приложение
├── features/              # Функциональные модули
│   ├── auth/
│   │   └── AuthManager.js # Управление аутентификацией
│   ├── forum/
│   │   └── ForumManager.js # Управление форумом
│   └── profile/
│       └── ProfileManager.js # Управление профилем
├── ui/                    # UI компоненты
│   ├── notifications/
│   │   └── NotificationManager.js # Уведомления
│   └── navigation/
│       └── NavigationManager.js # Навигация
├── data/
│   └── gameData.js        # Игровые данные
└── utils/
    └── StorageManager.js  # Локальное хранилище
```

### 🖥️ **BACKEND (Node.js)**
```
backend/
├── server.js              # Главный сервер
├── api/                   # API эндпоинты
│   ├── auth.js           # Аутентификация API
│   ├── forum.js          # Форум API
│   └── users.js          # Пользователи API
├── models/               # Модели данных
│   ├── User.js           # Модель пользователя
│   └── Forum.js          # Модель форума
├── middleware/           # Промежуточное ПО
│   └── auth.js          # Авторизация
└── package.json         # Зависимости
```

### 📦 **АЛЬТЕРНАТИВНЫЕ СТРУКТУРЫ**
```
css/                      # Компонентные стили
├── components/
│   ├── header.css
│   └── profile.css
└── pages/
    └── home.css

html/                     # HTML компоненты
├── components/
│   ├── header.html
│   └── profile-dropdown.html
└── pages/
    ├── about.html
    ├── contact.html
    └── home.html
```

### 📚 **ДОКУМЕНТАЦИЯ И РЕСУРСЫ**
```
├── README.md             # Документация проекта
├── terms.html           # Условия использования
├── start-backend.bat    # Скрипт запуска сервера
└── assets/              # Статические ресурсы
```

### ❌ **УСТАРЕВШИЕ ФАЙЛЫ**
```
├── script.js            # Старый монолитный скрипт
├── gravebirth.html      # Альтернативная страница
└── index-modular.html   # Старая модульная версия
```

## 🎯 **РЕКОМЕНДУЕМАЯ СТРУКТУРА**

**Для разработки:** Используйте новую модульную архитектуру в папке `src/`
**Для продакшена:** Текущая версия `index.html` + `js/` модули
**Для бэкенда:** Папка `backend/` с Node.js сервером

## 📋 **СТАТУС ФАЙЛОВ**

- ✅ **Активные**: index.html, styles.css, js/*.js
- 🔄 **В разработке**: src/*, css/*, html/*
- 🖥️ **Backend**: backend/*
- ❌ **Устаревшие**: script.js, gravebirth.html