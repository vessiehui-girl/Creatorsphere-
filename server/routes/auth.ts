import { Drizzle } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const db = new Drizzle();

// Register route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert('users').values({ email, password: hashedPassword });
    res.status(201).send('User registered');
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.select('users').where({ email }).first();
    if (user && await bcrypt.compare(password, user.password)) {
        // Logic for setting user session
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Logout route
app.post('/logout', async (req, res) => {
    // Logic for destroying session
    res.send('Logged out');
});

// /me endpoint
app.get('/me', async (req, res) => {
    const userId = req.session.userId;  // Assume user ID is stored in session
    const user = await db.select('users').where({ id: userId }).first();
    if (user) {
        res.send({ id: user.id, email: user.email });
    } else {
        res.status(401).send('Not authenticated');
    }
});

// /check endpoint
app.get('/check', (req, res) => {
    if (req.session.userId) {
        res.send({ authenticated: true });
    } else {
        res.send({ authenticated: false });
    }
});