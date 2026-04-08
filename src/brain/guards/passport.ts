import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '@shared/types'; // shared types from src/language/types.ts

// Configure Passport to use LocalStrategy for username/password authentication
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Invalid username or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return done(null, user);
        }
        return done(null, false, { message: 'Invalid username or password.' });
    } catch (error) {
        return done(error);
    }
}));

// Serialize user instance to the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user instance from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;