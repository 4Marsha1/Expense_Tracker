const express = require('express');
const db = require('./database');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())

app.get('/expenses', (req, res) => {
    const sql = 'SELECT * FROM expenses';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
        });
    });
});

app.get('/expenses/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM expenses WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row,
        });
    });
});

app.post('/expenses', (req, res) => {
    const { expenseType, date, amount } = req.body;
    const sql = `INSERT INTO expenses (expenseType, date, amount) VALUES (?, ?, ?)`;
    db.run(sql, [expenseType, date, amount], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Expense added successfully',
            data: { id: this.lastID, expenseType, date, amount },
        });
    });
});

app.put('/expenses/:id', (req, res) => {
    const { id } = req.params;
    const { expenseType, date, amount } = req.body;
    const sql = `UPDATE expenses SET expenseType = ?, date = ?, amount = ? WHERE id = ?`;
    db.run(sql, [expenseType, date, amount, id], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Expense updated successfully',
            changes: this.changes,
        });
    });
});

app.delete('/expenses/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM expenses WHERE id = ?`;
    db.run(sql, id, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Expense deleted successfully',
            changes: this.changes,
        });
    });
});

app.post('/expenses/bulk', (req, res) => {
    const expenses = req.body;
    const sql = `INSERT INTO expenses (expenseType, date, amount) VALUES (?, ?, ?)`;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        const stmt = db.prepare(sql);
        for (const expense of expenses) {
            const { expenseType, date, amount } = expense;
            stmt.run([expenseType, date, amount], (err) => {
                if (err) {
                    db.run('ROLLBACK');
                    res.status(400).json({ error: err.message });
                    return;
                }
            });
        }
        stmt.finalize((err) => {
            if (err) {
                db.run('ROLLBACK');
                res.status(400).json({ error: err.message });
            } else {
                db.run('COMMIT');
                res.json({
                    message: 'Expenses added successfully',
                    data: expenses,
                });
            }
        });
    });
});

app.post('/expenses/bulk-delete', (req, res) => {
    const expenseIds = req.body;
    const placeholders = expenseIds.map(() => '?').join(',');
    const sql = `DELETE FROM expenses WHERE id IN (${placeholders})`;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(sql, expenseIds, function (err) {
            if (err) {
                db.run('ROLLBACK');
                res.status(400).json({ error: err.message });
            } else {
                db.run('COMMIT');
                res.json({
                    message: 'Expenses deleted successfully',
                    deletedCount: this.changes,
                    deletedIds: expenseIds,
                });
            }
        });
    });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
