const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    expenseType: String,
    date: Date,
    remarks: String,
    amount: Number,
});

module.exports = mongoose.model('expense', ExpenseSchema, 'expense');
