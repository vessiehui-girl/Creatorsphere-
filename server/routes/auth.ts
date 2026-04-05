import { Router } from 'express';
import passport from 'passport';
import { body, validationResult } from 'express-validator';

const router = Router();

// POST /register
router.post('/register', [ 
    body('username').isString(), 
    body('password').isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password } = req.body;

    // Add logic to save the user (hashing password, etc.)
    // Example: await User.create({ username, password });

    res.status(201).json({ message: 'User created successfully' });
});

// POST /login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Logged in successfully', user: req.user });
});

// POST /logout
router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Logged out successfully' });
});

// GET /user
router.get('/user', (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// GET /check
router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

export default router;