// ============================================
// МЕНЕДЖЕР ФОРУМА
// ============================================

export class ForumManager {
    constructor() {
        this.topics = [];
        this.categories = ['team', 'core', 'support', 'item-core', 'item-support', 'questions'];
    }

    init() {
        this.loadTopics();
        this.initEventListeners();
    }

    loadTopics() {
        // Загрузка тем форума
    }

    createTopic(data) {
        // Создание новой темы
    }

    initEventListeners() {
        // Обработчики событий форума
    }
}