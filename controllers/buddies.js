const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const Buddy = require('../models/Buddy');
const User = require('../models/User');

module.exports = router;

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