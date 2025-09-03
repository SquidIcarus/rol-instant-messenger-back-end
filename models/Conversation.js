const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    user1_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    last_message_at: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'conversations'
});


const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;