const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      expenseType TEXT NOT NULL CHECK (expenseType IN ('Grocery', 'Cigarette', 'Shopping', 'Party', 'Food', 'Travel', 'Petrol', 'Rent', 'Bills', 'Credit Card', 'Outing', 'Medicine / Medical', 'Investment', 'Family', 'Misc')),
      date TEXT NOT NULL,
      amount REAL NOT NULL
    )
  `, (err) => {
        if (err) {
            console.error('Error creating table', err.message);
        } else {
            console.log('Expenses table created or verified successfully.');
        }
    });
});

module.exports = db;
