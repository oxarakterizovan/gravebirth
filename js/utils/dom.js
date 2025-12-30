// DOM Utilities
const DOM = {
    // Получение элемента по ID
    get: (id) => document.getElementById(id),
    
    // Получение элементов по селектору
    getAll: (selector) => document.querySelectorAll(selector),
    
    // Создание элемента
    create: (tag, className = '', innerHTML = '') => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },
    
    // Добавление класса
    addClass: (element, className) => {
        if (element) element.classList.add(className);
    },
    
    // Удаление класса
    removeClass: (element, className) => {
        if (element) element.classList.remove(className);
    },
    
    // Переключение класса
    toggleClass: (element, className) => {
        if (element) element.classList.toggle(className);
    },
    
    // Проверка наличия класса
    hasClass: (element, className) => {
        return element ? element.classList.contains(className) : false;
    },
    
    // Показать элемент
    show: (element, display = 'block') => {
        if (element) element.style.display = display;
    },
    
    // Скрыть элемент
    hide: (element) => {
        if (element) element.style.display = 'none';
    },
    
    // Добавление обработчика событий
    on: (element, event, handler) => {
        if (element) element.addEventListener(event, handler);
    },
    
    // Удаление обработчика событий
    off: (element, event, handler) => {
        if (element) element.removeEventListener(event, handler);
    }
};