// ============================================
// ИГРОВЫЕ ДАННЫЕ
// ============================================

export const gameItems = {
    team: [{
        title: "Командный состав",
        author: "ProGamer2024",
        date: "2 часа назад",
        content: "Лучшие командные составы для текущей меты.",
        replies: 15,
        views: 234,
        isPopular: true,
        hasAnswers: true,
        isAdminOnly: false,
        items: [{
            name: "Знамя Капитана",
            type: "Командный предмет",
            stats: "+15% командного урона, +20% получения опыта",
            active: "Митинг: Увеличивает скорость атаки всех членов команды на 30% на 8 секунд",
            passive: "Лидерство: Близкие союзники получают 10% снижения урона"
        }]
    }],
    core: [{
        title: "Основные",
        author: "MetaMaster",
        date: "4 часа назад",
        content: "Гайд по сборке Теневого Жнеца.",
        replies: 23,
        views: 445,
        isPopular: true,
        hasAnswers: true,
        isAdminOnly: false,
        items: [{
            name: "Клинок Пустоты",
            type: "Оружие",
            stats: "+180 урона атаки, +25% критического удара",
            active: "Удар Пустоты: Следующая атака игнорирует броню и наносит чистый урон",
            passive: "Теневая Поступь: Получает невидимость на 2 секунды после убийства врага"
        }]
    }]
};

export const demoUsers = [
    { 
        username: 'GRAVEBIRTH', 
        email: 'admin@gravebirth.com', 
        password: 'password123', 
        avatar: 'GB',
        isAdmin: true
    },
    { 
        username: 'dev_user', 
        email: 'dev@example.com', 
        password: 'password123', 
        avatar: 'D',
        isAdmin: false
    }
];