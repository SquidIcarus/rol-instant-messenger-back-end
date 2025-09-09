const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const User = require('../models/User');

router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user._id }
        }).select('screen_name');

        res.json(users);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;