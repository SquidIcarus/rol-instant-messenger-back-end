const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');

const User = require('../models/User');

router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId) {
            return res.status(40.).json({ err: "Unauthorized" });
        }

        const users = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ err: 'User not found.' });
        }

        res.json(users);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;