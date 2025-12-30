// API Client for Frontend
const API = {
    baseURL: 'http://localhost:3000/api',
    token: localStorage.getItem('authToken'),
    
    // Установка токена
    setToken: (token) => {
        API.token = token;
        localStorage.setItem('authToken', token);
    },
    
    // Удаление токена
    removeToken: () => {
        API.token = null;
        localStorage.removeItem('authToken');
    },
    
    // Базовый запрос
    request: async (endpoint, options = {}) => {
        const url = `${API.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        if (API.token) {
            config.headers.Authorization = `Bearer ${API.token}`;
        }
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Ошибка запроса');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // Аутентификация
    auth: {
        login: async (usernameOrEmail, password) => {
            const data = await API.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ usernameOrEmail, password })
            });
            
            if (data.token) {
                API.setToken(data.token);
            }
            
            return data;
        },
        
        register: async (username, email, password) => {
            const data = await API.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });
            
            if (data.token) {
                API.setToken(data.token);
            }
            
            return data;
        },
        
        verify: async () => {
            return await API.request('/auth/verify');
        },
        
        logout: () => {
            API.removeToken();
        }
    },
    
    // Пользователи
    users: {
        getProfile: async () => {
            return await API.request('/users/profile');
        },
        
        updateProfile: async (profileData) => {
            return await API.request('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
        },
        
        updateAvatar: async (avatarData) => {
            return await API.request('/users/avatar', {
                method: 'POST',
                body: JSON.stringify({ avatarData })
            });
        },
        
        changePassword: async (currentPassword, newPassword) => {
            return await API.request('/users/password', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword })
            });
        }
    },
    
    // Форум
    forum: {
        getTopics: async () => {
            return await API.request('/forum/topics');
        },
        
        createTopic: async (topicData) => {
            return await API.request('/forum/topics', {
                method: 'POST',
                body: JSON.stringify(topicData)
            });
        },
        
        getTopic: async (id) => {
            return await API.request(`/forum/topics/${id}`);
        },
        
        addReply: async (topicId, content) => {
            return await API.request(`/forum/topics/${topicId}/replies`, {
                method: 'POST',
                body: JSON.stringify({ content })
            });
        },
        
        getStats: async () => {
            return await API.request('/forum/stats');
        }
    }
};