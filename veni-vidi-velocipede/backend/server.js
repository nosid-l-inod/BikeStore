const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors');
const productRoutes = require('./routes/products');
const suggestionRoutes = require('./routes/suggestions');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
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
        });
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'veni-vidi-secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({ path: './sessions' }), // Armazenar sessões em ficheiros
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

// Rotas
app.use('/api/products', productRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/auth', authRoutes);

// Servir ficheiros estáticos
app.use(express.static('../'));

app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));