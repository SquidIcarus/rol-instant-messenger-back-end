const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { recipient_screen_name, message_content } = req.body;

        const recipient = await User.findOne({ screen_name: recipient_screen_name });

        if (!recipient) {
            return res.status(404).json({ err: 'User not found.' });
        }

        if (recipient._id.toString() === req.user._id) {
            return res.status(400).json({ err: 'Cannot send message to yourself.' });
        }

        let conversation = await Conversation.findOne({
            $or: [
                { user1_id: req.user._id, user2_id: recipient._id },
                { user1_id: recipient._id, user2_id: req.user._id }
            ]
        });

        if (!conversation) {
            conversation = new Conversation({
                user1_id: req.user._id,
                user2_id: recipient._id,
                last_message_at: new Date()
            });
            await conversation.save();
            console.log('Created new conversation:', conversation._id);
        } else {
            conversation.last_message_at = new Date();
            await conversation.save();
            console.log('Updated existing conversation:', conversation._id);
        }
        const newMessage = new Message({
            conversation_id: conversation._id,
            sender_id: req.user._id,
            message_content: message_content
        });

        await newMessage.save();
        await newMessage.populate('sender_id', 'screen_name');

        console.log('Message saved:', newMessage._id);

        res.status(201).json({
            message: 'Message sent successfully.',
            data: newMessage
        });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;