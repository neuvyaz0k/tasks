// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/taskboard', { useNewUrlParser: true, useUnifiedTopology: true });

// Модели MongoDB
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

const BoardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    columns: [
        {
            title: String,
            cards: [
                {
                    id: { type: String, default: uuidv4 },
                    text: String,
                    assignee: String,
                    createdAt: { type: Date, default: Date.now },
                    description: String,
                    priority: Number
                }
            ]
        }
    ]
});

const User = mongoose.model('User', UserSchema);
const Board = mongoose.model('Board', BoardSchema);

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Логин пользователя
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid password');

        const token = jwt.sign({ id: user._id, role: user.role }, 'secret_key', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

// Middleware для проверки токена и ролей
const auth = (roles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return res.status(401).send('Access denied');

        try {
            const verified = jwt.verify(token, 'secret_key');
            if (roles.length && !roles.includes(verified.role)) {
                return res.status(403).send('Permission denied');
            }
            req.user = verified;
            next();
        } catch (err) {
            res.status(400).send('Invalid token');
        }
    };
};

// Получение данных доски задач
app.get('/boards/:id', auth(['user', 'admin']), async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).send('Board not found');
        res.status(200).json(board);
    } catch (err) {
        res.status(500).send('Error retrieving board');
    }
});

// Обновление доски задач (например, добавление или редактирование колонок и карточек)
app.put('/boards/:id', auth(['admin']), async (req, res) => {
    try {
        const updatedBoard = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedBoard);
    } catch (err) {
        res.status(500).send('Error updating board');
    }
});

// Выход из аккаунта
app.post('/logout', (req, res) => {
    // Просто удаляем токен на клиентской стороне, на сервере ничего не нужно делать
    res.status(200).send('User logged out');
});

// Редактирование данных профиля
app.put('/profile', auth(['user', 'admin']), async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { username, password: hashedPassword }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).send('Error updating profile');
    }
});

// Добавление новой доски
app.post('/boards', auth(['admin']), async (req, res) => {
    const newBoard = new Board(req.body);
    try {
        await newBoard.save();
        res.status(201).json(newBoard);
    } catch (err) {
        res.status(500).send('Error creating board');
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
