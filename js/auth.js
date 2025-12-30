// ============================================
// СИСТЕМА АУТЕНТИФИКАЦИИ
// ============================================

// Переменная для хранения интервала таймера
let registrationTimerInterval = null;

// Функция сброса формы регистрации
function resetRegistrationForm() {
    const registerForm = document.getElementById('registerForm');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');
    const timerDiv = document.getElementById('registerTimer');
    
    if (registerForm) {
        registerForm.reset();
    }
    
    if (registerSubmitBtn) {
        registerSubmitBtn.disabled = true;
        registerSubmitBtn.textContent = 'Ожидание (10)';
    }
    
    if (timerDiv) {
        timerDiv.style.display = 'block';
    }
    
    // Очищаем предыдущий таймер
    if (registrationTimerInterval) {
        clearInterval(registrationTimerInterval);
        registrationTimerInterval = null;
    }
}

// Функция запуска таймера регистрации
function startRegistrationTimer() {
    // Очищаем предыдущий таймер, если он существует
    if (registrationTimerInterval) {
        clearInterval(registrationTimerInterval);
        registrationTimerInterval = null;
    }
    
    let timerSeconds = 10;
    const timerElement = document.getElementById('timerCount');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');
    const timerDiv = document.getElementById('registerTimer');
    
    // Проверяем, что элементы существуют
    if (!timerElement || !registerSubmitBtn) {
        console.log('Timer elements not found');
        return;
    }
    
    registerSubmitBtn.disabled = true;
    registerSubmitBtn.textContent = 'Ожидание (10)';
    if (timerDiv) timerDiv.style.display = 'block';
    
    registrationTimerInterval = setInterval(() => {
        timerSeconds--;
        timerElement.textContent = timerSeconds;
        registerSubmitBtn.textContent = `Ожидание (${timerSeconds})`;
        
        if (timerSeconds <= 0) {
            clearInterval(registrationTimerInterval);
            registrationTimerInterval = null;
            registerSubmitBtn.disabled = false;
            registerSubmitBtn.textContent = 'Регистрация';
            if (timerDiv) timerDiv.style.display = 'none';
        }
    }, 1000);
}

// Функция завершения входа
function completeLogin(user, rememberMe) {
    isLoggedIn = true;
    currentUser = { ...user };
    
    currentUser.loginCount = (currentUser.loginCount || 0) + 1;
    currentUser.lastLogin = new Date().toLocaleString();
    currentUser.status = 'Online';
    
    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    updateUserUI();
    
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.classList.remove('active');
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    
    showNotification('Вход выполнен', `Добро пожаловать, ${user.username}!`, 'success');
}

// Инициализация обработчиков форм
function initAuthForms() {
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const usernameOrEmail = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false;
            
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
            submitBtn.disabled = true;
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const user = demoUsers.find(u => 
                (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
                u.password === password
            );
            
            if (user) {
                completeLogin(user, rememberMe);
            } else {
                showNotification('Ошибка входа', 'Неверное имя пользователя или пароль', 'error');
            }
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const termsAccepted = document.getElementById('regTerms').checked;
            
            if (!username || !email || !password || !confirmPassword) {
                showNotification('Ошибка', 'Заполните все обязательные поля', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Ошибка', 'Пароли не совпадают', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Ошибка', 'Пароль должен содержать минимум 6 символов', 'error');
                return;
            }
            
            if (!termsAccepted) {
                showNotification('Ошибка', 'Необходимо согласиться с условиями', 'error');
                return;
            }
            
            const existingUser = demoUsers.find(u => u.username === username || u.email === email);
            if (existingUser) {
                showNotification('Ошибка', 'Пользователь с таким именем или email уже существует', 'error');
                return;
            }
            
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';
            submitBtn.disabled = true;
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const newUser = {
                username: username,
                email: email,
                password: password,
                avatar: username.charAt(0).toUpperCase(),
                regDate: new Date().toLocaleDateString('ru-RU'),
                messages: 0,
                reactions: 0,
                topics: 0,
                replies: 0,
                status: 'Online',
                loginCount: 1,
                lastLogin: new Date().toLocaleString(),
                userId: '#' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                isAdmin: false
            };
            
            demoUsers.push(newUser);
            completeLogin(newUser, true);
            
            const registerModal = document.getElementById('registerModal');
            if (registerModal) registerModal.classList.remove('active');
            registerForm.reset();
            
            showNotification('Регистрация успешна', `Добро пожаловать, ${username}!`, 'success');
            
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
}

function updateUserUI() {
    const userControls = document.getElementById('user-controls');
    const authBtn = document.getElementById('authBtn');
    
    if (!userControls) return;
    
    if (isLoggedIn && currentUser) {
        if (authBtn) authBtn.style.display = 'none';
        
        userControls.innerHTML = `
            <div class="user-info" id="userAvatarBtn">
                <div class="user-avatar ${currentUser.avatarImage ? 'avatar-with-image' : ''}" 
                     style="${currentUser.avatarImage ? `background-image: url('${currentUser.avatarImage}')` : ''}">
                    ${currentUser.avatarImage ? '' : currentUser.avatar}
                </div>
                <span>${currentUser.username}</span>
            </div>
        `;
        
        const dropdownUsername = document.getElementById('dropdownUsername');
        const dropdownEmail = document.getElementById('dropdownEmail');
        if (dropdownUsername) dropdownUsername.textContent = currentUser.username;
        if (dropdownEmail) dropdownEmail.textContent = currentUser.email;
        
        const userAvatarBtn = document.getElementById('userAvatarBtn');
        if (userAvatarBtn) {
            userAvatarBtn.addEventListener('click', () => {
                const profileDropdown = document.getElementById('profileDropdown');
                if (profileDropdown) profileDropdown.classList.toggle('active');
            });
        }
        
        initProfileMenuHandlers();
        
    } else {
        if (authBtn) authBtn.style.display = 'block';
        userControls.innerHTML = '<button class="auth-btn" id="authBtn">Sign In</button>';
        
        const newAuthBtn = document.getElementById('authBtn');
        if (newAuthBtn) {
            newAuthBtn.addEventListener('click', () => {
                const loginModal = document.getElementById('loginModal');
                if (loginModal) loginModal.classList.add('active');
            });
        }
        
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileDropdown) profileDropdown.classList.remove('active');
    }
}

function logout() {
    if (currentUser) {
        saveUserData(currentUser.username, currentUser);
    }
    
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    updateUserUI();
    showPage('home');
    showNotification('Выход выполнен', 'Вы успешно вышли из системы', 'success');
}

function completeLogin(user, rememberMe) {
    isLoggedIn = true;
    
    const savedUserData = loadUserData(user.username);
    if (savedUserData) {
        currentUser = { ...savedUserData };
        currentUser.password = user.password;
    } else {
        currentUser = { ...user };
    }
    
    currentUser.loginCount = (currentUser.loginCount || 0) + 1;
    currentUser.lastLogin = new Date().toLocaleString();
    currentUser.status = 'Online';
    
    // Сохраняем аккаунт в список
    saveAccount(currentUser);
    
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
    
    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    updateUserUI();
    
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.classList.remove('active');
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    
    updateProfileData();
    loadSettings();
    
    showNotification('Вход выполнен', `Добро пожаловать, ${user.username}!`, 'success');
}

function initProfileMenuHandlers() {
    const profileLink = document.getElementById('profileLink');
    const settingsLink = document.getElementById('settingsLink');
    const switchAccountLink = document.getElementById('switchAccountLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (profileLink) {
        profileLink.replaceWith(profileLink.cloneNode(true));
        document.getElementById('profileLink').addEventListener('click', (e) => {
            e.preventDefault();
            showPage('profile');
        });
    }
    
    if (settingsLink) {
        settingsLink.replaceWith(settingsLink.cloneNode(true));
        document.getElementById('settingsLink').addEventListener('click', (e) => {
            e.preventDefault();
            showPage('settings');
        });
    }
    
    if (switchAccountLink) {
        switchAccountLink.replaceWith(switchAccountLink.cloneNode(true));
        document.getElementById('switchAccountLink').addEventListener('click', (e) => {
            e.preventDefault();
            loadAccountsList();
            const switchAccountModal = document.getElementById('switchAccountModal');
            if (switchAccountModal) switchAccountModal.classList.add('active');
        });
    }
    
    if (logoutLink) {
        logoutLink.replaceWith(logoutLink.cloneNode(true));
        document.getElementById('logoutLink').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}