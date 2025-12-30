// ============================================
// ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ
// ============================================

function deletePost(button) {
    const post = button.closest('.post');
    if (post) {
        const postIndex = Array.from(post.parentNode.children).indexOf(post) - 1;
        if (postIndex >= 0 && postIndex < userPosts.length) {
            userPosts.splice(postIndex, 1);
            localStorage.setItem('userPosts', JSON.stringify(userPosts));
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
        }
        
        const postsContainer = document.getElementById('postsContainer');
        const noPostsMessage = document.getElementById('noPostsMessage');
        if (postsContainer && postsContainer.children.length === 1 && noPostsMessage) {
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
    
    if (userPosts.length === 0) {
        if (noPostsMessage) {
            postsContainer.appendChild(noPostsMessage);
            noPostsMessage.style.display = 'block';
        }
        return;
    }
    
    if (noPostsMessage) noPostsMessage.style.display = 'none';
    
    userPosts.forEach(postData => {
        const postElement = document.createElement('div');
        postElement.className = 'post fade-in';
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-author" onclick="showPage('profile')" style="cursor: pointer;">
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
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
    
    document.querySelectorAll('.left-content a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
    
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
            userPosts = JSON.parse(savedPosts);
        } catch (e) {
            console.error('Error loading posts:', e);
        }
    }
    
    notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    soundEnabled = localStorage.getItem('soundEnabled') === 'true';
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    showPage('home');
    
    // Инициализация форм аутентификации
    initAuthForms();
    
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