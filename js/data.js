// ============================================
// ДАННЫЕ И КОНФИГУРАЦИЯ
// ============================================

// Данные игровых предметов
const gameItems = {
    team: [{
        title: "Team composition",
        author: "ProGamer2024",
        date: "2 hours ago",
        content: "Best team setups for current meta.",
        replies: 15,
        views: 234,
        isPopular: true,
        hasAnswers: true,
        isAdminOnly: false
    }],
    core: [{
        title: "Core",
        author: "MetaMaster", 
        date: "4 hours ago",
        content: "Shadow Reaper build guide.",
        replies: 23,
        views: 445,
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
        userId: '#789012',
        isAdmin: false,
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
    'profile': document.getElementById('profile-page')
};