// ============================================
// ПРОСМОТР ПРОФИЛЕЙ ПОЛЬЗОВАТЕЛЕЙ
// ============================================

function viewUserProfile(username) {
    // Находим пользователя
    let user = demoUsers.find(u => u.username === username);
    
    // Загружаем сохраненные данные пользователя
    const savedUserData = loadUserData(username);
    if (savedUserData) {
        user = savedUserData;
    } else if (!user) {
        // Создаем временного пользователя если не найден
        user = {
            username: username,
            avatar: username.charAt(0).toUpperCase(),
            regDate: 'Неизвестно',
            messages: Math.floor(Math.random() * 50),
            reactions: Math.floor(Math.random() * 100),
            topics: Math.floor(Math.random() * 20),
            replies: Math.floor(Math.random() * 50),
            status: 'Offline',
            isAdmin: username === 'GRAVEBIRTH',
            email: `${username.toLowerCase()}@example.com`
        };
    }
    
    // Сохраняем данные просматриваемого пользователя
    window.viewedUser = user;
    
    // Обновляем элементы профиля
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
        'infoRole': document.getElementById('infoRole')
    };
    
    for (const [id, element] of Object.entries(elements)) {
        if (!element) continue;
        
        switch(id) {
            case 'profileAvatar':
                element.className = `profile-avatar ${user.avatarImage ? 'avatar-with-image' : ''}`;
                element.textContent = user.avatarImage ? '' : (user.avatar || user.username.charAt(0).toUpperCase());
                element.style.backgroundImage = user.avatarImage ? `url('${user.avatarImage}')` : '';
                break;
            case 'profileUsername':
            case 'infoUsername':
                element.textContent = user.username;
                break;
            case 'profileRole':
                element.textContent = user.isAdmin ? 'DEVELOPER HOST MANAGER' : '';
                break;
            case 'profileRegDate':
                element.textContent = user.regDate || 'Неизвестно';
                break;
            case 'profileStatus':
                element.textContent = user.status || 'Offline';
                break;
            case 'profileMessages':
                element.textContent = user.messages || 0;
                break;
            case 'profileReactions':
                element.textContent = user.reactions || 0;
                break;
            case 'profileTopics':
                element.textContent = user.topics || 0;
                break;
            case 'profileReplies':
                element.textContent = user.replies || 0;
                break;
            case 'infoEmail':
                element.textContent = user.email || `${user.username.toLowerCase()}@example.com`;
                break;
            case 'infoRole':
                element.textContent = user.isAdmin ? 'Administrator' : 'Member';
                break;
        }
    }
    
    // Загружаем посты пользователя
    loadUserPostsForProfile(username);
    
    // Скрываем форму создания поста если это не текущий пользователь
    const postForm = document.querySelector('.post-form');
    if (postForm) {
        postForm.style.display = (currentUser && currentUser.username === username) ? 'block' : 'none';
    }
    
    // Показываем профиль
    document.querySelectorAll('.main-content, .page-content, .profile-page').forEach(el => {
        el.style.display = 'none';
    });
    document.getElementById('profile-page').style.display = 'block';
}

function loadUserPostsForProfile(username) {
    const postsContainer = document.getElementById('postsContainer');
    const noPostsMessage = document.getElementById('noPostsMessage');
    
    if (!postsContainer) return;
    
    postsContainer.innerHTML = '';
    
    // Фильтруем посты для конкретного пользователя
    const userSpecificPosts = userPosts.filter(post => post.author === username);
    
    if (userSpecificPosts.length === 0) {
        if (noPostsMessage) {
            postsContainer.appendChild(noPostsMessage);
            noPostsMessage.style.display = 'block';
        }
        return;
    }
    
    if (noPostsMessage) noPostsMessage.style.display = 'none';
    
    userSpecificPosts.forEach((postData) => {
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
                ${currentUser && currentUser.username === postData.author ? 
                    `<button class="delete-post-btn" onclick="deletePost(this)" title="Удалить сообщение">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
            </div>
            <div class="post-content">
                ${postData.content}
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}