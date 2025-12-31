// ============================================
// СИСТЕМА ТЕХНИЧЕСКОЙ ПОДДЕРЖКИ
// ============================================

// Хранилище сообщений тикетов
let ticketMessages = {};

// Демо тикеты
const demoTickets = [
    {
        id: 1,
        title: 'Не могу войти в аккаунт',
        description: 'При попытке входа выдает ошибку "Неверный пароль", хотя пароль точно правильный',
        user: 'dev_user',
        status: 'pending',
        priority: 'high',
        category: 'account',
        created: new Date(Date.now() - 3600000).toLocaleString(),
        updated: new Date(Date.now() - 1800000).toLocaleString(),
        assignee: null
    },
    {
        id: 2,
        title: 'Проблема с загрузкой аватара',
        description: 'Не получается загрузить новый аватар, файл соответствует требованиям',
        user: 'TestUser',
        status: 'resolved',
        priority: 'medium',
        category: 'profile',
        created: new Date(Date.now() - 86400000).toLocaleString(),
        updated: new Date(Date.now() - 43200000).toLocaleString(),
        assignee: 'SupportHelper'
    },
    {
        id: 3,
        title: 'Форум работает медленно',
        description: 'Страницы форума загружаются очень долго, особенно с большим количеством тем',
        user: 'NewUser',
        status: 'pending',
        priority: 'low',
        category: 'performance',
        created: new Date(Date.now() - 7200000).toLocaleString(),
        updated: new Date(Date.now() - 3600000).toLocaleString(),
        assignee: 'TechAdmin'
    },
    {
        id: 4,
        title: 'Запрос на смену роли',
        description: 'Хочу стать модератором, имею опыт администрирования других форумов',
        user: 'ExperiencedUser',
        status: 'rejected',
        priority: 'low',
        category: 'role_request',
        created: new Date(Date.now() - 172800000).toLocaleString(),
        updated: new Date(Date.now() - 86400000).toLocaleString(),
        assignee: 'GRAVEBIRTH'
    }
];

// Функция отображения всех тикетов
function showAllTickets() {
    loadTickets(demoTickets);
}

// Функция отображения тикетов на рассмотрении
function showPendingTickets() {
    const pendingTickets = demoTickets.filter(ticket => ticket.status === 'pending');
    loadTickets(pendingTickets);
}

// Функция отображения активных чатов
function showActiveChats() {
    const activeTickets = demoTickets.filter(ticket => 
        ticket.status === 'pending' && 
        ticketMessages[ticket.id] && 
        ticketMessages[ticket.id].length > 1
    );
    loadTickets(activeTickets);
}

// Функция отображения решенных тикетов
function showResolvedTickets() {
    const resolvedTickets = demoTickets.filter(ticket => ticket.status === 'resolved');
    loadTickets(resolvedTickets);
}

// Функция отображения отказанных тикетов
function showRejectedTickets() {
    const rejectedTickets = demoTickets.filter(ticket => ticket.status === 'rejected');
    loadTickets(rejectedTickets);
}

// Функция загрузки тикетов в контейнер
function loadTickets(tickets) {
    const container = document.getElementById('ticketsContainer');
    if (!container) return;
    
    if (tickets.length === 0) {
        container.innerHTML = '<div class="no-tickets"><i class="fas fa-inbox"></i><h3>Нет тикетов</h3><p>Тикеты в данной категории отсутствуют</p></div>';
        return;
    }
    
    container.innerHTML = tickets.map(ticket => {
        const statusInfo = getTicketStatusInfo(ticket.status);
        const priorityInfo = getTicketPriorityInfo(ticket.priority);
        
        return `
            <div class="ticket-card" data-ticket-id="${ticket.id}">
                <div class="ticket-header">
                    <div class="ticket-id">#${ticket.id}</div>
                    <div class="ticket-status ${statusInfo.class}">${statusInfo.text}</div>
                    <div class="ticket-priority ${priorityInfo.class}">${priorityInfo.text}</div>
                </div>
                <div class="ticket-content">
                    <h4 class="ticket-title">${ticket.title}</h4>
                    <p class="ticket-description">${ticket.description}</p>
                    <div class="ticket-meta">
                        <span><i class="fas fa-user"></i> ${ticket.user}</span>
                        <span><i class="fas fa-clock"></i> ${ticket.created}</span>
                        ${ticket.assignee ? `<span><i class="fas fa-user-tie"></i> ${ticket.assignee}</span>` : ''}
                    </div>
                </div>
                <div class="ticket-actions">
                    ${generateTicketActions(ticket)}
                </div>
            </div>
        `;
    }).join('');
}

// Функция получения информации о статусе тикета
function getTicketStatusInfo(status) {
    const statusMap = {
        'open': { text: 'Открыт', class: 'status-open' },
        'pending': { text: 'На рассмотрении', class: 'status-pending' },
        'resolved': { text: 'Решено', class: 'status-resolved' },
        'rejected': { text: 'Отказано', class: 'status-rejected' },
        'closed': { text: 'Закрыт', class: 'status-closed' }
    };
    return statusMap[status] || { text: 'Неизвестно', class: 'status-unknown' };
}

// Функция получения информации о приоритете тикета
function getTicketPriorityInfo(priority) {
    const priorityMap = {
        'low': { text: 'Низкий', class: 'priority-low' },
        'medium': { text: 'Средний', class: 'priority-medium' },
        'high': { text: 'Высокий', class: 'priority-high' },
        'critical': { text: 'Критический', class: 'priority-critical' }
    };
    return priorityMap[priority] || { text: 'Обычный', class: 'priority-normal' };
}

// Функция генерации действий для тикета
function generateTicketActions(ticket) {
    const actions = [];
    
    // Кнопка просмотра всегда доступна
    actions.push(`<button class="btn btn-small" onclick="viewTicket(${ticket.id})"><i class="fas fa-eye"></i> Просмотр</button>`);
    
    // Действия в зависимости от статуса и прав пользователя
    if (ticket.status === 'pending') {
        if (hasPermission(currentUser, 'tech_support') || hasAdminRights(currentUser)) {
            actions.push(`<button class="btn btn-small btn-success" onclick="resolveTicket(${ticket.id})"><i class="fas fa-check"></i> Решить</button>`);
            actions.push(`<button class="btn btn-small btn-danger" onclick="rejectTicket(${ticket.id})"><i class="fas fa-times"></i> Отказать</button>`);
        }
    }
    
    if (ticket.status === 'resolved' || ticket.status === 'rejected') {
        if (hasAdminRights(currentUser)) {
            actions.push(`<button class="btn btn-small btn-warning" onclick="reopenTicket(${ticket.id})"><i class="fas fa-redo"></i> Переоткрыть</button>`);
        }
    }
    
    return actions.join('');
}

// Функция просмотра тикета
function viewTicket(ticketId) {
    const ticket = demoTickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    openTicketModal(ticket);
}

// Функция открытия модального окна тикета
function openTicketModal(ticket) {
    // Инициализируем сообщения для тикета если их нет
    if (!ticketMessages[ticket.id]) {
        ticketMessages[ticket.id] = [
            {
                author: ticket.user,
                content: ticket.description,
                time: ticket.created,
                type: 'user'
            }
        ];
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content ticket-modal">
            <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
            <div class="ticket-modal-header">
                <h2>Тикет #${ticket.id}: ${ticket.title}</h2>
                <div class="ticket-modal-status">
                    <span class="ticket-status ${getTicketStatusInfo(ticket.status).class}">${getTicketStatusInfo(ticket.status).text}</span>
                    <span class="ticket-priority ${getTicketPriorityInfo(ticket.priority).class}">${getTicketPriorityInfo(ticket.priority).text}</span>
                </div>
            </div>
            
            <div class="ticket-modal-info">
                <div class="ticket-info-item">
                    <strong>Пользователь:</strong> ${ticket.user}
                </div>
                <div class="ticket-info-item">
                    <strong>Создан:</strong> ${ticket.created}
                </div>
                <div class="ticket-info-item">
                    <strong>Обновлен:</strong> ${ticket.updated}
                </div>
                ${ticket.assignee ? `<div class="ticket-info-item"><strong>Ответственный:</strong> ${ticket.assignee}</div>` : ''}
            </div>
            
            <div class="ticket-chat" id="ticketChat-${ticket.id}">
                <h4>Переписка с пользователем:</h4>
                <div class="chat-messages" id="chatMessages-${ticket.id}">
                    ${loadTicketMessages(ticket.id)}
                </div>
                
                ${ticket.status !== 'resolved' && ticket.status !== 'rejected' ? `
                    <div class="chat-input">
                        <textarea id="replyText-${ticket.id}" placeholder="Введите ваш ответ..." rows="3"></textarea>
                        <div class="chat-actions">
                            <button class="btn" onclick="sendTicketReply(${ticket.id})">
                                <i class="fas fa-paper-plane"></i> Отправить ответ
                            </button>
                            ${ticket.status === 'pending' ? `
                                <button class="btn btn-success" onclick="resolveTicketFromModal(${ticket.id})">
                                    <i class="fas fa-check"></i> Решить
                                </button>
                                <button class="btn btn-danger" onclick="rejectTicketFromModal(${ticket.id})">
                                    <i class="fas fa-times"></i> Отказать
                                </button>
                            ` : ''}
                        </div>
                    </div>
                ` : `
                    <div class="chat-closed">
                        <i class="fas fa-lock"></i>
                        <p>Тикет ${ticket.status === 'resolved' ? 'решён' : 'отклонён'}. Переписка закрыта.</p>
                        ${hasAdminRights(currentUser) ? `
                            <button class="btn btn-warning" onclick="reopenTicketFromModal(${ticket.id})">
                                <i class="fas fa-redo"></i> Переоткрыть тикет
                            </button>
                        ` : ''}
                    </div>
                `}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Прокручиваем чат вниз
    setTimeout(() => {
        const chatMessages = document.getElementById(`chatMessages-${ticket.id}`);
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 100);
}

// Функция загрузки сообщений тикета
function loadTicketMessages(ticketId) {
    const messages = ticketMessages[ticketId] || [];
    return messages.map(message => `
        <div class="chat-message ${message.type}-message">
            <div class="message-author">${message.author}${message.type === 'support' ? ' (Поддержка)' : ''}</div>
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.time}</div>
        </div>
    `).join('');
}

// Функция отправки ответа в тикете
function sendTicketReply(ticketId) {
    const replyText = document.getElementById(`replyText-${ticketId}`);
    if (!replyText || !replyText.value.trim()) {
        showNotification('Ошибка', 'Введите текст ответа', 'error');
        return;
    }
    
    // Добавляем сообщение в хранилище
    if (!ticketMessages[ticketId]) {
        ticketMessages[ticketId] = [];
    }
    
    const newMessage = {
        author: currentUser.username,
        content: replyText.value.trim(),
        time: new Date().toLocaleString(),
        type: 'support'
    };
    
    ticketMessages[ticketId].push(newMessage);
    
    // Обновляем чат
    const chatMessages = document.getElementById(`chatMessages-${ticketId}`);
    if (chatMessages) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message support-message';
        messageDiv.innerHTML = `
            <div class="message-author">${currentUser.username} (Поддержка)</div>
            <div class="message-content">${newMessage.content}</div>
            <div class="message-time">${newMessage.time}</div>
        `;
        chatMessages.appendChild(messageDiv);
        
        replyText.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        showNotification('Успех', 'Ответ отправлен пользователю', 'success');
        
        // Обновляем время обновления тикета
        const ticket = demoTickets.find(t => t.id === ticketId);
        if (ticket) {
            ticket.updated = newMessage.time;
            ticket.assignee = currentUser.username;
        }
    }
}

// Функции решения/отказа из модального окна
function resolveTicketFromModal(ticketId) {
    resolveTicket(ticketId);
    // Не закрываем модальное окно, а обновляем его
    updateTicketModalStatus(ticketId, 'resolved');
}

function rejectTicketFromModal(ticketId) {
    rejectTicket(ticketId);
    // Не закрываем модальное окно, а обновляем его
    updateTicketModalStatus(ticketId, 'rejected');
}

function reopenTicketFromModal(ticketId) {
    reopenTicket(ticketId);
    // Обновляем модальное окно
    updateTicketModalStatus(ticketId, 'pending');
}

// Функция обновления статуса в модальном окне
function updateTicketModalStatus(ticketId, newStatus) {
    const ticket = demoTickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    // Обновляем статус в заголовке
    const statusElement = document.querySelector('.ticket-modal .ticket-status');
    if (statusElement) {
        const statusInfo = getTicketStatusInfo(newStatus);
        statusElement.className = `ticket-status ${statusInfo.class}`;
        statusElement.textContent = statusInfo.text;
    }
    
    // Обновляем область чата
    const chatContainer = document.getElementById(`ticketChat-${ticketId}`);
    if (chatContainer) {
        const chatInput = chatContainer.querySelector('.chat-input');
        const chatClosed = chatContainer.querySelector('.chat-closed');
        
        if (newStatus === 'resolved' || newStatus === 'rejected') {
            // Скрываем поле ввода и показываем сообщение о закрытии
            if (chatInput) chatInput.style.display = 'none';
            
            if (!chatClosed) {
                const closedDiv = document.createElement('div');
                closedDiv.className = 'chat-closed';
                closedDiv.innerHTML = `
                    <i class="fas fa-lock"></i>
                    <p>Тикет ${newStatus === 'resolved' ? 'решён' : 'отклонён'}. Переписка закрыта.</p>
                    ${hasAdminRights(currentUser) ? `
                        <button class="btn btn-warning" onclick="reopenTicketFromModal(${ticketId})">
                            <i class="fas fa-redo"></i> Переоткрыть тикет
                        </button>
                    ` : ''}
                `;
                chatContainer.appendChild(closedDiv);
            }
        } else if (newStatus === 'pending') {
            // Показываем поле ввода и скрываем сообщение о закрытии
            if (chatClosed) chatClosed.remove();
            
            if (!chatInput) {
                const inputDiv = document.createElement('div');
                inputDiv.className = 'chat-input';
                inputDiv.innerHTML = `
                    <textarea id="replyText-${ticketId}" placeholder="Введите ваш ответ..." rows="3"></textarea>
                    <div class="chat-actions">
                        <button class="btn" onclick="sendTicketReply(${ticketId})">
                            <i class="fas fa-paper-plane"></i> Отправить ответ
                        </button>
                        <button class="btn btn-success" onclick="resolveTicketFromModal(${ticketId})">
                            <i class="fas fa-check"></i> Решить
                        </button>
                        <button class="btn btn-danger" onclick="rejectTicketFromModal(${ticketId})">
                            <i class="fas fa-times"></i> Отказать
                        </button>
                    </div>
                `;
                chatContainer.appendChild(inputDiv);
            } else {
                chatInput.style.display = 'flex';
            }
        }
    }
}

function resolveTicket(ticketId) {
    const ticket = demoTickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    ticket.status = 'resolved';
    ticket.updated = new Date().toLocaleString();
    ticket.assignee = currentUser.username;
    
    showNotification('Успех', `Тикет #${ticketId} помечен как решенный`, 'success');
    showAllTickets(); // Обновляем отображение
}

function rejectTicket(ticketId) {
    const ticket = demoTickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    ticket.status = 'rejected';
    ticket.updated = new Date().toLocaleString();
    ticket.assignee = currentUser.username;
    
    showNotification('Тикет отклонен', `Тикет #${ticketId} отклонен`, 'warning');
    showAllTickets(); // Обновляем отображение
}

function reopenTicket(ticketId) {
    const ticket = demoTickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    ticket.status = 'pending';
    ticket.updated = new Date().toLocaleString();
    
    showNotification('Тикет переоткрыт', `Тикет #${ticketId} переоткрыт для рассмотрения`, 'info');
    showAllTickets(); // Обновляем отображение
}

// Инициализация страницы технической поддержки
function initTechSupport() {
    showAllTickets();
}