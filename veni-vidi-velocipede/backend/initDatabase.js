// backend/initDatabase.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
        return;
    }
    console.log('Conectado ao SQLite');

    // Criar tabelas
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model TEXT NOT NULL,
                description TEXT NOT NULL,
                price REAL NOT NULL,
                priceWithoutVAT REAL NOT NULL,
                vat REAL NOT NULL,
                image TEXT NOT NULL,
                category TEXT NOT NULL
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS suggestions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                text TEXT NOT NULL,
                date TEXT DEFAULT CURRENT_TIMESTAMP,
                response TEXT
            )
        `);
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);

        // Inserir utilizador admin
        const username = 'admin';
        const password = bcrypt.hashSync('admin123', 10);
        db.run(
            'INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)',
            [username, password],
            (err) => {
                if (err) {
                    console.error('Erro ao criar utilizador:', err.message);
                } else {
                    console.log('Utilizador admin criado com sucesso');
                }
                db.close();
            }
        );
    });
});