const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors({
    origin: '*', // Replace with your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Session setup
app.use(session({
    secret: process.env.SECRET_KEY, // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/auth')); // Add auth route
app.use('/admin', require('./routes/admin'));
app.use('/feedback', require('./routes/feedback'));
app.use('/course', require('./routes/course'));
app.use('/professor', require('./routes/professor'));
app.use('/question', require('./routes/question'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
