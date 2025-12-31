// ============================================
// СИСТЕМА УПРАВЛЕНИЯ РОЛЯМИ И ПРАВАМИ
// ============================================

// Генерация панели управления для пользователя
function generateUserControlPanel(targetUser, currentUser) {
    if (!currentUser || !targetUser) return '';
    
    const controls = [];
    
    // Проверяем права на заглушение
    if (hasPermission(currentUser, 'mute') && canBeMuted(targetUser)) {
        const mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
        const isMuted = mutedUsers.includes(targetUser.username);
        
        if (isMuted && hasPermission(currentUser, 'unmute')) {
            controls.push(`
                <button class="btn btn-small btn-success" onclick="unmuteUser('${targetUser.username}')">
                    <i class="fas fa-volume-up"></i> Снять заглушение
                </button>
            `);
        } else if (!isMuted) {
            controls.push(`
                <button class="btn btn-small btn-warning" onclick="muteUser('${targetUser.username}')">
                    <i class="fas fa-volume-mute"></i> Заглушить
                </button>
            `);
        }
    }
    
    // Проверяем права на блокировку
    if (hasPermission(currentUser, 'ban') && !hasPermission(targetUser, 'immunity')) {
        const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
        const isBanned = bannedUsers.includes(targetUser.username);
        
        if (isBanned && hasPermission(currentUser, 'unban')) {
            controls.push(`
                <button class="btn btn-small btn-success" onclick="unbanUser('${targetUser.username}')">
                    <i class="fas fa-unlock"></i> Разблокировать
                </button>
            `);
        } else if (!isBanned) {
            controls.push(`
                <button class="btn btn-small btn-danger" onclick="banUser('${targetUser.username}')">
                    <i class="fas fa-ban"></i> Заблокировать
                </button>
            `);
        }
    }
    
    // Кнопка просмотра профиля (доступна всем)
    controls.push(`
        <button class="btn btn-small" onclick="viewUserProfile('${targetUser.username}')">
            <i class="fas fa-user"></i> Профиль
        </button>
    `);
    
    return controls.length > 0 ? `<div class="user-controls">${controls.join('')}</div>` : '';
}

// Генерация роль-панели для админки
function generateRolePanel(user) {
    if (!user) return '';
    
    const roleInfo = getRoleInfo(user.role);
    const permissions = getPermissionsList(user.role);
    
    return `
        <div class="role-panel">
            <div class="role-header">
                <div class="role-badge ${user.role}">
                    <i class="${roleInfo.icon}"></i>
                    ${roleInfo.name}
                </div>
                <div class="role-permissions">
                    ${permissions.map(perm => `<span class="permission-tag">${perm}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Информация о ролях
function getRoleInfo(role) {
    const roleData = {
        'chief-admin': { name: 'Chief Administrator', icon: 'fas fa-crown', color: '#ff6b6b' },
        'tech-admin': { name: 'Technical Administrator', icon: 'fas fa-cogs', color: '#4ecdc4' },
        'st-moderator': { name: 'ST. Moderator', icon: 'fas fa-shield-alt', color: '#45b7d1' },
        'moderator': { name: 'Moderator', icon: 'fas fa-gavel', color: '#96ceb4' },
        'media': { name: 'Media', icon: 'fas fa-camera', color: '#feca57' },
        'support': { name: 'Support', icon: 'fas fa-headset', color: '#ff9ff3' },
        'helper': { name: 'Helper', icon: 'fas fa-hands-helping', color: '#54a0ff' },
        'member': { name: 'Member', icon: 'fas fa-user', color: '#ddd' }
    };
    
    return roleData[role] || roleData['member'];
}

// Список разрешений для роли
function getPermissionsList(role) {
    const permissionNames = {
        'mute': 'Заглушение',
        'unmute': 'Снятие заглушения',
        'ban': 'Блокировка',
        'unban': 'Разблокировка',
        'view_logs': 'Просмотр логов',
        'view_users': 'Список пользователей',
        'admin_questions': 'Админ вопросы',
        'immunity': 'Иммунитет'
    };
    
    const userPermissions = permissions[role] || [];
    return userPermissions.map(perm => permissionNames[perm] || perm);
}

// Функции управления пользователями
function muteUser(username) {
    if (!hasPermission(currentUser, 'mute')) {
        showNotification('Ошибка', 'У вас нет прав на заглушение пользователей', 'error');
        return;
    }
    
    const targetUser = demoUsers.find(u => u.username === username);
    if (targetUser && !canBeMuted(targetUser)) {
        showNotification('Ошибка', 'Этот пользователь имеет иммунитет к заглушению', 'error');
        return;
    }
    
    let mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
    if (!mutedUsers.includes(username)) {
        mutedUsers.push(username);
        localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
        showNotification('Успех', `Пользователь ${username} заглушен`, 'success');
        
        // Обновляем интерфейс если находимся в админке
        if (currentPage === 'admin') {
            showUserManagement();
        }
    }
}

function unmuteUser(username) {
    if (!hasPermission(currentUser, 'unmute')) {
        showNotification('Ошибка', 'У вас нет прав на снятие заглушения', 'error');
        return;
    }
    
    let mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
    const index = mutedUsers.indexOf(username);
    if (index > -1) {
        mutedUsers.splice(index, 1);
        localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
        showNotification('Успех', `С пользователя ${username} снято заглушение`, 'success');
        
        // Обновляем интерфейс если находимся в админке
        if (currentPage === 'admin') {
            showUserManagement();
        }
    }
}

function banUser(username) {
    if (!hasPermission(currentUser, 'ban')) {
        showNotification('Ошибка', 'У вас нет прав на блокировку пользователей', 'error');
        return;
    }
    
    const targetUser = demoUsers.find(u => u.username === username);
    if (targetUser && hasPermission(targetUser, 'immunity')) {
        showNotification('Ошибка', 'Этот пользователь имеет иммунитет к блокировке', 'error');
        return;
    }
    
    if (confirm(`Вы уверены, что хотите заблокировать пользователя ${username}?`)) {
        let bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
        if (!bannedUsers.includes(username)) {
            bannedUsers.push(username);
            localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
            showNotification('Успех', `Пользователь ${username} заблокирован`, 'success');
            
            // Обновляем интерфейс если находимся в админке
            if (currentPage === 'admin') {
                showUserManagement();
            }
        }
    }
}

function unbanUser(username) {
    if (!hasPermission(currentUser, 'unban')) {
        showNotification('Ошибка', 'У вас нет прав на разблокировку пользователей', 'error');
        return;
    }
    
    let bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    const index = bannedUsers.indexOf(username);
    if (index > -1) {
        bannedUsers.splice(index, 1);
        localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
        showNotification('Успех', `Пользователь ${username} разблокирован`, 'success');
        
        // Обновляем интерфейс если находимся в админке
        if (currentPage === 'admin') {
            showUserManagement();
        }
    }
}

// Проверка доступа к админ панели
function canAccessAdminPanel(user) {
    if (!user) return false;
    return hasPermission(user, 'view_users') || 
           hasPermission(user, 'view_logs') || 
           hasPermission(user, 'admin_questions') ||
           hasAdminRights(user);
}