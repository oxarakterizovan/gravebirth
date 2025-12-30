// ============================================
// ФУНКЦИОНАЛ ФОРУМА
// ============================================

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
        'item-core': 'gem',
        'item-support': 'ring',
        questions: 'question-circle'
    };
    return icons[category] || 'comment';
}

function getCategoryName(category) {
    const names = {
        team: 'Team composition',
        core: 'Core',
        support: 'Support',
        'item-core': 'Item core',
        'item-support': 'Item Support',
        questions: 'Questions'
    };
    return names[category] || category;
}

function openTopic(category, title) {
    let topic = userTopics.find(t => t.title === title);
    
    // Если не нашли в пользовательских темах, ищем в демо-темах
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
    
    // Увеличиваем просмотры только для пользовательских тем
    const userTopicIndex = userTopics.findIndex(t => t.title === title);
    if (userTopicIndex !== -1) {
        userTopics[userTopicIndex].views++;
        localStorage.setItem('userTopics', JSON.stringify(userTopics));
    }
    
    const modal = document.getElementById('topicModal');
    const titleEl = document.getElementById('viewTopicTitle');
    const categoryEl = document.getElementById('viewTopicCategory');
    const authorEl = document.getElementById('viewTopicAuthor');
    const dateEl = document.getElementById('viewTopicDate');
    const contentEl = document.getElementById('topicContentContainer');
    
    if (titleEl) titleEl.textContent = topic.title;
    if (categoryEl) categoryEl.textContent = getCategoryName(topic.category);
    if (authorEl) authorEl.textContent = `By: ${topic.author}`;
    if (dateEl) dateEl.textContent = topic.date;
    
    if (contentEl) {
        let tagsHtml = '';
        if (topic.tags && topic.tags.length > 0) {
            tagsHtml = `
                <div class="topic-tags" style="margin-top: 15px;">
                    <strong>Тэги:</strong>
                    ${topic.tags.map(tag => `<span class="topic-tag">${tag}</span>`).join('')}
                </div>
            `;
        }
        
        contentEl.innerHTML = `
            <div class="topic-content-text">
                ${topic.content.replace(/\n/g, '<br>')}
            </div>
            ${tagsHtml}
        `;
    }
    
    modal.classList.add('active');
    loadForumTopics();
}

function loadForumTopics(filter = 'recent') {
    const topicsContainer = document.getElementById('topicsContainer');
    if (!topicsContainer) return;
    
    let topics = [];
    
    // Добавляем демо-темы из gameItems
    Object.keys(gameItems).forEach(category => {
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
    
    // Добавляем пользовательские темы
    if (userTopics.length > 0) {
        topics = topics.concat(userTopics);
    }
    
    if (topics.length === 0) {
        topicsContainer.innerHTML = '<div class="no-topics"><i class="fas fa-comments"></i><h3>No topics found</h3><p>Be the first to create a topic!</p></div>';
        return;
    }
    
    topicsContainer.innerHTML = topics.map(topic => `
        <div class="topic-row" onclick="openTopic('${topic.category}', '${topic.title}')" style="cursor: pointer;">
            <div class="topic-icon">
                <i class="fas fa-${getCategoryIcon(topic.category)}"></i>
            </div>
            <div class="topic-info">
                <h4>${topic.title}</h4>
                <div class="topic-meta-small">
                    <span><i class="fas fa-user"></i> ${topic.author}</span>
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
                <span class="status-badge status-new">New</span>
            </div>
        </div>
    `).join('');
}

function initForum() {
    const createTopicBtn = document.getElementById('createTopicBtn');
    const createTopicModal = document.getElementById('createTopicModal');
    const closeTopicModal = document.getElementById('closeTopicModal');
    const cancelTopicBtn = document.getElementById('cancelTopic');
    const createTopicForm = document.getElementById('createTopicForm');
    
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
    
    // Обработчик тэгов
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
    
    // Обработчик создания темы
    if (createTopicForm) {
        createTopicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const category = document.getElementById('topicCategory').value;
            const title = document.getElementById('topicTitle').value;
            const content = document.getElementById('topicContent').value;
            const selectedTags = Array.from(document.querySelectorAll('.tag-option.selected')).map(tag => tag.textContent);
            
            if (!category || !title || !content) {
                showNotification('Ошибка', 'Заполните все обязательные поля', 'error');
                return;
            }
            
            const newTopic = {
                id: Date.now(),
                category: category,
                title: title,
                content: content,
                author: currentUser.username,
                date: new Date().toLocaleString(),
                views: 0,
                replies: 0,
                tags: selectedTags
            };
            
            userTopics.push(newTopic);
            localStorage.setItem('userTopics', JSON.stringify(userTopics));
            
            createTopicModal.classList.remove('active');
            createTopicForm.reset();
            document.querySelectorAll('.tag-option.selected').forEach(tag => tag.classList.remove('selected'));
            
            loadForumTopics();
            updateForumStats();
            
            showNotification('Тема создана', `Тема "${title}" успешно создана`, 'success');
        });
    }
    
    const forumTabs = document.querySelectorAll('.forum-tab');
    forumTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-tab');
            
            forumTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            loadForumTopics(filter);
        });
    });
    
    // Обработчик закрытия модального окна просмотра темы
    const closeViewTopicModal = document.getElementById('closeViewTopicModal');
    const topicModal = document.getElementById('topicModal');
    
    if (closeViewTopicModal && topicModal) {
        closeViewTopicModal.addEventListener('click', () => {
            topicModal.classList.remove('active');
        });
    }
    
    loadForumTopics();
    updateForumStats();
}