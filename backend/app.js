const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');

// Connect to database
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', (err) => {
    console.log(`Connecting database error: ${err}`);
});
db.on('connected', () => {
    console.log('Database connected');
});

// Create app
const app = express();
const port = process.env.PORT | 8888;
const userRoute = require('./user-route');

// Mount middlewares and routes
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
config.passport(passport);
app.use('/users', userRoute);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server listening at: ${port}`);
});