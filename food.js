const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'food_paradise'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Route to handle order form submission
app.post('/order', (req, res) => {
    const { name, phone, address, cartData } = req.body;

    const sql = 'INSERT INTO orders (name, phone, address, cart_data) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, phone, address, cartData], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error saving order');
        }

        console.log('Order saved:', result.insertId);
        res.send('Order placed successfully!');
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
