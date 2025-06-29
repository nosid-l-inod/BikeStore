const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

router.get('/', (req, res) => {
    db.all('SELECT * FROM suggestions', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao listar sugestões', error: err.message });
        }
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    const { category, text } = req.body;
    if (!category || !text) {
        return res.status(400).json({ message: 'Categoria e texto são obrigatórios' });
    }
    db.run(
        'INSERT INTO suggestions (category, text) VALUES (?, ?)',
        [category, text],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Erro ao adicionar sugestão', error: err.message });
            }
            res.status(201).json({ message: 'Sugestão adicionada com sucesso', suggestion: { id: this.lastID, category, text, date: new Date().toISOString() } });
        }
    );
});

router.post('/:id/response', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Não autenticado' });
    const { response } = req.body;
    if (!response) {
        return res.status(400).json({ message: 'Resposta é obrigatória' });
    }
    db.run(
        'UPDATE suggestions SET response = ? WHERE id = ?',
        [response, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Erro ao adicionar resposta', error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Sugestão não encontrada' });
            }
            res.json({ message: 'Resposta adicionada com sucesso', suggestion: { id: req.params.id, response } });
        }
    );
});

router.delete('/:id', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Não autenticado' });
    db.run('DELETE FROM suggestions WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Erro ao apagar sugestão', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Sugestão não encontrada' });
        }
        res.json({ message: 'Sugestão apagada com sucesso' });
    });
});

module.exports = router;