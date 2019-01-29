const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const mysql = require('mysql')

const dir = './uploads';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'oca'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


const app = express();
app.use(cors());

// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}

app.use(express.static('uploads'))
app.use(bodyParser.json());
// Routes
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/organizational-structure'));

module.exports = app;
