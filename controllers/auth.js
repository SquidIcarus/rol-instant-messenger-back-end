const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const saltRounds = 10;

router.post('/sign-up', async (req, res) => {
    console.log('req.body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);

    try {
        const userInDatabase = await User.findOne({ screen_name: req.body.screen_name });

        if (userInDatabase) {
            return res.status(409).json({ err: 'Screen name already taken.' });
        }

        const user = await User.create({
            screen_name: req.body.screen_name,
            password: bcrypt.hashSync(req.body.password, saltRounds)
        });

        const payload = { screen_name: user.screen_name, _id: user._id };

        const token = jwt.sign({ payload },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

router.post('/sign-in', async (req, res) => {
    try {
        const user = await User.findOne({ screen_name: req.body.screen_name });
        if (!user) {
            return res.status(401).json({ err: 'Invalid credentials.' });
        }
        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password, user.password
        );
        if (!isPasswordCorrect) {
            return res.status(401).json({ err: 'Invalid credentials.' });
        }

        const payload = { screen_name: user.screen_name, _id: user._id };

        const token = jwt.sign({ payload },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;