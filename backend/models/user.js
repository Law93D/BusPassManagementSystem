const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Password hashing before saving
UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
    return `${this.name} ${this.surname}`;
});

module.exports = mongoose.model('User', UserSchema);
