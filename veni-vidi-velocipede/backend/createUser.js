const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
        return;
    }
    console.log('Conectado ao SQLite');

    const username = 'admin2';
    const password = bcrypt.hashSync('admin2', 10); // Substitui pela tua senha
    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
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