const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register User
exports.register = async (req, res) => {
    const { name, surname, email, password } = req.body;

    try {
        // Validate request body
        if (!name || !surname || !email || !password) {
            return res.status(400).json({ success: false, msg: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const user = new User({ name, surname, email, password: hashedPassword });
        await user.save();

        // Create payload and sign JWT token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '300h' });

        res.status(201).json({
            success: true,
            msg: 'Registration successful',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ success: false, msg: 'Server error', error: err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate request body
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, msg: 'Invalid email or password' });
        }

        // Compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, msg: 'Invalid email or password' });
        }

        // Create JWT token for the user
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '200h' });

        res.json({
            success: true,
            msg: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ success: false, msg: 'Server error', error: err.message });
    }
};
