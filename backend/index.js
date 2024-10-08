const express = require('express');
const cors = require('cors');
require("dotenv").config();
const mongoose = require('mongoose');
const Expense = require('./schema')
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(express.json());
app.use(cors())
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});;

app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        return res.status(200).json({
            size: expenses.length,
            data: expenses,
            status: true,
            message: 'Expenses retrieved successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving expenses',
            status: false
        })
    }
});

app.get('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const expenses = await Expense.findById(id);
        return res.status(200).json({
            data: expenses,
            status: true,
            message: 'Expense retrieved successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving expense',
            status: false
        })
    }
});

app.post('/expenses', async (req, res) => {
    const { expenseType, date, amount, remarks } = req.body;
    const expense = new Expense({
        expenseType,
        date,
        amount,
        remarks,
    })
    try {
        await expense.save();
        return res.status(201).json({
            data: expense,
            status: true,
            message: 'Expense saved successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error saving expense',
            status: false
        })
    }
});

app.put('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    const { expenseType, date, amount, remarks } = req.body;
    try {
        const expenses = await Expense.findByIdAndUpdate(id, { expenseType, date, amount, remarks })
        return res.status(200).json({
            status: true,
            message: 'Expense updated successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating expense',
            status: false
        })
    }
});

app.delete('/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const expenses = await Expense.findByIdAndDelete(id);
        return res.status(200).json({
            status: true,
            message: 'Expense deleted successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error deleting expense',
            status: false
        })
    }
});

app.post('/expenses/bulk', async (req, res) => {
    const expenses = req.body;
    try {
        await Expense.insertMany(expenses);
        return res.status(200).json({
            status: true,
            message: 'Expenses added successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error saving expense',
            status: false
        })
    }
});

app.post('/expenses/bulk-delete', async (req, res) => {
    const idsToDelete = req.body.map((_id) => new ObjectId(`${_id}`))
    console.log(idsToDelete);
    try {
        await Expense.deleteMany({ _id: { $in: idsToDelete } }).catch(err => console.log(err))
        return res.status(200).json({
            status: true,
            message: 'Expenses successfully deleted!'
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Error deleting expenses!'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
