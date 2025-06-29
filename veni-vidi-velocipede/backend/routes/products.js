const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

router.get('/', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao listar produtos', error: err.message });
        }
        res.json(rows);
    });
});

router.get('/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao obter produto', error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(row);
    });
});

router.post('/', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Não autenticado' });
    const { model, description, price, image, category } = req.body;
    if (!model || !description || !price || !image || !category) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    const priceWithoutVAT = (price / 1.23).toFixed(2);
    const vat = (price - priceWithoutVAT).toFixed(2);
    db.run(
        'INSERT INTO products (model, description, price, priceWithoutVAT, vat, image, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [model, description, price, priceWithoutVAT, vat, image, category],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Erro ao adicionar produto', error: err.message });
            }
            res.status(201).json({ message: 'Produto adicionado com sucesso', product: { id: this.lastID, model, description, price, priceWithoutVAT, vat, image, category } });
        }
    );
});

router.put('/:id', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Não autenticado' });
    const { model, description, price, image, category } = req.body;
    if (!model || !description || !price || !image || !category) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    const priceWithoutVAT = (price / 1.23).toFixed(2);
    const vat = (price - priceWithoutVAT).toFixed(2);
    db.run(
        'UPDATE products SET model = ?, description = ?, price = ?, priceWithoutVAT = ?, vat = ?, image = ?, category = ? WHERE id = ?',
        [model, description, price, priceWithoutVAT, vat, image, category, req.params.id],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Erro ao atualizar produto', error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            res.json({ message: 'Produto atualizado com sucesso', product: { id: req.params.id, model, description, price, priceWithoutVAT, vat, image, category } });
        }
    );
});

router.delete('/:id', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Não autenticado' });
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Erro ao apagar produto', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto apagado com sucesso' });
    });
});

module.exports = router;