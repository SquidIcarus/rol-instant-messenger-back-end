const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const Buddy = require('../models/Buddy');
const User = require('../models/User');

module.exports = router;

// buddy list route 

router.get('/', verifyToken, async (req, res) => {
    try {
        const buddies = await Buddy.find({
            user_id: req.user._id,
            is_active: true
        });

        res.json(buddies);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

// Add buddy route

router.post('/', verifyToken, async (req, res) => {
    try {
        const { friend_screen_name } = req.body;

        const friendUser = await User.findOne({ screen_name: friend_screen_name });
        if (!friendUser) {
            return res.status(404).json({ err: 'User not found.' });
        }

        if (friendUser._id.toString() === req.user._id) {
            return res.status(400).json({ err: 'Cannot add yourself as a buddy.' });
        }

        const newBuddy = new Buddy({
            user_id: req.user._id,
            friend_user_id: friendUser._id
        });

        await newBuddy.save();

        res.status(201).json({
            message: 'Buddy added succesfully.',
            buddy: newBuddy
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});