// ============================================
// СИСТЕМА ПОДАЧИ ТИКЕТОВ
// ============================================

// Шаблоны для быстрого заполнения
const ticketTemplates = {
    login: {
        category: 'account',
        priority: 'high',
        title: 'Не могу войти в аккаунт',
        description: 'При попытке входа в аккаунт возникает ошибка. Пожалуйста, укажите:\n\n1. Какую ошибку вы видите?\n2. Помните ли вы свой пароль?\n3. Пробовали ли восстановление пароля?\n4. Когда последний раз успешно входили в аккаунт?'
    },
    role: {
        category: 'role_request',
        priority: 'low',
        title: 'Запрос на получение должности',
        description: 'Хочу подать заявку на получение должности. Пожалуйста, укажите:\n\n1. На какую должность претендуете?\n2. Ваш опыт в администрировании/модерации\n3. Почему хотите получить эту должность?\n4. Сколько времени готовы уделять работе?\n5. Ваш возраст и часовой пояс'
    },
    profile: {
        category: 'profile',
        priority: 'medium',
        title: 'Проблемы с настройками профиля',
        description: 'Возникли проблемы с профилем. Пожалуйста, укажите:\n\n1. Что именно не работает?\n2. Какие действия вы предпринимали?\n3. Появляются ли сообщения об ошибках?\n4. В каком браузере происходит проблема?'
    },
    bug: {
        category: 'bug_report',
        priority: 'medium',
        title: 'Обнаружена ошибка на сайте',
        description: 'Обнаружил ошибку на сайте. Детали:\n\n1. Где произошла ошибка (страница, функция)?\n2. Что вы делали когда произошла ошибка?\n3. Какой результат ожидали?\n4. Что произошло вместо этого?\n5. Браузер и операционная система\n6. Можете ли воспроизвести ошибку?'
    }
};

// Функция использования шаблона
function useTemplate(templateKey) {
    const template = ticketTemplates[templateKey];
    if (!template) return;
    
    document.getElementById('ticketCategory').value = template.category;
    document.getElementById('ticketPriority').value = template.priority;
    document.getElementById('ticketTitle').value = template.title;
    document.getElementById('ticketDescription').value = template.description;
    
    showNotification('Шаблон применен', 'Форма заполнена шаблоном. Отредактируйте данные под вашу ситуацию', 'info');
}

// Функция очистки формы
function clearTicketForm() {
    document.getElementById('ticketForm').reset();
    showNotification('Форма очищена', 'Все поля формы очищены', 'info');
}

// Функция отправки тикета
function submitTicket(event) {
    event.preventDefault();
    
    if (!isLoggedIn) {
        showNotification('Требуется авторизация', 'Войдите в систему для подачи тикета', 'warning');
        return;
    }
    
    const category = document.getElementById('ticketCategory').value;
    const priority = document.getElementById('ticketPriority').value;
    const title = document.getElementById('ticketTitle').value.trim();
    const description = document.getElementById('ticketDescription').value.trim();
    
    if (!category || !priority || !title || !description) {
        showNotification('Ошибка', 'Заполните все обязательные поля', 'error');
        return;
    }
    
    if (title.length < 10) {
        showNotification('Ошибка', 'Заголовок должен содержать минимум 10 символов', 'error');
        return;
    }
    
    if (description.length < 20) {
        showNotification('Ошибка', 'Описание должно содержать минимум 20 символов', 'error');
        return;
    }
    
    // Создаем новый тикет
    const newTicket = {
        id: Date.now(),
        title: title,
        description: description,
        user: currentUser.username,
        status: 'pending',
        priority: priority,
        category: category,
        created: new Date().toLocaleString(),
        updated: new Date().toLocaleString(),
        assignee: null
    };
    
    // Добавляем в демо-тикеты (в реальном приложении отправили бы на сервер)
    demoTickets.unshift(newTicket);
    
    // Очищаем форму
    document.getElementById('ticketForm').reset();
    
    showNotification('Тикет отправлен', `Ваш тикет #${newTicket.id} успешно создан и передан в техническую поддержку`, 'success');
    
    // Показываем информацию о времени ответа
    setTimeout(() => {
        showNotification('Информация', 'Среднее время ответа: 2-4 часа. Вы получите уведомление при обновлении статуса', 'info');
    }, 2000);
}

// Инициализация формы подачи тикетов
function initTicketForm() {
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', submitTicket);
    }
    
    // Проверка авторизации при загрузке страницы
    if (!isLoggedIn) {
        const container = document.querySelector('#tickets-page .ticket-form-container');
        if (container) {
            container.innerHTML = `
                <div class="auth-required">
                    <i class="fas fa-lock"></i>
                    <h3>Требуется авторизация</h3>
                    <p>Для подачи тикета в техническую поддержку необходимо войти в систему</p>
                    <button class="btn" onclick="document.getElementById('loginModal').classList.add('active')">
                        <i class="fas fa-sign-in-alt"></i> Войти в систему
                    </button>
                </div>
            `;
        }
    }
}