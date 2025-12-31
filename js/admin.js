// ============================================
// АДМИНИСТРАТИВНЫЕ ФУНКЦИИ
// ============================================

// Функция для отображения управления пользователями
function showUserManagement() {
    if (!hasPermission(currentUser, 'view_users') && !hasAdminRights(currentUser)) {
        showNotification('Ошибка', 'У вас нет прав на просмотр списка пользователей', 'error');
        return;
    }
    
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
            <button class="btn btn-secondary" onclick="showAdminMain()">Назад к панели</button>
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
    
    const mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
    const bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    
    usersList.innerHTML = filteredUsers.map(user => {
        const roleInfo = getRoleInfo(user.role);
        const isMuted = mutedUsers.includes(user.username);
        const isBanned = bannedUsers.includes(user.username);
        const controlPanel = generateUserControlPanel(user, currentUser);
        
        return `
            <div class="user-item">
                <div class="user-info">
                    <div class="user-avatar" onclick="viewUserProfile('${user.username}')" style="cursor: pointer;">${user.avatar}</div>
                    <div class="user-details">
                        <h4 onclick="viewUserProfile('${user.username}')" style="cursor: pointer; color: var(--text-primary);">${user.username}</h4>
                        <p>${user.email}</p>
                        <div class="user-role-badge ${user.role}" style="background-color: ${roleInfo.color}">
                            <i class="${roleInfo.icon}"></i>
                            ${roleInfo.name}
                        </div>
                        ${isMuted ? '<span class="status-badge muted">Заглушен</span>' : ''}
                        ${isBanned ? '<span class="status-badge banned">Заблокирован</span>' : ''}
                        ${hasPermission(user, 'immunity') ? '<span class="status-badge immunity">Иммунитет</span>' : ''}
                    </div>
                </div>
                <div class="user-stats">
                    <span>Сообщений: ${user.messages || 0}</span>
                    <span>Тем: ${user.topics || 0}</span>
                    <span>Входов: ${user.loginCount || 0}</span>
                </div>
                ${controlPanel}
            </div>
        `;
    }).join('');
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
    if (!hasPermission(currentUser, 'view_users') && !hasPermission(currentUser, 'view_banned') && !hasAdminRights(currentUser)) {
        showNotification('Ошибка', 'У вас нет прав на просмотр заблокированных пользователей', 'error');
        return;
    }
    
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
            <button class="btn btn-secondary" onclick="showAdminMain()">Назад к панели</button>
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
            ${hasPermission(currentUser, 'unban') ? `<button class="btn btn-small btn-success" onclick="unbanUser('${username}')">Разблокировать</button>` : ''}
        </div>
    `).join('');
}

// Функция для отображения заглушенных пользователей
function showMutedUsers() {
    if (!hasPermission(currentUser, 'view_users') && !hasPermission(currentUser, 'view_muted') && !hasAdminRights(currentUser)) {
        showNotification('Ошибка', 'У вас нет прав на просмотр заглушенных пользователей', 'error');
        return;
    }
    
    const mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;
    
    adminContainer.innerHTML = `
        <div class="admin-section">
            <h3>Заглушенные пользователи</h3>
            <div class="user-search-container">
                <input type="text" id="mutedSearchInput" placeholder="Поиск заглушенных..." class="user-search-input">
            </div>
            <div class="muted-users-list" id="mutedUsersList">
                <!-- Заглушенные пользователи будут загружены здесь -->
            </div>
            <button class="btn btn-secondary" onclick="showAdminMain()">Назад к панели</button>
        </div>
    `;
    
    loadMutedUsersList();
    
    const searchInput = document.getElementById('mutedSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadMutedUsersList(this.value);
        });
    }
}

function loadMutedUsersList(searchQuery = '') {
    const mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
    const mutedUsersList = document.getElementById('mutedUsersList');
    if (!mutedUsersList) return;
    
    let filteredUsers = mutedUsers;
    if (searchQuery) {
        filteredUsers = mutedUsers.filter(username => 
            username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (filteredUsers.length === 0) {
        const message = searchQuery ? 'Заглушенные пользователи не найдены' : 'Нет заглушенных пользователей';
        mutedUsersList.innerHTML = `<p style="text-align: center; color: var(--text-secondary);">${message}</p>`;
        return;
    }
    
    mutedUsersList.innerHTML = filteredUsers.map(username => `
        <div class="muted-user-item">
            <span>${username}</span>
            ${hasPermission(currentUser, 'unmute') ? `<button class="btn btn-small btn-success" onclick="unmuteUser('${username}')">Снять заглушение</button>` : ''}
        </div>
    `).join('');
}

// Функция для разблокировки пользователя
function unbanUser(username) {
    let bannedUsers = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    bannedUsers = bannedUsers.filter(user => user !== username);
    localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
    showNotification('Успех', `Пользователь ${username} разблокирован`, 'success');
    loadBannedUsersList(document.getElementById('bannedSearchInput')?.value || '');
}

// Функция для снятия заглушения
function unmuteUser(username) {
    let mutedUsers = JSON.parse(localStorage.getItem('mutedUsers') || '[]');
    mutedUsers = mutedUsers.filter(user => user !== username);
    localStorage.setItem('mutedUsers', JSON.stringify(mutedUsers));
    showNotification('Успех', `С пользователя ${username} снято заглушение`, 'success');
    loadMutedUsersList(document.getElementById('mutedSearchInput')?.value || '');
}



// Функция для отображения вопросов администрации
function showAdminQuestions() {
    if (!hasPermission(currentUser, 'admin_questions')) {
        showNotification('Ошибка', 'У вас нет доступа к вопросам администрации', 'error');
        return;
    }
    
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;
    
    const questions = [
        { id: 1, user: 'dev_user', question: 'Как сменить никнейм?', status: 'Открыт', date: new Date().toLocaleString() },
        { id: 2, user: 'NewUser', question: 'Почему не могу создать тему?', status: 'Открыт', date: new Date(Date.now() - 3600000).toLocaleString() },
        { id: 3, user: 'TestUser', question: 'Как загрузить аватар?', status: 'Закрыт', date: new Date(Date.now() - 7200000).toLocaleString() }
    ];
    
    adminContainer.innerHTML = `
        <div class="admin-section">
            <h3>Вопросы администрации</h3>
            <div class="user-search-container">
                <input type="text" id="questionsSearchInput" placeholder="Поиск по вопросам..." class="user-search-input">
            </div>
            <div class="questions-list" id="questionsList">
                ${questions.map(q => `
                    <div class="question-item">
                        <div class="question-header">
                            <span class="question-user">${q.user}</span>
                            <span class="question-status ${q.status === 'Открыт' ? 'open' : 'closed'}">${q.status}</span>
                            <span class="question-date">${q.date}</span>
                        </div>
                        <div class="question-text">${q.question}</div>
                        <div class="question-actions">
                            <button class="btn btn-small" onclick="answerQuestion(${q.id})">Ответить</button>
                            ${q.status === 'Открыт' ? 
                                `<button class="btn btn-small btn-success" onclick="closeQuestion(${q.id})">Закрыть</button>` :
                                `<button class="btn btn-small btn-warning" onclick="reopenQuestion(${q.id})">Переоткрыть</button>`
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-secondary" onclick="showAdminMain()">Назад к панели</button>
        </div>
    `;
}

function answerQuestion(questionId) {
    showNotification('Инфо', `Ответ на вопрос #${questionId} отправлен`, 'info');
}

function closeQuestion(questionId) {
    showNotification('Успех', `Вопрос #${questionId} закрыт`, 'success');
}

function reopenQuestion(questionId) {
    showNotification('Успех', `Вопрос #${questionId} переоткрыт`, 'success');
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
    if (!hasPermission(currentUser, 'view_logs')) {
        showNotification('Ошибка', 'У вас нет прав на просмотр системных логов', 'error');
        return;
    }
    
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;
    
    const logs = [
        { time: new Date().toLocaleString(), action: 'Вход администратора', user: currentUser.username },
        { time: new Date(Date.now() - 3600000).toLocaleString(), action: 'Создание темы', user: 'dev_user' },
        { time: new Date(Date.now() - 7200000).toLocaleString(), action: 'Регистрация пользователя', user: 'NewUser' },
        { time: new Date(Date.now() - 10800000).toLocaleString(), action: 'Изменение роли', user: 'GRAVEBIRTH' },
        { time: new Date(Date.now() - 14400000).toLocaleString(), action: 'Блокировка пользователя', user: 'spammer123' },
        { time: new Date(Date.now() - 18000000).toLocaleString(), action: 'Экспорт данных', user: 'GRAVEBIRTH' }
    ];
    
    adminContainer.innerHTML = `
        <div class="admin-section">
            <h3>Системные логи</h3>
            <div class="user-search-container">
                <input type="text" id="logsSearchInput" placeholder="Поиск по действию или пользователю..." class="user-search-input">
            </div>
            <div class="logs-list" id="logsList">
                <!-- Логи будут загружены здесь -->
            </div>
            <button class="btn btn-secondary" onclick="showAdminMain()">Назад к панели</button>
        </div>
    `;
    
    loadLogsList(logs);
    
    const searchInput = document.getElementById('logsSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadLogsList(logs, this.value);
        });
    }
}

function loadLogsList(logs, searchQuery = '') {
    const logsList = document.getElementById('logsList');
    if (!logsList) return;
    
    let filteredLogs = logs;
    if (searchQuery) {
        filteredLogs = logs.filter(log => 
            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.user.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (filteredLogs.length === 0) {
        logsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Логи не найдены</p>';
        return;
    }
    
    logsList.innerHTML = filteredLogs.map(log => `
        <div class="log-item">
            <span class="log-time">${log.time}</span>
            <span class="log-action">${log.action}</span>
            <span class="log-user">${log.user}</span>
        </div>
    `).join('');
}

// Функция для обновления статистики админ-панели
function updateAdminStats() {
    // Функция оставлена для совместимости
}

// Функция для загрузки админ-панели
function showAdminMain() {
    const adminContainer = document.querySelector('.admin-container');
    if (!adminContainer) return;
    
    const userPermissions = permissions[currentUser.role] || [];
    
    adminContainer.innerHTML = `
        <div class="admin-sections">
            ${hasPermission(currentUser, 'view_users') || hasPermission(currentUser, 'view_banned') || hasPermission(currentUser, 'view_muted') ? `
                <div class="admin-section">
                    <h3>Управление пользователями</h3>
                    <div class="admin-actions">
                        ${hasPermission(currentUser, 'view_users') ? '<button class="btn" onclick="showUserManagement()">Список пользователей</button>' : ''}
                        ${hasPermission(currentUser, 'view_banned') || hasPermission(currentUser, 'view_users') ? '<button class="btn" onclick="showBannedUsers()">Заблокированные</button>' : ''}
                        ${hasPermission(currentUser, 'view_muted') || hasPermission(currentUser, 'view_users') ? '<button class="btn" onclick="showMutedUsers()">Заглушенные</button>' : ''}
                    </div>
                </div>
            ` : ''}
            
            ${hasPermission(currentUser, 'admin_questions') ? `
                <div class="admin-section">
                    <h3>Поддержка</h3>
                    <div class="admin-actions">
                        <button class="btn" onclick="showAdminQuestions()">Вопросы администрации</button>
                    </div>
                </div>
            ` : ''}
            
            ${hasPermission(currentUser, 'view_logs') ? `
                <div class="admin-section">
                    <h3>Системные настройки</h3>
                    <div class="admin-actions">
                        <button class="btn" onclick="showSystemLogs()">Системные логи</button>
                    </div>
                </div>
            ` : ''}
            
            <div class="admin-section">
                <h3>Управление контентом</h3>
                <div class="admin-actions">
                    <button class="btn" onclick="exportData()">Экспорт данных</button>
                </div>
            </div>
            
            <div class="admin-section">
                <h3>Ваши права</h3>
                <div class="permissions-display">
                    ${userPermissions.length > 0 ? 
                        userPermissions.map(perm => {
                            const permNames = {
                                'mute': 'Заглушение пользователей',
                                'unmute': 'Снятие заглушения',
                                'ban': 'Блокировка пользователей', 
                                'unban': 'Разблокировка пользователей',
                                'view_logs': 'Просмотр системных логов',
                                'view_users': 'Просмотр списка пользователей',
                                'admin_questions': 'Доступ к вопросам администрации',
                                'immunity': 'Иммунитет к модерации'
                            };
                            return `<span class="permission-badge">${permNames[perm] || perm}</span>`;
                        }).join('') 
                        : '<span class="no-permissions">Базовые права пользователя</span>'
                    }
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