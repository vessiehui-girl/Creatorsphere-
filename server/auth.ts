import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { db } from './db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const parts = stored.split('.');
  if (parts.length !== 2) {
    throw new Error('Invalid stored password hash format');
  }
  const [hashed, salt] = parts;
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user) {
        return done(null, false, { message: 'Invalid email or password.' });
      }
      const isMatch = await comparePasswords(password, user.passwordHash);
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
    const [user] = await db.select().from(users).where(eq(users.id, id));
    done(null, user ?? null);
  } catch (error) {
    done(error);
  }
});

export default passport;