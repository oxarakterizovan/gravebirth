# 🚀 Добавление проекта VimeTalks в Git

## 📋 **Пошаговая инструкция**

### **1. Инициализация Git репозитория**
```bash
cd d:\gravebirth
git init
```

### **2. Добавление файлов в индекс**
```bash
# Добавить все файлы
git add .

# Или добавить только основные файлы
git add index.html styles.css logo.png js/ backend/ README.md
```

### **3. Первый коммит**
```bash
git commit -m "Initial commit: VimeTalks website"
```

### **4. Создание репозитория на GitHub**
1. Зайти на [GitHub.com](https://github.com)
2. Нажать "New repository"
3. Название: `vimetalks` или `gravebirth`
4. Описание: `VimeTalks - Community forum website`
5. Выбрать Public/Private
6. НЕ добавлять README, .gitignore, license (уже есть)

### **5. Подключение к удаленному репозиторию**
```bash
# Замените YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/gravebirth.git
git branch -M main
git push -u origin main
```

## 🔧 **Альтернативные команды**

### **Добавление только рабочих файлов:**
```bash
git add index.html
git add styles.css
git add logo.png
git add js/
git add README.md
git add .gitignore
```

### **Исключение ненужных файлов:**
```bash
# Удалить из индекса (если уже добавлены)
git rm --cached script.js
git rm --cached gravebirth.html
git rm --cached index-modular.html
```

### **Проверка статуса:**
```bash
git status
git log --oneline
```

## 📁 **Рекомендуемая структура коммитов**

```bash
git add index.html styles.css logo.png js/ README.md .gitignore
git commit -m "feat: core website functionality"

git add backend/
git commit -m "feat: Node.js backend API"

git add src/
git commit -m "feat: modular architecture (WIP)"
```

## 🌐 **После загрузки на GitHub**

### **Клонирование проекта:**
```bash
git clone https://github.com/YOUR_USERNAME/gravebirth.git
```

### **Обновление проекта:**
```bash
git add .
git commit -m "update: описание изменений"
git push origin main
```

## ⚠️ **Важные заметки**

- ✅ `.gitignore` уже создан
- ✅ Исключены `node_modules/`, логи, временные файлы
- 🔄 Модульная архитектура в `src/` - в разработке
- 🖥️ Backend требует `npm install` после клонирования
- 📱 Основная версия: `index.html` + `js/` модули