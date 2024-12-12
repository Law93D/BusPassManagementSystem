const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to protect the route
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(401).json({ msg: 'No token provided, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach user data to request
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Define a protected route
router.get('/protected-route', authMiddleware, (req, res) => {
    res.json({ msg: 'You have accessed a protected route!', user: req.user });
});

module.exports = router;
