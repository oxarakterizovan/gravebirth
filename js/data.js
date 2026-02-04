// ============================================
// ДАННЫЕ И КОНФИГУРАЦИЯ
// ============================================

// Данные игровых предметов
const gameItems = {
    team: [{
        title: "Командный состав",
        author: "ProGamer2024",
        date: "2 часа назад",
        content: "Лучшие командные составы для текущей меты.",
        replies: 15,
        views: 234,
        isPopular: true,
        hasAnswers: true,
        isAdminOnly: false
    }],
    core: [{
        title: "Гайд по сборке Теневого Жнеца",
        author: "GRAVEBIRTH", 
        date: "1 час назад",
        content: `# Теневой Жнец - Полный гайд\n\n## Обзор\nТеневой Жнец - один из самых мощных основных персонажей в CSC, специализирующийся на высоком взрывном уроне и мобильности. Этот гайд охватывает оптимальные сборки, игровые стратегии и командные синергии.\n\n## Основные предметы\n\n### Ранняя игра (0-15 минут)\n- **Теневой клинок** - Необходим для невидимости и позиционирования\n- **Силовые сапоги** - Обеспечивает скорость атаки и выживаемость\n- **Кольцо Аквилы** - Поддержка маны и урон\n\n### Средняя игра (15-30 минут)\n- **Опустошитель** - Снижение брони для увеличения урона\n- **Черный королевский жезл** - Иммунитет к магии для командных боев\n- **Кинжал прыжка** - Улучшенная мобильность и инициация\n\n### Поздняя игра (30+ минут)\n- **Бабочка** - Уклонение и скорость атаки\n- **Сатаник** - Вампиризм и выживаемость\n- **Жезл короля обезьян** - Точный удар против уклонения\n\n## Прокачка навыков\n\n**Приоритет уровней:**\n1. Теневой удар (Q) - Максимум первым для харасса\n2. Удар прыжком (W) - Одно очко рано, максимум вторым\n3. Размытие (E) - Максимум последним для выживаемости\n4. Вендетта (R) - Брать на 6, 12, 18\n\n## Игровая стратегия\n\n### Фаза лайнинга\n- Сосредоточьтесь на добивании и отрицании крипов\n- Используйте Теневой удар для харасса вражеских героев\n- Поддерживайте равновесие крипов возле своей башни\n- Ставьте варды в ключевых областях, чтобы избежать гангов\n\n### Средняя игра\n- Ищите одиночные убийства с Вендеттой\n- Присоединяйтесь к командным боям с задней линии\n- Сосредоточьтесь на устранении вражеских саппортов в первую очередь\n- Контролируйте видение вокруг целей\n\n### Поздняя игра\n- Сплит-пушьте когда возможно\n- Нацеливайтесь на вражеских керри в командных боях\n- Мудро используйте время БКБ\n- Координируйтесь с командой для пушей на высокую землю\n\n## Контры и синергии\n\n### Хорош против:\n- Хрупких саппортов\n- Неподвижных керри\n- Героев без механизмов побега\n\n### Слаб против:\n- Героев с обнаружением (Сларк, Охотник за головами)\n- Дилеров АоЕ урона\n- Героев с сильным контролем\n\n### Командные синергии:\n- Хорошо работает с инициаторами\n- Получает пользу от провайдеров видения\n- Синергирует с другими дилерами физического урона\n\n## Советы и трюки\n\n1. **Использование Вендетты**: Используйте для инициации, а не только для невидимости\n2. **Тайминг предметов**: Спешите с ключевыми предметами в зависимости от состояния игры\n3. **Позиционирование**: Всегда сражайтесь с выгодных позиций\n4. **Осведомленность о карте**: Постоянно проверяйте миникарту на предмет возможностей\n5. **Предметизация**: Адаптируйте сборку в зависимости от состава вражеской команды\n\n## Заключение\n\nТеневой Жнец требует хорошего игрового чутья и механических навыков, но вознаграждает игроков невероятным потенциалом воздействия. Сначала освойте основы, затем сосредоточьтесь на продвинутых техниках, таких как отмена анимации и оптимальные тайминги предметов.\n\n*Помните: практика - путь к совершенству. Удачи в ваших играх!*`,
        replies: 23,
        views: 445,
        isPopular: true,
        hasAnswers: true,
        isAdminOnly: false
    }],
    support: [{
        title: "Гайд по Кристальной Деве саппорту",
        author: "SupportMaster",
        date: "3 часа назад",
        content: `# Кристальная Дева - Гайд по саппорту\n\n## Обзор\nКристальная Дева - мощный саппорт герой с отличным контролем толпы и присутствием в командных боях.\n\n## Основные предметы\n- **Спокойные сапоги** - Мобильность и восстановление здоровья\n- **Посох силы** - Позиционирование и побег\n- **Плащ мерцания** - Защита для команды\n\n## Прокачка навыков\n1. Кристальная Нова (Q) - Максимум первым\n2. Обморожение (W) - Одно очко рано\n3. Аура Блеска (E) - Максимум вторым\n4. Ледяное Поле (R) - Ультимат`,
        replies: 12,
        views: 189,
        isPopular: false,
        hasAnswers: true,
        isAdminOnly: false
    }],
    'character-builds': [{
        title: "Теневой Ассасин - Сборка персонажа",
        author: "ItemExpert",
        date: "5 часов назад",
        content: `# Теневой Ассасин - Сборка персонажа\n\n## Обзор\nТеневой Ассасин - универсальный дилер урона с отличной мобильностью и взрывным потенциалом.\n\n## Основные предметы\n- **Опустошитель** - Снижение брони\n- **Бабочка** - Уклонение и урон\n- **Сатаник** - Вампиризм\n\n## Прокачка навыков\n1. Теневой удар (Q) - Максимум первым\n2. Прыжок (W) - Одно очко рано\n3. Критический удар (E) - Максимум вторым\n4. Реквием (R) - Ультимат`,
        replies: 8,
        views: 156,
        isPopular: false,
        hasAnswers: false,
        isAdminOnly: false
    }],
    'item-builds': [{
        title: "Кристальная Дева - Сборки предметов",
        author: "WardMaster",
        date: "6 часов назад",
        content: `# Кристальная Дева - Сборки предметов\n\n## Основные предметы\n- **Обсервер варды** - Контроль видения\n- **Сентри варды** - Противодействие невидимости\n- **Посох силы** - Мобильность команды\n\n## Люксовые предметы\n- **Плащ мерцания** - Магическое сопротивление\n- **Призрачный скипетр** - Физический иммунитет`,
        replies: 5,
        views: 98,
        isPopular: false,
        hasAnswers: true,
        isAdminOnly: false
    }],
    questions: [{
        title: "Как улучшить ласт-хит?",
        author: "NewPlayer123",
        date: "8 часов назад",
        content: `Мне трудно дается ласт-хит крипов. Какие-нибудь советы для новичков?\n\n- Стоит ли сосредоточиться на предметах урона сначала?\n- Какой лучший способ практиковаться?\n- Какие герои лучше для обучения?`,
        replies: 18,
        views: 267,
        isPopular: true,
        hasAnswers: true,
        isAdminOnly: false
    }]
};

// Демо-пользователи
const demoUsers = [
    { 
        username: 'GRAVEBIRTH', 
        email: 'admin@gravebirth.com', 
        password: 'password123', 
        avatar: 'GB',
        regDate: '27 Янв 2025',
        messages: 5,
        reactions: 42,
        topics: 12,
        replies: 45,
        status: 'Online',
        loginCount: 156,
        lastLogin: new Date().toLocaleString(),
        userId: '#123456',
        isAdmin: true,
        role: 'chief-admin',
        privacy: {
            profile: 'public',
            posts: 'public',
            online: true,
            activity: true
        },
        security: {
            twoFactor: false,
            phone: '+7 (999) 123-45-67'
        },
        settings: {
            notifications: true,
            language: 'ru',
            theme: 'dark',
            forumNotifications: true,
            messageNotifications: true
        }
    },
    { 
        username: 'TechAdmin', 
        email: 'tech@gravebirth.com', 
        password: 'password123', 
        avatar: 'TA',
        regDate: '20 Янв 2025',
        messages: 8,
        reactions: 25,
        topics: 5,
        replies: 18,
        status: 'Online',
        loginCount: 45,
        lastLogin: new Date().toLocaleString(),
        userId: '#234567',
        isAdmin: false,
        role: 'tech-admin'
    },
    { 
        username: 'SeniorMod', 
        email: 'srmod@gravebirth.com', 
        password: 'password123', 
        avatar: 'SM',
        regDate: '18 Янв 2025',
        messages: 12,
        reactions: 35,
        topics: 7,
        replies: 28,
        status: 'Online',
        loginCount: 67,
        lastLogin: new Date().toLocaleString(),
        userId: '#345678',
        isAdmin: false,
        role: 'st-moderator'
    },
    { 
        username: 'ModeratorUser', 
        email: 'mod@gravebirth.com', 
        password: 'password123', 
        avatar: 'MU',
        regDate: '15 Янв 2025',
        messages: 6,
        reactions: 18,
        topics: 3,
        replies: 15,
        status: 'Online',
        loginCount: 32,
        lastLogin: new Date().toLocaleString(),
        userId: '#456789',
        isAdmin: false,
        role: 'moderator'
    },
    { 
        username: 'MediaManager', 
        email: 'media@gravebirth.com', 
        password: 'password123', 
        avatar: 'MM',
        regDate: '12 Янв 2025',
        messages: 4,
        reactions: 12,
        topics: 2,
        replies: 8,
        status: 'Online',
        loginCount: 28,
        lastLogin: new Date().toLocaleString(),
        userId: '#567890',
        isAdmin: false,
        role: 'media'
    },
    { 
        username: 'SupportHelper', 
        email: 'support@gravebirth.com', 
        password: 'password123', 
        avatar: 'SH',
        regDate: '10 Янв 2025',
        messages: 3,
        reactions: 8,
        topics: 1,
        replies: 5,
        status: 'Online',
        loginCount: 15,
        lastLogin: new Date().toLocaleString(),
        userId: '#678901',
        isAdmin: false,
        role: 'support'
    },
    { 
        username: 'HelperUser', 
        email: 'helper@gravebirth.com', 
        password: 'password123', 
        avatar: 'HU',
        regDate: '8 Янв 2025',
        messages: 2,
        reactions: 5,
        topics: 1,
        replies: 3,
        status: 'Online',
        loginCount: 12,
        lastLogin: new Date().toLocaleString(),
        userId: '#789012',
        isAdmin: false,
        role: 'helper'
    },
    { 
        username: 'dev_user', 
        email: 'dev@example.com', 
        password: 'password123', 
        avatar: 'D',
        regDate: '15 Мар 2024',
        messages: 12,
        reactions: 45,
        topics: 8,
        replies: 23,
        status: 'Online',
        loginCount: 89,
        lastLogin: new Date().toLocaleString(),
        userId: '#890123',
        isAdmin: false,
        role: 'member',
        privacy: {
            profile: 'friends',
            posts: 'friends',
            online: true,
            activity: false
        },
        security: {
            twoFactor: true,
            phone: '+7 (999) 123-45-67'
        },
        settings: {
            notifications: false,
            language: 'en',
            theme: 'light',
            forumNotifications: false,
            messageNotifications: false
        }
    }
];

// Глобальные переменные
let userPosts = [];
let userTopics = [];
let currentLanguage = 'ru';
let forumStats = {
    activeTopics: 0,
    communityMembers: 1,
    totalReplies: 0,
    hotTopics: 0
};

let isLoggedIn = false;
let currentUser = null;
let currentPage = 'home';
let notificationsEnabled = true;
let soundEnabled = false;
let currentTheme = 'dark';

// Управление несколькими аккаунтами
let savedAccounts = [];
let activeAccountId = null;

// Страницы
const pages = {
    'home': document.getElementById('home-page'),
    'about': document.getElementById('about-page'),
    'contact': document.getElementById('contact-page'),
    'forum': document.getElementById('forum-page'),
    'settings': document.getElementById('settings-page'),
    'profile': document.getElementById('profile-page'),
    'topic-view': document.getElementById('topic-view-page'),
    'category': document.getElementById('category-page'),
    'admin': document.getElementById('admin-page'),
    'tickets': document.getElementById('tickets-page'),
    'support': document.getElementById('support-page')
};

// Функция для получения названия роли
function getUserRole(user) {
    if (!user) return 'Участник';
    
    const roles = {
        'chief-admin': 'Главный Администратор',
        'tech-admin': 'Технический Администратор', 
        'st-moderator': 'Старший Модератор',
        'moderator': 'Модератор',
        'media': 'Медиа',
        'support': 'Поддержка',
        'helper': 'Помощник',
        'member': 'Участник'
    };
    
    return roles[user.role] || (user.isAdmin ? 'Администратор' : 'Участник');
}

// Система прав доступа
const permissions = {
    'chief-admin': ['mute', 'unmute', 'ban', 'unban', 'view_logs', 'view_users', 'admin_questions', 'immunity'],
    'tech-admin': ['mute', 'unmute', 'ban', 'unban', 'view_logs', 'view_users', 'immunity'],
    'st-moderator': ['mute', 'unmute', 'ban', 'unban', 'immunity'],
    'moderator': ['mute', 'unmute', 'ban', 'unban', 'immunity'],
    'media': ['immunity'],
    'support': ['admin_questions', 'view_banned', 'view_muted', 'view_users', 'tech_support'],
    'helper': ['mute', 'unmute', 'tech_support'],
    'member': []
};

// Проверка прав доступа
function hasPermission(user, permission) {
    if (!user || !user.role) return false;
    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes(permission);
}

function hasAdminRights(user) {
    if (!user) return false;
    return user.role === 'chief-admin' || user.role === 'tech-admin' || user.isAdmin;
}

function hasModeratorRights(user) {
    if (!user) return false;
    return hasAdminRights(user) || user.role === 'st-moderator' || user.role === 'moderator';
}

function canAccessTechSupport(user) {
    if (!user) return false;
    return hasPermission(user, 'tech_support') || hasAdminRights(user) || hasModeratorRights(user);
}

function canBeMuted(user) {
    if (!user) return true;
    return !hasPermission(user, 'immunity');
}