import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
    user: 'your_user',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

const pgSession = connectPgSimple(session);

const sessionConfig = {
    store: new pgSession({ pool: pool }),
    secret: 'your_secret', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // set to true if using https
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
};

export { sessionConfig };