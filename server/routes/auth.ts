import { Router } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db'; // Drizzle ORM instance

const router = Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Save user in database
        await db.users.insert({ username, passwordHash });

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Fetch user from database
        const user = await db.users.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Set user session or token (pseudo-code)
        // req.session.user = user;
        return res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    // Destroy user session or token
    // req.session.destroy();
    return res.status(200).json({ message: 'Logged out successfully' });
});

// Get user route
router.get('/user', (req, res) => {
    // Get user info from session or token
    // const user = req.session.user;
    return res.status(200).json({ user: 'User info here' }); // Replace with actual user info
});

// Check authentication status route
router.get('/check-auth', (req, res) => {
    // Check if user is authenticated
    // const authenticated = !!req.session.user;
    return res.status(200).json({ authenticated: true }); // Replace with actual authentication check
});

export default router;