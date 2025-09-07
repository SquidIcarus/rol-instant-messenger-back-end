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

        const token = jwt.sign(
            { userId: user._id, screen_name: user.screen_name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                screen_name: user.screen_name,
                personal_status: user.personal_status,
                is_online: user.is_online
            }
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;