// Переменная для отслеживания текущей категории
let currentTopicCategory = null;

function updateForumStats() {
    let totalTopics = 0;
    Object.keys(gameItems).forEach(category => {
        totalTopics += gameItems[category].length;
    });
    forumStats.activeTopics = totalTopics;
    forumStats.communityMembers += Math.floor(Math.random() * 3);
    forumStats.totalReplies += Math.floor(Math.random() * 8) + 2;
    forumStats.hotTopics = Math.floor(totalTopics * 0.3) + Math.floor(Math.random() * 5);
    
    const activeTopicsEl = document.getElementById('activeTopicsCount');
    const membersEl = document.getElementById('communityMembersCount');
    const repliesEl = document.getElementById('totalRepliesCount');
    const hotTopicsEl = document.getElementById('hotTopicsCount');
    
    if (activeTopicsEl) activeTopicsEl.textContent = forumStats.activeTopics;
    if (membersEl) membersEl.textContent = forumStats.communityMembers;
    if (repliesEl) repliesEl.textContent = forumStats.totalReplies;
    if (hotTopicsEl) hotTopicsEl.textContent = forumStats.hotTopics;
}

function getCategoryIcon(category) {
    const icons = {
        team: 'users',
        core: 'fire',
        support: 'shield-alt',
        'character-builds': 'gem',
        'item-builds': 'ring',
        questions: 'question-circle'
    };
    return icons[category] || 'comment';
}

function getCategoryName(category) {
    const names = {
        team: 'Team composition',
        core: 'Core',
        support: 'Support',
        'character-builds': 'Character Builds',
        'item-builds': 'Item Builds',
        questions: 'Questions'
    };
    return names[category] || category;
}

function openTopic(category, title) {
    // Сохраняем текущую категорию
    currentTopicCategory = category;
    
    // Показываем/скрываем кнопку Back to category
    const backToCategoryBtn = document.getElementById('backToCategoryBtn');
    if (backToCategoryBtn) {
        backToCategoryBtn.style.display = 'block';
    }
    
    let topic = userTopics.find(t => t.title === title);
    
    if (!topic && gameItems[category]) {
        const demoTopic = gameItems[category].find(item => item.title === title);
        if (demoTopic) {
            topic = {
                ...demoTopic,
                category: category,
                tags: []
            };
        }
    }
    
    if (!topic) {
        showNotification('Тема не найдена', 'Выбранная тема не существует', 'error');
        return;
    }
    
    const userTopicIndex = userTopics.findIndex(t => t.title === title);
    if (userTopicIndex !== -1) {
        userTopics[userTopicIndex].views++;
        localStorage.setItem('userTopics', JSON.stringify(userTopics));
    }
    
    let authorData = demoUsers.find(u => u.username === topic.author);
    
    // Загружаем сохраненные данные автора
    const savedAuthorData = loadUserData(topic.author);
    if (savedAuthorData) {
        authorData = savedAuthorData;
    } else if (!authorData) {
        authorData = {
            username: topic.author,
            avatar: topic.author.charAt(0).toUpperCase(),
            reactions: Math.floor(Math.random() * 100) + 10,
            topics: Math.floor(Math.random() * 20) + 1,
            isAdmin: topic.author === 'GRAVEBIRTH'
        };
    }
    
    document.getElementById('topicAuthorAvatar').className = `author-avatar ${authorData.avatarImage ? 'avatar-with-image' : ''}`;
    document.getElementById('topicAuthorAvatar').textContent = authorData.avatarImage ? '' : (authorData.avatar || authorData.username.charAt(0).toUpperCase());
    document.getElementById('topicAuthorAvatar').style.backgroundImage = authorData.avatarImage ? `url('${authorData.avatarImage}')` : '';
    document.getElementById('topicAuthorName').textContent = authorData.username;
    document.getElementById('topicAuthorName').onclick = () => viewUserProfile(authorData.username);
    document.getElementById('topicAuthorName').style.cursor = 'pointer';
    document.getElementById('topicAuthorRole').textContent = authorData.isAdmin ? 'Administrator' : 'Member';
    document.getElementById('topicAuthorReactions').textContent = authorData.reactions || 0;
    document.getElementById('topicAuthorTopics').textContent = authorData.topics || 0;
    document.getElementById('topicCreatedDate').textContent = topic.date;
    
    document.getElementById('topicViewCategory').textContent = getCategoryName(topic.category);
    document.getElementById('topicViewTitle').textContent = topic.title;
    
    let tagsHtml = '';
    if (topic.tags && topic.tags.length > 0) {
        tagsHtml = topic.tags.map(tag => `<span class="topic-tag">${tag}</span>`).join('');
    }
    document.getElementById('topicViewTags').innerHTML = tagsHtml;
    
    let content = topic.content
        .replace(/\\n/g, '\n')
        .replace(/\n/g, '<br>')
        .replace(/# (.*?)(<br>|$)/g, '<h1>$1</h1>')
        .replace(/## (.*?)(<br>|$)/g, '<h2>$1</h2>')
        .replace(/### (.*?)(<br>|$)/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/- (.*?)(<br>|$)/g, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    
    document.getElementById('topicViewContent').innerHTML = content;
    showPage('topic-view');
}

function loadForumTopics(filter = 'recent', selectedCategory = null) {
    const topicsContainer = document.getElementById('topicsContainer');
    if (!topicsContainer) return;
    
    let topics = [];
    
    Object.keys(gameItems).forEach(category => {
        if (selectedCategory && category !== selectedCategory) return;
        
        gameItems[category].forEach(item => {
            topics.push({
                id: `demo_${category}_${item.title}`,
                category: category,
                title: item.title,
                content: item.content,
                author: item.author,
                date: item.date,
                views: item.views,
                replies: item.replies,
                tags: []
            });
        });
    });
    
    if (userTopics.length > 0) {
        const filteredUserTopics = selectedCategory 
            ? userTopics.filter(topic => topic.category === selectedCategory)
            : userTopics;
        topics = topics.concat(filteredUserTopics);
    }
    
    // Фильтруем темы в зависимости от вкладки
    if (filter === 'popular') {
        topics = topics.filter(topic => topic.views > 200 || topic.replies > 10);
        topics.sort((a, b) => (b.views + b.replies * 5) - (a.views + a.replies * 5));
    } else if (filter === 'hot') {
        topics = topics.filter(topic => topic.replies > 3 && topic.replies <= 10 && topic.views > 50);
        topics.sort((a, b) => b.replies - a.replies);
    } else if (filter === 'unanswered') {
        topics = topics.filter(topic => topic.replies === 0);
    } else if (filter === 'my-topics') {
        topics = topics.filter(topic => currentUser && topic.author === currentUser.username);
    } else {
        // recent - сортируем по дате
        topics.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    if (topics.length === 0) {
        let message = 'No topics found';
        if (filter === 'popular') message = 'No popular topics found';
        else if (filter === 'hot') message = 'No hot topics found';
        else if (filter === 'unanswered') message = 'No unanswered topics found';
        else if (filter === 'my-topics') message = 'You haven\'t created any topics yet';
        else if (selectedCategory) message = `No topics found for ${getCategoryName(selectedCategory)}`;
        
        topicsContainer.innerHTML = `<div class="no-topics"><i class="fas fa-comments"></i><h3>${message}</h3><p>Be the first to create one!</p></div>`;
        return;
    }
    
    topicsContainer.innerHTML = topics.map(topic => {
        let statusBadge = 'status-new';
        let statusText = 'New';
        
        if (topic.replies === 0) {
            statusBadge = 'status-unanswered';
            statusText = 'No Replies';
        } else if (topic.views > 200 || topic.replies > 10) {
            statusBadge = 'status-popular';
            statusText = 'Popular';
        } else if (topic.replies > 5) {
            statusBadge = 'status-hot';
            statusText = 'Hot';
        }
        
        return `
        <div class="topic-row" 
             onclick="openTopic('${topic.category}', '${topic.title}')" 
             data-category="${topic.category}" 
             data-title="${topic.title}"
             style="cursor: pointer;">
            <div class="topic-icon">
                <i class="fas fa-${getCategoryIcon(topic.category)}"></i>
            </div>
            <div class="topic-info">
                <h4>${topic.title}</h4>
                <div class="topic-meta-small">
                    <span><i class="fas fa-user"></i> <span class="author-link" onclick="viewUserProfile('${topic.author}')" style="cursor: pointer; color: var(--text-primary);">${topic.author}</span></span>
                    <span><i class="fas fa-clock"></i> ${topic.date}</span>
                    <span><i class="fas fa-tag"></i> ${getCategoryName(topic.category)}</span>
                    ${topic.tags && topic.tags.length > 0 ? `<span><i class="fas fa-tags"></i> ${topic.tags.join(', ')}</span>` : ''}
                </div>
            </div>
            <div class="topic-stats">
                <div class="stat">
                    <span class="stat-value">${topic.views}</span>
                    <span class="stat-label">Views</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${topic.replies}</span>
                    <span class="stat-label">Replies</span>
                </div>
            </div>
            <div class="topic-status">
                <span class="status-badge ${statusBadge}">${statusText}</span>
            </div>
        </div>
        `;
    }).join('');
}

function initForum() {
    const createTopicBtn = document.getElementById('createTopicBtn');
    const createTopicModal = document.getElementById('createTopicModal');
    const closeTopicModal = document.getElementById('closeTopicModal');
    const cancelTopicBtn = document.getElementById('cancelTopic');
    const createTopicForm = document.getElementById('createTopicForm');
    
    // Добавляем обработчики для карточек категорий
    const categoryCards = document.querySelectorAll('.category-view-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            if (category) {
                filterByCategory(category);
            }
        });
    });
    
    // Обработчики для боковой панели категорий на странице категорий
    const categorySidebarItems = document.querySelectorAll('#category-page .sidebar-category');
    categorySidebarItems.forEach(category => {
        category.addEventListener('click', () => {
            const categoryId = category.getAttribute('data-category');
            if (categoryId) {
                filterByCategory(categoryId);
            }
        });
    });
    
    // Обработчики для вкладок форума
    const forumTabs = document.querySelectorAll('.forum-tab');
    forumTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.getAttribute('data-tab');
            switchForumTab(tabType);
        });
    });
    
    if (createTopicBtn) {
        createTopicBtn.addEventListener('click', () => {
            if (!isLoggedIn) {
                showNotification('Требуется вход', 'Пожалуйста, войдите в систему для создания тем', 'warning');
                const loginModal = document.getElementById('loginModal');
                if (loginModal) loginModal.classList.add('active');
                return;
            }
            if (createTopicModal) createTopicModal.classList.add('active');
        });
    }
    
    if (closeTopicModal) {
        closeTopicModal.addEventListener('click', () => {
            if (createTopicModal) createTopicModal.classList.remove('active');
        });
    }
    
    if (cancelTopicBtn) {
        cancelTopicBtn.addEventListener('click', () => {
            if (createTopicModal) createTopicModal.classList.remove('active');
        });
    }
    
    const tagOptions = document.querySelectorAll('.tag-option');
    tagOptions.forEach(tag => {
        tag.addEventListener('click', () => {
            const selectedTags = document.querySelectorAll('.tag-option.selected');
            if (tag.classList.contains('selected')) {
                tag.classList.remove('selected');
            } else if (selectedTags.length < 5) {
                tag.classList.add('selected');
            } else {
                showNotification('Максимум тэгов', 'Можно выбрать максимум 5 тэгов', 'warning');
            }
        });
    });
    
    if (createTopicForm) {
        createTopicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const category = document.getElementById('topicCategory').value;
            const title = document.getElementById('topicTitle').value;
            const content = document.getElementById('topicContent').value;
            
            if (!category || !title || !content) {
                showNotification('Ошибка', 'Заполните все обязательные поля', 'error');
                return;
            }
            
            const selectedTags = Array.from(document.querySelectorAll('.tag-option.selected'))
                .map(tag => tag.getAttribute('data-value'));
            
            const newTopic = {
                id: Date.now().toString(),
                category: category,
                title: title,
                content: content,
                author: currentUser.username,
                date: new Date().toLocaleDateString('ru-RU'),
                views: 0,
                replies: 0,
                tags: selectedTags
            };
            
            userTopics.push(newTopic);
            localStorage.setItem('userTopics', JSON.stringify(userTopics));
            
            if (createTopicModal) createTopicModal.classList.remove('active');
            createTopicForm.reset();
            document.querySelectorAll('.tag-option.selected').forEach(tag => {
                tag.classList.remove('selected');
            });
            
            showNotification('Успех', 'Тема успешно создана!', 'success');
            loadForumTopics();
            updateForumStats();
        });
    }
    
    loadForumTopics();
    updateForumStats();
}

function filterByCategory(category) {
    // Сохраняем текущую категорию
    currentTopicCategory = category;
    
    // Переходим на отдельную страницу категорий
    showPage('category');
    
    // Обновляем заголовок страницы
    const pageTitle = document.getElementById('categoryPageTitle');
    if (pageTitle) {
        pageTitle.textContent = getCategoryName(category);
    }
    
    // Обновляем активную категорию в боковой панели
    document.querySelectorAll('#category-page .sidebar-category').forEach(cat => {
        cat.classList.remove('active');
    });
    const activeCategory = document.querySelector(`#category-page [data-category="${category}"]`);
    if (activeCategory) {
        activeCategory.classList.add('active');
    }
    
    // Загружаем темы для выбранной категории
    loadCategoryTopics(category);
}

function showAllTopics() {
    // Восстанавливаем заголовок
    const pageHeader = document.querySelector('#forum-page .page-header h2');
    if (pageHeader) {
        pageHeader.textContent = 'Community Forum';
    }
    
    // Скрываем кнопку "Показать все"
    const backButton = document.getElementById('showAllTopicsBtn');
    if (backButton) {
        backButton.style.display = 'none';
    }
    
    // Переключаемся на вкладку Recent Topics
    switchForumTab('recent');
}

function switchForumTab(tabType) {
    // Обновляем активную вкладку
    document.querySelectorAll('.forum-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabType}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    const forumSidebar = document.getElementById('forumSidebar');
    const topicsContainer = document.getElementById('topicsContainer');
    const categoriesMainView = document.getElementById('categoriesMainView');
    
    if (tabType === 'categories') {
        // Показываем боковую панель и темы
        forumSidebar.style.display = 'block';
        topicsContainer.style.display = 'block';
        categoriesMainView.style.display = 'none';
        // По умолчанию показываем первую категорию
        const firstCategory = document.querySelector('.sidebar-category');
        if (firstCategory) {
            const categoryId = firstCategory.getAttribute('data-category');
            loadForumTopics('recent', categoryId);
            firstCategory.classList.add('active');
        }
    } else {
        // Скрываем боковую панель и показываем темы
        forumSidebar.style.display = 'none';
        topicsContainer.style.display = 'block';
        categoriesMainView.style.display = 'none';
        loadForumTopics(tabType);
    }
}

function loadCategoryTopics(category, searchQuery = '') {
    const container = document.getElementById('categoryTopicsContainer');
    if (!container) return;
    
    let topics = [];
    
    // Загружаем темы только для выбранной категории
    if (gameItems[category]) {
        gameItems[category].forEach(item => {
            topics.push({
                id: `demo_${category}_${item.title}`,
                category: category,
                title: item.title,
                content: item.content,
                author: item.author,
                date: item.date,
                views: item.views,
                replies: item.replies,
                tags: []
            });
        });
    }
    
    // Добавляем пользовательские темы этой категории
    if (userTopics.length > 0) {
        const filteredUserTopics = userTopics.filter(topic => topic.category === category);
        topics = topics.concat(filteredUserTopics);
    }
    
    // Фильтруем по поисковому запросу
    if (searchQuery) {
        topics = topics.filter(topic => 
            topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (topics.length === 0) {
        const message = searchQuery ? 
            `<div class="no-topics"><i class="fas fa-search"></i><h3>No results found</h3><p>No topics found for "${searchQuery}" in ${getCategoryName(category)}.</p></div>` :
            `<div class="no-topics"><i class="fas fa-comments"></i><h3>No topics found</h3><p>No topics found in ${getCategoryName(category)}. Be the first to create one!</p></div>`;
        container.innerHTML = message;
        return;
    }
    
    container.innerHTML = topics.map(topic => {
        let statusBadge = 'status-new';
        let statusText = 'New';
        
        if (topic.replies === 0) {
            statusBadge = 'status-unanswered';
            statusText = 'No Replies';
        } else if (topic.views > 200 || topic.replies > 10) {
            statusBadge = 'status-popular';
            statusText = 'Popular';
        } else if (topic.replies > 5) {
            statusBadge = 'status-hot';
            statusText = 'Hot';
        }
        
        return `
        <div class="topic-row" 
             onclick="openTopic('${topic.category}', '${topic.title}')" 
             data-category="${topic.category}" 
             data-title="${topic.title}"
             style="cursor: pointer;">
            <div class="topic-icon">
                <i class="fas fa-${getCategoryIcon(topic.category)}"></i>
            </div>
            <div class="topic-info">
                <h4>${topic.title}</h4>
                <div class="topic-meta-small">
                    <span><i class="fas fa-user"></i> <span class="author-link" onclick="viewUserProfile('${topic.author}')" style="cursor: pointer; color: var(--text-primary);">${topic.author}</span></span>
                    <span><i class="fas fa-clock"></i> ${topic.date}</span>
                    <span><i class="fas fa-tag"></i> ${getCategoryName(topic.category)}</span>
                    ${topic.tags && topic.tags.length > 0 ? `<span><i class="fas fa-tags"></i> ${topic.tags.join(', ')}</span>` : ''}
                </div>
            </div>
            <div class="topic-stats">
                <div class="stat">
                    <span class="stat-value">${topic.views}</span>
                    <span class="stat-label">Views</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${topic.replies}</span>
                    <span class="stat-label">Replies</span>
                </div>
            </div>
            <div class="topic-status">
                <span class="status-badge ${statusBadge}">${statusText}</span>
            </div>
        </div>
        `;
    }).join('');
}

// Добавляем обработчики для иконок категорий на странице категорий
document.addEventListener('DOMContentLoaded', function() {
    // Обработчики для иконок в боковом меню на странице категорий
    document.querySelectorAll('#category-page .sidebar-category').forEach(category => {
        category.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-category');
            if (categoryId) {
                filterByCategory(categoryId);
            }
        });
    });
    
    // Обработчик поиска в категориях
    const categorySearchInput = document.getElementById('categorySearchInput');
    if (categorySearchInput) {
        categorySearchInput.addEventListener('input', function() {
            const searchQuery = this.value;
            const activeCategory = document.querySelector('#category-page .sidebar-category.active');
            if (activeCategory) {
                const categoryId = activeCategory.getAttribute('data-category');
                loadCategoryTopics(categoryId, searchQuery);
            }
        });
    }
});

// Функция для возврата к категории
function backToCategory() {
    if (currentTopicCategory) {
        filterByCategory(currentTopicCategory);
    } else {
        showPage('forum');
    }
}

// Делаем функцию глобально доступной
window.backToCategory = backToCategory;