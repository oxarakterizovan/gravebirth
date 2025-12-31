// ============================================
// АДМИНИСТРАТИВНЫЕ ФУНКЦИИ
// ============================================

// Функция для отображения управления пользователями
function showUserManagement() {
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;
    
    adminContainer.innerHTML = `
        <div class="admin-section">
            <h3>Управление пользователями</h3>
            <div class="user-search-container">
                <input type="text" id="userSearchInput" placeholder="Поиск по никнейму..." class="user-search-input">
            </div>
            <div class="users-list" id="usersList">
                <!-- Пользователи будут загружены здесь -->
            </div>
            <button class="btn btn-secondary" onclick="loadAdminPanel()">Назад к панели</button>
        </div>
    `;
    
    loadUsersList();
    
    // Обработчик поиска
    const searchInput = document.getElementById('userSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadUsersList(this.value);
        });
    }
}

function loadUsersList(searchQuery = '') {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    let filteredUsers = demoUsers;
    if (searchQuery) {
        filteredUsers = demoUsers.filter(user => 
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Пользователи не найдены</p>';
        return;
    }
    
    usersList.innerHTML = filteredUsers.map(user => `
        <div class="user-item">
            <div class="user-info">
                <div class="user-avatar" onclick="viewUserProfile('${user.username}')" style="cursor: pointer;">${user.avatar}</div>
                <div class="user-details">
                    <h4 onclick="viewUserProfile('${user.username}')" style="cursor: pointer; color: var(--text-primary);">${user.username}</h4>
                    <p>${user.email}</p>
                    <span class="user-role">${getUserRole(user)}</span>
                </div>
            </div>
            <div class="user-stats">
                <span>Сообщений: ${user.messages || 0}</span>
                <span>Тем: ${user.topics || 0}</span>
                <span>Входов: ${user.loginCount || 0}</span>
            </div>
            <div class="user-actions">
                <button class="btn btn-small" onclick="viewUserProfile('${user.username}')" title="Профиль"><i class="fas fa-user"></i></button>
                <button class="btn btn-small" onclick="changeUserRole('${user.username}')" title="Роль"><i class="fas fa-crown"></i></button>
                ${!user.isAdmin ? `<button class="btn btn-small btn-warning" onclick="banUser('${user.username}')" title="Заблокировать"><i class="fas fa-ban"></i></button>` : ''}
            </div>
        </div>
    `).join('');
}

function changeUserRole(username) {
    const user = demoUsers.find(u => u.username === username);
    if (!user) return;
    
    const roles = {
        'member': 'Member',
        'helper': 'Helper',
        'support': 'Support',
        'media': 'Media',
        'moderator': 'Moderator',
        'st-moderator': 'ST. Moderator',
        'tech-admin': 'Technical Administrator',
        'chief-admin': 'Chief Administrator'
    };
    
    let roleOptions = '';
    for (const [key, value] of Object.entries(roles)) {
        const selected = user.role === key ? 'selected' : '';
        roleOptions += `<option value="${key}" ${selected}>${value}</option>`;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
            <h2>Изменить роль пользователя</h2>
            <div class="form-group">
                <label>Пользователь: <strong>${username}</strong></label>
                <label>Текущая роль: <strong>${getUserRole(user)}</strong></label>
            </div>
            <div class="form-group">
                <label for="newRole">Новая роль:</label>
                <select id="newRole">
                    ${roleOptions}
                </select>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Отмена</button>
                <button class="btn" onclick="saveUserRole('${username}', document.getElementById('newRole').value); this.closest('.modal').remove();">Сохранить</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function saveUserRole(username, newRole) {
    const userIndex = demoUsers.findIndex(u => u.username === username);
    if (userIndex === -1) return;
    
    const oldRole = demoUsers[userIndex].role;
    demoUsers[userIndex].role = newRole;
    demoUsers[userIndex].isAdmin = ['chief-admin', 'tech-admin'].includes(newRole);
    
    // Обновляем текущего пользователя если это он
    if (currentUser && currentUser.username === username) {
        currentUser.role = newRole;
        currentUser.isAdmin = demoUsers[userIndex].isAdmin;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserUI();
    }
    
    showNotification('Успех', `Роль пользователя ${username} изменена с "${getUserRole({role: oldRole})}" на "${getUserRole({role: newRole})}"`, 'success');
    loadUsersList(document.getElementById('userSearchInput')?.value || '');
}

// Функция для отображения заблокированных пользователей
function showBannedUsers() {
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;
    
    adminContainer.innerHTML = `
        <div class="admin-section">
            <h3>Заблокированные пользователи</h3>
            <div class="user-search-container">
                <input type="text" id="bannedSearchInput" placeholder="Поиск заблокированных..." class="user-search-input">
            </div>
            <div class="banned-users-list" id="bannedUsersList">
                <!-- Заблокированные пользователи будут загружены здесь -->
            </div>
            <button class="btn btn-secondary" onclick="loadAdminPanel()">Назад к панели</button>
        </div>
    `;
    
    loadBannedUsersList();
    
    const searchInput = document.getElementById('bannedSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadBannedUsersList(this.value);
        });
    }
}

function loadBannedUsersList(searchQuery = '') {
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    const bannedUsersList = document.getElementById('bannedUsersList');
    if (!bannedUsersList) return;
    
    let filteredUsers = bannedUsers;
    if (searchQuery) {
        filteredUsers = bannedUsers.filter(username => 
            username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (filteredUsers.length === 0) {
        const message = searchQuery ? 'Заблокированные пользователи не найдены' : 'Нет заблокированных пользователей';
        bannedUsersList.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">${message}</p>`;
        return;
    }
    
    bannedUsersList.innerHTML = filteredUsers.map(username => `
        <div class="banned-user-item">
            <span>${username}</span>
            <button class="btn btn-small btn-success" onclick="unbanUser('${username}')">Разблокировать</button>
        </div>
    `).join('');
}

// Функция для отображения заглушенных пользователей
function showMutedUsers() {
    const mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;
    
    if (mutedUsers.length === 0) {
        adminContainer.innerHTML = `
            <div class="admin-section">
                <h3>Заглушенные пользователи</h3>
                <p>Нет заглушенных пользователей</p>
                <button class="btn btn-secondary" onclick="loadAdminPanel()">Назад к панели</button>
            </div>
        `;
        return;
    }
    
    const mutedList = mutedUsers.map(username => `
        <div class="muted-user-item">
            <span>${username}</span>
            <button class="btn btn-small btn-success" onclick="unmuteUser('${username}')">Снять заглушение</button>
        </div>
    `).join('');
    
    adminContainer.innerHTML = `
        <div class="admin-section">
            <h3>Заглушенные пользователи</h3>
            <div class="muted-users-list">
                ${mutedList}
            </div>
            <button class="btn btn-secondary" onclick="loadAdminPanel()">Назад к панели</button>
        </div>
    `;
}

// Функция для разблокировки пользователя
function unbanUser(username) {
    let bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    bannedUsers = bannedUsers.filter(user => user !== username);
    localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
    showNotification('Успех', `Пользователь ${username} разблокирован`, 'success');
    showBannedUsers();
}

// Функция для снятия заглушения
function unmuteUser(username) {
    let mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
    mutedUsers = mutedUsers.filter(user => user !== username);
    localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
    showNotification('Успех', `С пользователя ${username} снято заглушение`, 'success');
    showMutedUsers();
}



// Функция для экспорта данных
function exportData() {
    const data = {
        users: demoUsers,
        topics: userTopics,
        posts: userPosts,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `gravebirth_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Успех', 'Данные экспортированы', 'success');
}



// Функция для отображения системных логов
function showSystemLogs() {
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;
    
    const logs = [
        { time: new Date().toLocaleString(), action: 'Вход администратора', user: currentUser.username },
        { time: new Date(Date.now() - 3600000).toLocaleString(), action: 'Создание темы', user: 'dev_user' },
        { time: new Date(Date.now() - 7200000).toLocaleString(), action: 'Регистрация пользователя', user: 'NewUser' }
    ];
    
    const logsList = logs.map(log => `
        <div class="log-item">
            <span class="log-time">${log.time}</span>
            <span class="log-action">${log.action}</span>
            <span class="log-user">${log.user}</span>
        </div>
    `).join('');
    
    adminContainer.innerHTML = `
        <div class="admin-section">
            <h3>Системные логи</h3>
            <div class="logs-list">
                ${logsList}
            </div>
            <button class="btn btn-secondary" onclick="loadAdminPanel()">Назад к панели</button>
        </div>
    `;
}

// Функция для обновления статистики админ-панели
function updateAdminStats() {
    // Функция оставлена для совместимости
}

// Функция для загрузки админ-панели
function loadAdminPanel() {
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;
    
    adminContainer.innerHTML = `
        <div class="admin-sections">
            <div class="admin-section">
                <h3>Управление пользователями</h3>
                <div class="admin-actions">
                    <button class="btn" onclick="showUserManagement()">Список пользователей</button>
                    <button class="btn" onclick="showBannedUsers()">Заблокированные</button>
                    <button class="btn" onclick="showMutedUsers()">Заглушенные</button>
                </div>
            </div>
            
            <div class="admin-section">
                <h3>Управление контентом</h3>
                <div class="admin-actions">
                    <button class="btn" onclick="exportData()">Экспорт данных</button>
                </div>
            </div>
            
            <div class="admin-section">
                <h3>Системные настройки</h3>
                <div class="admin-actions">
                    <button class="btn" onclick="showSystemLogs()">Системные логи</button>
                </div>
            </div>
        </div>
    `;
}

// Инициализация админ-панели при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем статистику при загрузке админ-страницы
    if (document.getElementById('admin-page')) {
        updateAdminStats();
    }
});