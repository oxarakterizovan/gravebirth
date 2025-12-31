// ============================================
// УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ И ПРОФИЛЕМ
// ============================================

function saveUserData(username, userData) {
    const userDataKey = `userData_${username}`;
    localStorage.setItem(userDataKey, JSON.stringify(userData));
}

function loadUserData(username) {
    const userDataKey = `userData_${username}`;
    const savedData = localStorage.getItem(userDataKey);
    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }
    return null;
}

function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        saveUserData(currentUser.username, currentUser);
        
        // Обновляем данные в массиве demoUsers
        const demoUserIndex = demoUsers.findIndex(u => u.username === currentUser.username);
        if (demoUserIndex !== -1) {
            demoUsers[demoUserIndex] = { ...currentUser };
        }
    }
}

function updateProfileData() {
    if (!currentUser) return;
    
    const elements = {
        'profileAvatar': document.getElementById('profileAvatar'),
        'profileUsername': document.getElementById('profileUsername'),
        'profileRole': document.getElementById('profileRole'),
        'profileRegDate': document.getElementById('profileRegDate'),
        'profileStatus': document.getElementById('profileStatus'),
        'profileMessages': document.getElementById('profileMessages'),
        'profileReactions': document.getElementById('profileReactions'),
        'profileTopics': document.getElementById('profileTopics'),
        'profileReplies': document.getElementById('profileReplies'),
        'infoUsername': document.getElementById('infoUsername'),
        'infoEmail': document.getElementById('infoEmail'),
        'profileLoginCount': document.getElementById('profileLoginCount'),
        'profileActivity': document.getElementById('profileActivity'),
        'loginCount': document.getElementById('loginCount'),
        'lastLogin': document.getElementById('lastLogin'),
        'infoRole': document.getElementById('infoRole')
    };
    
    for (const [id, element] of Object.entries(elements)) {
        if (!element) continue;
        
        switch(id) {
            case 'profileAvatar':
                element.className = `profile-avatar ${currentUser.avatarImage ? 'avatar-with-image' : ''}`;
                element.style.backgroundImage = currentUser.avatarImage ? `url('${currentUser.avatarImage}')` : '';
                element.textContent = currentUser.avatarImage ? '' : currentUser.avatar;
                break;
            case 'profileUsername':
            case 'infoUsername':
                element.textContent = currentUser.username;
                break;
            case 'profileRole':
                element.textContent = currentUser.isAdmin ? 'DEVELOPER HOST MANAGER' : '';
                break;
            case 'profileRegDate':
                element.textContent = currentUser.regDate;
                break;
            case 'profileStatus':
                element.textContent = currentUser.status;
                break;
            case 'profileMessages':
                element.textContent = currentUser.messages || 0;
                break;
            case 'profileReactions':
                element.textContent = currentUser.reactions || 0;
                break;
            case 'profileTopics':
                element.textContent = currentUser.topics || 0;
                break;
            case 'profileReplies':
                element.textContent = currentUser.replies || 0;
                break;
            case 'infoEmail':
                element.textContent = currentUser.email;
                break;
            case 'profileLoginCount':
            case 'loginCount':
                element.textContent = currentUser.loginCount || 0;
                break;
            case 'profileActivity':
            case 'lastLogin':
                element.textContent = currentUser.lastLogin || '-';
                break;
            case 'infoRole':
                element.textContent = currentUser.isAdmin ? 'Administrator' : 'Member';
                break;
        }
    }
}

function addToAvatarHistory(avatarData) {
    if (!currentUser.avatarHistory) {
        currentUser.avatarHistory = [];
    }
    
    currentUser.avatarHistory.unshift({
        data: avatarData,
        timestamp: Date.now()
    });
    
    if (currentUser.avatarHistory.length > 6) {
        currentUser.avatarHistory = currentUser.avatarHistory.slice(0, 6);
    }
    
    // Сохраняем сразу после добавления
    saveCurrentUser();
}

function loadAvatarHistory() {
    const historyContainer = document.getElementById('avatarHistory');
    if (!historyContainer || !currentUser) return;
    
    historyContainer.innerHTML = '';
    
    if (!currentUser.avatarHistory || currentUser.avatarHistory.length === 0) {
        historyContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">История аватаров пуста</p>';
        return;
    }
    
    currentUser.avatarHistory.forEach((avatar, index) => {
        const avatarElement = document.createElement('div');
        avatarElement.className = `avatar-history-item ${index === 0 ? 'current' : ''}`;
        
        if (avatar.data.startsWith('data:image')) {
            avatarElement.style.backgroundImage = `url('${avatar.data}')`;
            avatarElement.style.backgroundSize = 'cover';
            avatarElement.style.backgroundPosition = 'center';
        } else {
            avatarElement.textContent = avatar.data;
            avatarElement.style.background = 'linear-gradient(135deg, #6a6a6a, #3a3a3a)';
        }
        
        avatarElement.addEventListener('click', () => {
            currentUser.avatarImage = avatar.data.startsWith('data:image') ? avatar.data : null;
            currentUser.avatar = avatar.data.startsWith('data:image') ? 'U' : avatar.data;
            
            const selectedAvatar = currentUser.avatarHistory.splice(index, 1)[0];
            currentUser.avatarHistory.unshift(selectedAvatar);
            
            saveCurrentUser();
            updateUserUI();
            updateProfileData();
            loadAvatarHistory();
            
            showNotification('Аватар изменен', 'Аватар успешно обновлен', 'success');
        });
        
        historyContainer.appendChild(avatarElement);
    });
}