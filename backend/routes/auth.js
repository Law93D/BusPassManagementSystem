const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authController = require('../controllers/authController'); 
const authenticateToken = require('../middleware/authToken');

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', authController.login);

// Protected Route
router.get('/some-protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Success! You have accessed a protected route.' });
});

module.exports = router;
