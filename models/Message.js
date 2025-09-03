const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message_content: {
        type: String,
        required: true
    },
    sent_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false,
    collection: 'messages'
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;