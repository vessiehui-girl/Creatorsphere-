import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Passport configuration
passport.use(new LocalStrategy((username, password, done) => {
    // Here you would normally verify username and password
    // Call done(null, user) if authentication is successful
    // Call done(null, false) if authentication fails
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Fetch user by ID from the database and call done(null, user)
});

app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
}));

app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        return res.send('Welcome to your dashboard!');
    }
    return res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});