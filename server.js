const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.use(express.json());
app.use(logger('dev'));
app.use(cors());

const User = require('./models/User');
const Buddy = require('./models/Buddy');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

app.get('/test', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({
            message: 'Database connection working',
            userCount: userCount,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed: ' + error.message });
    }
});

app.listen(3000, () => {
    console.log('The express app is ready!');
});
