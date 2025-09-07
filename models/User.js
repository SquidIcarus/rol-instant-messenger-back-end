const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    screen_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profile_picture_url: {
        type: String,
        default: null
    },
    personal_status: {
        type: String,
        default: 'Available',
        maxlength: 100
    },
    is_online: {
        type: Boolean,
        default: false
    },
    last_active: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'users'
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.password;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;