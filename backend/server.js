const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./api/auth');
const userRoutes = require('./api/users');
const forumRoutes = require('./api/forum');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forum', forumRoutes);

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});