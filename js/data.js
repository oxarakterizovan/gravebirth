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
        title: "Shadow Reaper Build Guide",
        author: "GRAVEBIRTH", 
        date: "1 hour ago",
        content: `# Shadow Reaper - Complete Guide\n\n## Overview\nShadow Reaper is one of the most powerful core characters in CSC, specializing in high burst damage and mobility. This guide covers optimal builds, gameplay strategies, and team synergies.\n\n## Core Items\n\n### Early Game (0-15 minutes)\n- **Shadowblade** - Essential for invisibility and positioning\n- **Power Treads** - Provides attack speed and survivability\n- **Aquila Ring** - Mana sustain and damage\n\n### Mid Game (15-30 minutes)\n- **Desolator** - Armor reduction for increased damage\n- **Black King Bar** - Magic immunity for team fights\n- **Blink Dagger** - Enhanced mobility and initiation\n\n### Late Game (30+ minutes)\n- **Butterfly** - Evasion and attack speed\n- **Satanic** - Lifesteal and survivability\n- **Monkey King Bar** - True strike against evasion\n\n## Skill Build\n\n**Level Priority:**\n1. Shadow Strike (Q) - Max first for harass\n2. Blink Strike (W) - One point early, max second\n3. Blur (E) - Max last for survivability\n4. Vendetta (R) - Take at 6, 12, 18\n\n## Gameplay Strategy\n\n### Laning Phase\n- Focus on last-hitting and denying creeps\n- Use Shadow Strike to harass enemy heroes\n- Maintain creep equilibrium near your tower\n- Ward key areas to avoid ganks\n\n### Mid Game\n- Look for solo pickoffs with Vendetta\n- Join team fights from the backline\n- Focus on eliminating enemy supports first\n- Control vision around objectives\n\n### Late Game\n- Split push when possible\n- Target enemy carries in team fights\n- Use BKB timing wisely\n- Coordinate with team for high ground pushes\n\n## Counters and Synergies\n\n### Good Against:\n- Squishy supports\n- Immobile carries\n- Heroes without escape mechanisms\n\n### Weak Against:\n- Heroes with detection (Slardar, Bounty Hunter)\n- AoE damage dealers\n- Heroes with strong disable\n\n### Team Synergies:\n- Works well with initiators\n- Benefits from vision providers\n- Synergizes with other physical damage dealers\n\n## Tips and Tricks\n\n1. **Vendetta Usage**: Use for initiation, not just invisibility\n2. **Item Timing**: Rush key items based on game state\n3. **Positioning**: Always fight from advantageous positions\n4. **Map Awareness**: Constantly check minimap for opportunities\n5. **Itemization**: Adapt build based on enemy team composition\n\n## Conclusion\n\nShadow Reaper requires good game sense and mechanical skill but rewards players with incredible impact potential. Master the basics first, then focus on advanced techniques like animation canceling and optimal item timings.\n\n*Remember: Practice makes perfect. Good luck in your games!*`,
        replies: 23,
        views: 445,
        isPopular: true,
        hasAnswers: true,
        isAdminOnly: false
    }],
    support: [{
        title: "Crystal Maiden Support Guide",
        author: "SupportMaster",
        date: "3 hours ago",
        content: `# Crystal Maiden - Support Guide\n\n## Overview\nCrystal Maiden is a powerful support hero with excellent crowd control and team fight presence.\n\n## Core Items\n- **Tranquil Boots** - Mobility and health regen\n- **Force Staff** - Positioning and escape\n- **Glimmer Cape** - Protection for team\n\n## Skill Build\n1. Crystal Nova (Q) - Max first\n2. Frostbite (W) - One point early\n3. Brilliance Aura (E) - Max second\n4. Freezing Field (R) - Ultimate`,
        replies: 12,
        views: 189,
        isPopular: false,
        hasAnswers: true,
        isAdminOnly: false
    }],
    'character-builds': [{
        title: "Shadow Assassin - Character Build",
        author: "ItemExpert",
        date: "5 hours ago",
        content: `# Shadow Assassin - Character Build\n\n## Overview\nShadow Assassin is a versatile damage dealer with excellent mobility and burst potential.\n\n## Core Items\n- **Desolator** - Armor reduction\n- **Butterfly** - Evasion and damage\n- **Satanic** - Lifesteal\n\n## Skill Build\n1. Shadow Strike (Q) - Max first\n2. Blink (W) - One point early\n3. Critical Strike (E) - Max second\n4. Requiem (R) - Ultimate`,
        replies: 8,
        views: 156,
        isPopular: false,
        hasAnswers: false,
        isAdminOnly: false
    }],
    'item-builds': [{
        title: "Crystal Maiden - Item Builds",
        author: "WardMaster",
        date: "6 hours ago",
        content: `# Crystal Maiden - Item Builds\n\n## Essential Items\n- **Observer Wards** - Vision control\n- **Sentry Wards** - Counter invisibility\n- **Force Staff** - Team mobility\n\n## Luxury Items\n- **Glimmer Cape** - Magic resistance\n- **Ghost Scepter** - Physical immunity`,
        replies: 5,
        views: 98,
        isPopular: false,
        hasAnswers: true,
        isAdminOnly: false
    }],
    questions: [{
        title: "How to improve last hitting?",
        author: "NewPlayer123",
        date: "8 hours ago",
        content: `I'm struggling with last hitting creeps. Any tips for beginners?\n\n- Should I focus on damage items first?\n- What's the best way to practice?\n- Any specific heroes for learning?`,
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
    'profile': document.getElementById('profile-page'),
    'topic-view': document.getElementById('topic-view-page'),
    'category': document.getElementById('category-page'),
    'admin': document.getElementById('admin-page')
};

// Функция для получения названия роли
function getUserRole(user) {
    if (!user) return 'Member';
    
    const roles = {
        'chief-admin': 'Chief Administrator',
        'tech-admin': 'Technical Administrator', 
        'st-moderator': 'ST. Moderator',
        'moderator': 'Moderator',
        'media': 'Media',
        'support': 'Support',
        'helper': 'Helper'
    };
    
    return roles[user.role] || (user.isAdmin ? 'Administrator' : 'Member');
}

// Проверка прав доступа
function hasAdminRights(user) {
    if (!user) return false;
    return user.role === 'chief-admin' || user.role === 'tech-admin' || user.isAdmin;
}

function hasModeratorRights(user) {
    if (!user) return false;
    return hasAdminRights(user) || user.role === 'st-moderator' || user.role === 'moderator';
}