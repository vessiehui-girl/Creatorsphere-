import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { db } from './db.js';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import { verifyPassword } from './passwordUtils.js';

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (!user) {
        return done(null, false, { message: 'Invalid email or password.' });
      }
      const isMatch = await verifyPassword(password, user.passwordHash);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    done(null, user || null);
  } catch (error) {
    done(error);
  }
});

export default passport;