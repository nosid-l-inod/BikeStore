const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database('./database.sqlite');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username e password são obrigatórios' });
    }
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao autenticar', error: err.message });
        }
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        req.session.user = { id: user.id, username: user.username };
        res.json({ message: 'Login bem-sucedido' });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout bem-sucedido' });
});

router.get('/check', (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;