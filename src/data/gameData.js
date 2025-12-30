// ============================================
// ИГРОВЫЕ ДАННЫЕ
// ============================================

export const gameItems = {
    team: [{
        title: "Team composition",
        author: "ProGamer2024",
        date: "2 hours ago",
        content: "Best team setups for current meta.",
        replies: 15,
        views: 234,
        isPopular: true,
        hasAnswers: true,
        isAdminOnly: false,
        items: [{
            name: "Captain's Banner",
            type: "Team Item",
            stats: "+15% Team Damage, +20% Experience Gain",
            active: "Rally: Boost all team members' attack speed by 30% for 8 seconds",
            passive: "Leadership: Nearby allies gain 10% damage reduction"
        }]
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
        isAdminOnly: false,
        items: [{
            name: "Void Blade",
            type: "Weapon",
            stats: "+180 Attack Damage, +25% Critical Strike",
            active: "Void Strike: Next attack ignores armor and deals true damage",
            passive: "Shadow Walk: Gain invisibility for 2 seconds after killing an enemy"
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