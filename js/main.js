// ============================================
// ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ
// ============================================

function deletePost(button) {
    const post = button.closest('.post');
    if (post) {
        const postContent = post.querySelector('.post-content').textContent;
        const postDate = post.querySelector('.post-header span:last-child').textContent;
        
        // Находим индекс поста по содержимому и дате
        const postIndex = userPosts.findIndex(p => 
            p.content === postContent && 
            p.date === postDate && 
            p.author === (currentUser ? currentUser.username : '')
        );
        
        if (postIndex !== -1) {
            userPosts.splice(postIndex, 1);
            localStorage.setItem('allUserPosts', JSON.stringify(userPosts));
        }
        
        post.remove();
        
        if (currentUser && currentUser.messages > 0) {
            currentUser.messages--;
            
            const demoUserIndex = demoUsers.findIndex(u => u.username === currentUser.username);
            if (demoUserIndex !== -1) {
                demoUsers[demoUserIndex].messages = currentUser.messages;
            }
            
            updateProfileData();
            saveCurrentUser();
            
            // Обновляем сохраненные аккаунты
            const accounts = getSavedAccounts();
            const accountIndex = accounts.findIndex(acc => acc.id === activeAccountId);
            if (accountIndex !== -1) {
                accounts[accountIndex].userData = currentUser;
                localStorage.setItem('savedAccounts', JSON.stringify(accounts));
            }
        }
        
        const postsContainer = document.getElementById('postsContainer');
        const noPostsMessage = document.getElementById('noPostsMessage');
        const currentUserPosts = userPosts.filter(p => p.author === (currentUser ? currentUser.username : ''));
        
        if (postsContainer && currentUserPosts.length === 0 && noPostsMessage) {
            postsContainer.appendChild(noPostsMessage);
            noPostsMessage.style.display = 'block';
        }
        
        showNotification('Сообщение удалено', 'Сообщение успешно удалено из профиля', 'success');
    }
}

function loadUserPosts() {
    const postsContainer = document.getElementById('postsContainer');
    const noPostsMessage = document.getElementById('noPostsMessage');
    
    if (!postsContainer) return;
    
    postsContainer.innerHTML = '';
    
    // Фильтруем посты только для текущего пользователя
    const currentUserPosts = userPosts.filter(post => post.author === (currentUser ? currentUser.username : ''));
    
    if (currentUserPosts.length === 0) {
        if (noPostsMessage) {
            postsContainer.appendChild(noPostsMessage);
            noPostsMessage.style.display = 'block';
        }
        return;
    }
    
    if (noPostsMessage) noPostsMessage.style.display = 'none';
    
    currentUserPosts.forEach((postData, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post fade-in';
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-author" onclick="viewUserProfile('${postData.author}')" style="cursor: pointer;">
                    <div class="user-avatar ${postData.avatarImage ? 'avatar-with-image' : ''}" 
                         style="${postData.avatarImage ? `background-image: url('${postData.avatarImage}')` : ''}">
                        ${postData.avatarImage ? '' : postData.avatar}
                    </div>
                    <span><strong>${postData.author}</strong></span>
                </div>
                <span>${postData.date}</span>
                <button class="delete-post-btn" onclick="deletePost(this)" title="Удалить сообщение">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="post-content">
                ${postData.content}
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

    document.addEventListener('DOMContentLoaded', () => {
    console.log('GRAVEBIRTH Website Loaded');
    
    const authBtn = document.getElementById('authBtn');
    const loginModal = document.getElementById('loginModal');
    
    if (authBtn && loginModal) {
        authBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }
    
    // Инициализация навигации
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
    
    document.querySelectorAll('.left-content a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Логотип для перехода на главную
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('home');
        });
        logo.style.cursor = 'pointer';
    }
    
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const switchToLogin = document.getElementById('switchToLogin');
    const switchToRegister = document.getElementById('switchToRegister');
    const registerModal = document.getElementById('registerModal');
    
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }
    
    if (closeRegisterModal) {
        closeRegisterModal.addEventListener('click', () => {
            registerModal.classList.remove('active');
            // Очищаем таймер при закрытии модального окна
            if (registrationTimerInterval) {
                clearInterval(registrationTimerInterval);
                registrationTimerInterval = null;
            }
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            registerModal.classList.add('active');
            
            // Сбрасываем форму и запускаем таймер
            resetRegistrationForm();
            setTimeout(() => startRegistrationTimer(), 100);
        });
    }
    
    const savedUser = localStorage.getItem('currentUser');
    const savedActiveAccountId = localStorage.getItem('activeAccountId');
    
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            activeAccountId = savedActiveAccountId;
            isLoggedIn = true;
            updateUserUI();
            updateProfileData();
        } catch (e) {
            console.error('Error loading user:', e);
        }
    }
    
    const savedPosts = localStorage.getItem('userPosts');
    if (savedPosts) {
        try {
            // Очищаем старые посты
            localStorage.removeItem('userPosts');
        } catch (e) {
            console.error('Error cleaning old posts:', e);
        }
    }
    
    // Загружаем все посты
    const savedAllPosts = localStorage.getItem('allUserPosts');
    if (savedAllPosts) {
        try {
            userPosts = JSON.parse(savedAllPosts);
        } catch (e) {
            userPosts = [];
        }
    } else {
        userPosts = [];
    }
    
    notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    soundEnabled = localStorage.getItem('soundEnabled') === 'true';
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Проверяем sessionStorage для открытия темы в новой вкладке
    const topicToOpen = sessionStorage.getItem('openTopic');
    if (topicToOpen) {
        try {
            const { category, title } = JSON.parse(topicToOpen);
            sessionStorage.removeItem('openTopic');
            setTimeout(() => {
                openTopic(category, title);
            }, 500);
        } catch (e) {
            console.error('Error parsing topic data:', e);
        }
    } else {
        // Восстанавливаем последнюю активную страницу
        const savedPage = localStorage.getItem('currentPage') || 'home';
        
        // Проверяем URL хэш для прямых ссылок на темы
        const hash = window.location.hash;
        if (hash.startsWith('#topic/')) {
            const parts = hash.substring(7).split('/');
            if (parts.length === 2) {
                const category = parts[0];
                const title = decodeURIComponent(parts[1]);
                setTimeout(() => {
                    openTopic(category, title);
                }, 500);
            }
        } else {
            showPage(savedPage);
        }
    }
    
    // Загружаем посты если пользователь вошел и находится на странице профиля
    const currentPage = localStorage.getItem('currentPage') || 'home';
    if (isLoggedIn && currentPage === 'profile') {
        setTimeout(() => loadUserPosts(), 100);
    }
    
    // Временная очистка всех постов для отладки
    localStorage.removeItem('userPosts');
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('userPosts_')) {
            localStorage.removeItem(key);
        }
    });
    userPosts = [];
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация форм аутентификации
    initAuthForms();
    
    // ВРЕМЕННО: Очистка всех постов для отладки
    // localStorage.removeItem('userPosts');
    // userPosts = [];
    
    window.switchTab = function(tabId) {
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.settings-content').forEach(c => c.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        const content = document.getElementById(`${tabId}-tab`);
        if (content) content.classList.add('active');
    };
    
    setTimeout(() => {
        showNotification('Добро пожаловать', 'С любовью BLACK TRIAD CSC', 'success', 3000);
    }, 1000);
    
    // Наблюдатель за модальным окном регистрации
    if (registerModal) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (registerModal.classList.contains('active')) {
                        resetRegistrationForm();
                        setTimeout(() => startRegistrationTimer(), 100);
                    }
                }
            });
        });
        observer.observe(registerModal, { attributes: true });
    }
    
    // Обработчики для условий и политики конфиденциальности
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const closeTermsModal = document.getElementById('closeTermsModal');
    const closePrivacyModal = document.getElementById('closePrivacyModal');
    
    if (termsLink && termsModal) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.classList.add('active');
        });
    }
    
    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
        });
    }
    
    if (closeTermsModal && termsModal) {
        closeTermsModal.addEventListener('click', () => {
            termsModal.classList.remove('active');
        });
    }
    
    if (closePrivacyModal && privacyModal) {
        closePrivacyModal.addEventListener('click', () => {
            privacyModal.classList.remove('active');
        });
    }
    
    // Обработчик для "Забыли пароль?"
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotPasswordModal = document.getElementById('closeForgotPasswordModal');
    const backToLogin = document.getElementById('backToLogin');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            forgotPasswordModal.classList.add('active');
        });
    }
    
    if (closeForgotPasswordModal && forgotPasswordModal) {
        closeForgotPasswordModal.addEventListener('click', () => {
            forgotPasswordModal.classList.remove('active');
        });
    }
    
    if (backToLogin && forgotPasswordModal && loginModal) {
        backToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            forgotPasswordModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('recoveryEmail').value;
            
            if (!email) {
                showNotification('Ошибка', 'Введите адрес электронной почты', 'error');
                return;
            }
            
            // Проверяем, существует ли пользователь с таким email
            const userExists = demoUsers.find(user => user.email === email);
            
            if (userExists) {
                showNotification('Письмо отправлено', `Ссылка для восстановления пароля отправлена на ${email}`, 'success', 8000);
                forgotPasswordModal.classList.remove('active');
                document.getElementById('recoveryEmail').value = '';
            } else {
                showNotification('Email не найден', 'Пользователь с таким email не зарегистрирован. Обратитесь к администрации.', 'error', 8000);
            }
        });
    }
    
    // Обработчик для переключения аккаунтов
    const switchAccountLink = document.getElementById('switchAccountLink');
    const switchAccountModal = document.getElementById('switchAccountModal');
    const closeSwitchAccountModal = document.getElementById('closeSwitchAccountModal');
    const addAccountBtn = document.getElementById('addAccountBtn');
    
    if (switchAccountLink && switchAccountModal) {
        switchAccountLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadAccountsList();
            switchAccountModal.classList.add('active');
        });
    }
    
    if (closeSwitchAccountModal && switchAccountModal) {
        closeSwitchAccountModal.addEventListener('click', () => {
            switchAccountModal.classList.remove('active');
        });
    }
    
    if (addAccountBtn && switchAccountModal && loginModal) {
        addAccountBtn.addEventListener('click', () => {
            switchAccountModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }
    
    // Обработчик для создания постов в профиле
    const submitPostBtn = document.getElementById('submitPostBtn');
    const newPostText = document.getElementById('newPostText');
    
    if (submitPostBtn && newPostText) {
        submitPostBtn.addEventListener('click', () => {
            if (!isLoggedIn || !currentUser) {
                showNotification('Ошибка', 'Необходимо войти в систему', 'error');
                return;
            }
            
            const content = newPostText.value.trim();
            if (!content) {
                showNotification('Ошибка', 'Введите текст сообщения', 'error');
                return;
            }
            
            const newPost = {
                id: Date.now(),
                author: currentUser.username,
                content: content,
                date: new Date().toLocaleString(),
                avatar: currentUser.avatar,
                avatarImage: currentUser.avatarImage
            };
            
            userPosts.unshift(newPost);
            localStorage.setItem('allUserPosts', JSON.stringify(userPosts));
            
            currentUser.messages = (currentUser.messages || 0) + 1;
            
            const demoUserIndex = demoUsers.findIndex(u => u.username === currentUser.username);
            if (demoUserIndex !== -1) {
                demoUsers[demoUserIndex].messages = currentUser.messages;
            }
            
            updateProfileData();
            saveCurrentUser();
            
            // Обновляем сохраненные аккаунты
            const accounts = getSavedAccounts();
            const accountIndex = accounts.findIndex(acc => acc.id === activeAccountId);
            if (accountIndex !== -1) {
                accounts[accountIndex].userData = currentUser;
                localStorage.setItem('savedAccounts', JSON.stringify(accounts));
            }
            
            newPostText.value = '';
            loadUserPosts();
            
            showNotification('Сообщение опубликовано', 'Ваше сообщение добавлено в профиль', 'success');
        });
    }
});

// Функции управления аккаунтами
function loadAccountsList() {
    const accountsList = document.getElementById('accountsList');
    if (!accountsList) return;
    
    const accounts = getSavedAccounts();
    
    if (accounts.length === 0) {
        accountsList.innerHTML = `
            <div class="no-accounts">
                <i class="fas fa-user-plus"></i>
                <p>Нет сохраненных аккаунтов</p>
            </div>
        `;
        return;
    }
    
    accountsList.innerHTML = accounts.map(account => `
        <div class="account-item ${account.id === activeAccountId ? 'active' : ''}" onclick="switchToAccount('${account.id}')">
            <div class="account-avatar">${account.avatar}</div>
            <div class="account-info">
                <div class="account-username">${account.username}</div>
                <div class="account-email">${account.email}</div>
            </div>
            <div class="account-status">
                <div class="status-indicator ${account.id === activeAccountId ? '' : 'offline'}"></div>
                <button class="account-remove" onclick="removeAccount(event, '${account.id}')" title="Удалить аккаунт">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getSavedAccounts() {
    const saved = localStorage.getItem('savedAccounts');
    return saved ? JSON.parse(saved) : [];
}

function saveAccount(user) {
    const accounts = getSavedAccounts();
    const accountId = user.username + '_' + Date.now();
    
    const existingIndex = accounts.findIndex(acc => acc.username === user.username && acc.email === user.email);
    
    if (existingIndex === -1) {
        accounts.push({
            id: accountId,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            userData: user
        });
        localStorage.setItem('savedAccounts', JSON.stringify(accounts));
    }
    
    activeAccountId = existingIndex === -1 ? accountId : accounts[existingIndex].id;
    localStorage.setItem('activeAccountId', activeAccountId);
}

function switchToAccount(accountId) {
    const accounts = getSavedAccounts();
    const account = accounts.find(acc => acc.id === accountId);
    
    if (account) {
        currentUser = account.userData;
        activeAccountId = accountId;
        isLoggedIn = true;
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('activeAccountId', activeAccountId);
        
        updateUserUI();
        updateProfileData();
        
        document.getElementById('switchAccountModal').classList.remove('active');
        showNotification('Аккаунт переключен', `Вы вошли как ${account.username}`, 'success');
    }
}

function removeAccount(event, accountId) {
    event.stopPropagation();
    
    const accounts = getSavedAccounts();
    const filteredAccounts = accounts.filter(acc => acc.id !== accountId);
    
    localStorage.setItem('savedAccounts', JSON.stringify(filteredAccounts));
    
    if (accountId === activeAccountId) {
        if (filteredAccounts.length > 0) {
            switchToAccount(filteredAccounts[0].id);
        } else {
            logout();
        }
    }
    
    loadAccountsList();
    showNotification('Аккаунт удален', 'Аккаунт успешно удален из списка', 'success');
}