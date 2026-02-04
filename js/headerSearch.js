// ============================================
// ПОИСК ПОЛЬЗОВАТЕЛЕЙ В ХЕДЕРЕ
// ============================================

let searchTimeout;
let isDropdownOpen = false;

function initHeaderUserSearch() {
    const searchInput = document.getElementById('headerUserSearch');
    const dropdown = document.getElementById('searchResultsDropdown');
    
    if (searchInput && dropdown) {
        searchInput.addEventListener('input', handleHeaderSearchInput);
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2) {
                dropdown.classList.add('show');
                isDropdownOpen = true;
            }
        });
        
        // Закрытие dropdown при клике вне его
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
                isDropdownOpen = false;
            }
        });
        
        // Обработка клавиш
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.classList.remove('show');
                isDropdownOpen = false;
                searchInput.blur();
            }
        });
    }
}

function handleHeaderSearchInput() {
    const query = document.getElementById('headerUserSearch').value.trim();
    const dropdown = document.getElementById('searchResultsDropdown');
    
    // Очищаем предыдущий таймаут
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Если запрос пустой или меньше 2 символов, скрываем dropdown
    if (query.length < 2) {
        dropdown.classList.remove('show');
        isDropdownOpen = false;
        return;
    }
    
    // Устанавливаем новый таймаут для поиска
    searchTimeout = setTimeout(() => {
        performHeaderUserSearch();
    }, 300);
}

async function performHeaderUserSearch() {
    const query = document.getElementById('headerUserSearch').value.trim();
    const dropdown = document.getElementById('searchResultsDropdown');
    
    if (query.length < 2) {
        dropdown.classList.remove('show');
        isDropdownOpen = false;
        return;
    }
    
    // Показываем индикатор загрузки
    showHeaderSearchLoading();
    dropdown.classList.add('show');
    isDropdownOpen = true;
    
    try {
        const response = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (response.ok) {
            displayHeaderSearchResults(data.users);
        } else {
            showHeaderSearchError('Ошибка при поиске пользователей');
        }
    } catch (error) {
        console.error('Search error:', error);
        // Fallback к локальному поиску если сервер недоступен
        performLocalUserSearch(query);
    }
}

function performLocalUserSearch(query) {
    const searchQuery = query.toLowerCase();
    const results = demoUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery)
    ).slice(0, 5);
    
    displayHeaderSearchResults(results);
}

function displayHeaderSearchResults(users) {
    const dropdown = document.getElementById('searchResultsDropdown');
    
    if (users.length === 0) {
        showHeaderNoResults();
        return;
    }
    
    const resultsHTML = users.map(user => createHeaderUserResultHTML(user)).join('');
    dropdown.innerHTML = resultsHTML;
    
    // Добавляем обработчики кликов
    const userResults = dropdown.querySelectorAll('.dropdown-user-result');
    userResults.forEach(result => {
        result.addEventListener('click', () => {
            const username = result.dataset.username;
            handleUserClick(username);
        });
    });
}

function createHeaderUserResultHTML(user) {
    const avatarClass = user.avatarImage ? 'avatar-with-image' : '';
    const avatarStyle = user.avatarImage ? `style="background-image: url('${user.avatarImage}')"` : '';
    const statusClass = user.status === 'Online' ? 'status-online' : 'status-offline';
    const adminBadge = user.isAdmin ? '<span class="dropdown-admin-badge">Admin</span>' : '';
    
    return `
        <div class="dropdown-user-result" data-username="${user.username}">
            <div class="dropdown-user-avatar ${avatarClass}" ${avatarStyle}>
                ${user.avatarImage ? '' : user.avatar}
            </div>
            <div class="dropdown-user-info">
                <div class="dropdown-user-name">
                    ${user.username}
                    ${adminBadge}
                </div>
                <div class="dropdown-user-status">
                    <i class="fas fa-circle ${statusClass}"></i>
                    ${user.status}
                </div>
            </div>
        </div>
    `;
}

function showHeaderSearchLoading() {
    const dropdown = document.getElementById('searchResultsDropdown');
    dropdown.innerHTML = `
        <div class="dropdown-loading">
            <div class="loader"></div>
            <p>Поиск пользователей...</p>
        </div>
    `;
}

function showHeaderNoResults() {
    const dropdown = document.getElementById('searchResultsDropdown');
    dropdown.innerHTML = `
        <div class="dropdown-no-results">
            <i class="fas fa-user-slash"></i>
            <p>Пользователи не найдены</p>
        </div>
    `;
}

function showHeaderSearchError(message) {
    const dropdown = document.getElementById('searchResultsDropdown');
    dropdown.innerHTML = `
        <div class="dropdown-no-results">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
}

function handleUserClick(username) {
    const dropdown = document.getElementById('searchResultsDropdown');
    const searchInput = document.getElementById('headerUserSearch');
    
    // Закрываем dropdown
    dropdown.classList.remove('show');
    isDropdownOpen = false;
    
    // Очищаем поисковую строку
    searchInput.value = '';
    
    // Переходим к профилю пользователя
    viewUserProfile(username);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initHeaderUserSearch();
});