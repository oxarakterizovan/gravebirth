// ============================================
// НАСТРОЙКИ И БЕЗОПАСНОСТЬ
// ============================================

function switchTab(tabId) {
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.settings-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    const content = document.getElementById(`${tabId}-tab`);
    if (content) content.classList.add('active');
}

function initSettingsTabs() {
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsContents = document.querySelectorAll('.settings-content');
    
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            settingsTabs.forEach(t => t.classList.remove('active'));
            settingsContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const content = document.getElementById(`${tabId}-tab`);
            if (content) content.classList.add('active');
            
            if (tabId === 'security') {
                setTimeout(() => {
                    updateSecurityTab();
                    initSecurityTab();
                }, 100);
            }
        });
    });
}

function updateSecurityTab() {
    if (currentUser) {
        const loginCount = document.getElementById('loginCount');
        const lastLogin = document.getElementById('lastLogin');
        
        if (loginCount) loginCount.textContent = currentUser.loginCount || 0;
        if (lastLogin) lastLogin.textContent = currentUser.lastLogin || '-';
        
        const currentEmailDisplay = document.getElementById('currentEmailDisplay');
        if (currentEmailDisplay) {
            currentEmailDisplay.textContent = currentUser.email;
        }
        
        const currentPhoneDisplay = document.getElementById('currentPhoneDisplay');
        if (currentPhoneDisplay && currentUser.security && currentUser.security.phone) {
            currentPhoneDisplay.textContent = currentUser.security.phone;
        }
    }
}

function loadSettings() {
    if (!currentUser) {
        setTimeout(() => loadSettings(), 100);
        return;
    }
    
    const adminTab = document.getElementById('adminTab');
    if (adminTab && currentUser.isAdmin) {
        adminTab.style.display = 'block';
    }
    
    const currentUserId = document.getElementById('currentUserId');
    const currentUsername = document.getElementById('currentUsername');
    if (currentUserId) currentUserId.textContent = currentUser.userId || '#123456';
    if (currentUsername) currentUsername.textContent = currentUser.username;
    
    const globalLanguageSelect = document.getElementById('globalLanguageSelect');
    if (globalLanguageSelect) {
        globalLanguageSelect.value = currentLanguage;
        globalLanguageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('language', currentLanguage);
            showNotification('Язык изменен', 'Перезагрузите страницу для применения изменений', 'info');
        });
    }
    
    const siteNotifications = document.getElementById('siteNotifications');
    const soundNotifications = document.getElementById('soundNotifications');
    const forumNotifications = document.getElementById('forumNotifications');
    const messageNotifications = document.getElementById('messageNotifications');
    
    if (siteNotifications) {
        siteNotifications.checked = notificationsEnabled;
        siteNotifications.addEventListener('change', (e) => {
            notificationsEnabled = e.target.checked;
            localStorage.setItem('notificationsEnabled', notificationsEnabled);
            showNotification('Уведомления', notificationsEnabled ? 'Включены' : 'Отключены', 'info');
        });
    }
    
    if (soundNotifications) {
        soundNotifications.checked = soundEnabled;
        soundNotifications.addEventListener('change', (e) => {
            soundEnabled = e.target.checked;
            localStorage.setItem('soundEnabled', soundEnabled);
            showNotification('Звуки', soundEnabled ? 'Включены' : 'Отключены', 'info');
        });
    }
    
    loadAvatarHistory();
    
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    
    if (uploadAvatarBtn && avatarUpload) {
        uploadAvatarBtn.replaceWith(uploadAvatarBtn.cloneNode(true));
        avatarUpload.replaceWith(avatarUpload.cloneNode(true));
        
        document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
            document.getElementById('avatarUpload').click();
        });
        
        document.getElementById('avatarUpload').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.type.match('image.*') && file.type !== 'application/json') {
                showNotification('Ошибка', 'Поддерживаются только изображения и JSON файлы', 'error');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(event) {
                if (file.type === 'application/json') {
                    try {
                        const avatarData = JSON.parse(event.target.result);
                        if (avatarData.avatar || avatarData.avatarImage) {
                            currentUser.avatar = avatarData.avatar || 'U';
                            currentUser.avatarImage = avatarData.avatarImage || null;
                            
                            if (avatarData.avatarImage) {
                                addToAvatarHistory(avatarData.avatarImage);
                            } else if (avatarData.avatar) {
                                addToAvatarHistory(avatarData.avatar);
                            }
                            
                            const demoUserIndex = demoUsers.findIndex(u => u.username === currentUser.username);
                            if (demoUserIndex !== -1) {
                                demoUsers[demoUserIndex].avatar = currentUser.avatar;
                                demoUsers[demoUserIndex].avatarImage = currentUser.avatarImage;
                                demoUsers[demoUserIndex].avatarHistory = currentUser.avatarHistory;
                            }
                            
                            updateUserUI();
                            updateProfileData();
                            
                            showNotification('Аватар загружен', 'Аватар успешно загружен из JSON', 'success');
                        } else {
                            showNotification('Ошибка', 'JSON файл не содержит данных об аватаре', 'error');
                        }
                    } catch (error) {
                        showNotification('Ошибка', 'Неверный формат JSON файла', 'error');
                    }
                } else {
                    addToAvatarHistory(event.target.result);
                    currentUser.avatarImage = event.target.result;
                    
                    const demoUserIndex = demoUsers.findIndex(u => u.username === currentUser.username);
                    if (demoUserIndex !== -1) {
                        demoUsers[demoUserIndex].avatarImage = currentUser.avatarImage;
                        demoUsers[demoUserIndex].avatarHistory = currentUser.avatarHistory;
                    }
                    
                    updateUserUI();
                    updateProfileData();
                    loadAvatarHistory();
                    
                    showNotification('Аватар загружен', 'Изображение успешно загружено как аватар', 'success');
                }
                
                document.getElementById('avatarUpload').value = '';
            };
            
            if (file.type === 'application/json') {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        });
    }
    
    setTimeout(() => {
        initSecurityTab();
        updateSecurityTab();
    }, 200);
}

function initSecurityTab() {
    // Обработчики для двухфакторной аутентификации через Telegram
    const telegramAuthToggle = document.getElementById('telegramAuthToggle');
    const telegramAuthSection = document.getElementById('telegramAuthSection');
    const saveTelegramBtn = document.getElementById('saveTelegramBtn');
    const telegramConnected = document.getElementById('telegramConnected');
    
    if (telegramAuthToggle && telegramAuthSection) {
        telegramAuthToggle.addEventListener('change', function() {
            if (this.checked) {
                telegramAuthSection.style.display = 'block';
            } else {
                telegramAuthSection.style.display = 'none';
                telegramConnected.style.display = 'none';
                showNotification('Telegram аутентификация', 'Аутентификация через Telegram отключена', 'info');
            }
            updateTwoFactorAlert();
        });
    }
    
    if (saveTelegramBtn) {
        saveTelegramBtn.addEventListener('click', function() {
            const telegramUsername = document.getElementById('telegramUsernameInput').value.trim();
            
            if (!telegramUsername) {
                showNotification('Ошибка', 'Введите Telegram username', 'error');
                return;
            }
            
            // Симуляция подключения к Telegram
            setTimeout(() => {
                const connectedTelegramDisplay = document.getElementById('connectedTelegramDisplay');
                if (connectedTelegramDisplay) {
                    connectedTelegramDisplay.textContent = `@${telegramUsername}`;
                }
                
                telegramAuthSection.style.display = 'none';
                telegramConnected.style.display = 'block';
                
                showNotification('Telegram подключен', `Аутентификация через @${telegramUsername} активирована`, 'success');
            }, 1500);
        });
    }
    
    // Генерируем уникальный код подключения для каждого пользователя
    const telegramConnectCode = document.getElementById('telegramConnectCode');
    if (telegramConnectCode) {
        let userCode = localStorage.getItem('telegramConnectCode');
        if (!userCode) {
            const timestamp = Date.now().toString(36).toUpperCase();
            const randomPart = Math.random().toString(36).substr(2, 4).toUpperCase();
            const userPart = currentUser ? currentUser.username.substr(0, 2).toUpperCase() : 'GB';
            userCode = `${userPart}-${timestamp}-${randomPart}`;
            localStorage.setItem('telegramConnectCode', userCode);
        }
        telegramConnectCode.textContent = userCode;
    }
    
    // Обработчик для генерации нового кода
    const generateNewCodeBtn = document.getElementById('generateNewCodeBtn');
    if (generateNewCodeBtn && telegramConnectCode) {
        generateNewCodeBtn.addEventListener('click', function() {
            const timestamp = Date.now().toString(36).toUpperCase();
            const randomPart = Math.random().toString(36).substr(2, 4).toUpperCase();
            const userPart = currentUser ? currentUser.username.substr(0, 2).toUpperCase() : 'GB';
            const newCode = `${userPart}-${timestamp}-${randomPart}`;
            
            localStorage.setItem('telegramConnectCode', newCode);
            telegramConnectCode.textContent = newCode;
            
            showNotification('Новый код', 'Код подключения обновлён', 'success');
        });
    }
}

function updateTwoFactorAlert() {
    const telegramAuthToggle = document.getElementById('telegramAuthToggle');
    const twoFactorAlert = document.getElementById('twoFactorAlert');
    
    if (twoFactorAlert) {
        const isTelegramEnabled = telegramAuthToggle && telegramAuthToggle.checked;
        
        if (isTelegramEnabled) {
            twoFactorAlert.style.display = 'block';
        } else {
            twoFactorAlert.style.display = 'none';
        }
    }
}