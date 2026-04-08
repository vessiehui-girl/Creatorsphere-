var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express from "express";
import cors from "cors";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";
import { fileURLToPath } from "url";

// server/routes/auth.ts
import { Router } from "express";
import rateLimit from "express-rate-limit";

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analyticsSnapshots: () => analyticsSnapshots,
  connectedPlatforms: () => connectedPlatforms,
  posts: () => posts,
  scheduledPosts: () => scheduledPosts,
  users: () => users,
  vaultItems: () => vaultItems
});
import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("passwordHash").notNull(),
  createdAt: timestamp("createdAt").defaultNow()
});
var connectedPlatforms = pgTable("connected_platforms", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  platform: text("platform"),
  connected: boolean("connected").default(false),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  createdAt: timestamp("createdAt").defaultNow()
});
var vaultItems = pgTable("vault_items", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  type: text("type"),
  title: text("title"),
  content: text("content"),
  fileUrl: text("fileUrl"),
  createdAt: timestamp("createdAt").defaultNow()
});
var posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  mediaUrl: text("mediaUrl"),
  caption: text("caption"),
  status: text("status").default("draft"),
  createdAt: timestamp("createdAt").defaultNow()
});
var scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  postId: integer("postId").references(() => posts.id),
  platform: text("platform"),
  scheduledFor: timestamp("scheduledFor"),
  status: text("status").default("pending")
});
var analyticsSnapshots = pgTable("analytics_snapshots", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  platform: text("platform"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  capturedAt: timestamp("capturedAt").defaultNow()
});

// server/db.ts
if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });

// server/routes/auth.ts
import { eq } from "drizzle-orm";

// server/passwordUtils.ts
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}
async function verifyPassword(password, hash) {
  const parts = hash.split(":");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error("Invalid hash format");
  }
  const [salt, storedKey] = parts;
  const derivedKey = await scryptAsync(password, salt, 64);
  const storedBuffer = Buffer.from(storedKey, "hex");
  if (derivedKey.length !== storedBuffer.length) return false;
  return timingSafeEqual(derivedKey, storedBuffer);
}

// server/routes/auth.ts
var authRouter = Router();
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});
var MIN_PASSWORD_LENGTH = 8;
authRouter.post("/register", authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }
  try {
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(users).values({ email, passwordHash }).returning({ id: users.id, email: users.email });
    req.session.userId = user.id;
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
authRouter.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.userId = user.id;
    return res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
authRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out" });
  });
});
authRouter.get("/me", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const [user] = await db.select({ id: users.id, email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    return res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// server/routes/platforms.ts
import { Router as Router2 } from "express";
import { eq as eq2, and } from "drizzle-orm";

// server/middleware/requireAuth.ts
var requireAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
var requireAuth_default = requireAuth;

// server/routes/platforms.ts
var router = Router2();
router.get("/", requireAuth_default, async (req, res) => {
  try {
    const platforms = await db.select().from(connectedPlatforms).where(eq2(connectedPlatforms.userId, req.session.userId));
    return res.json(platforms);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/connect", requireAuth_default, async (req, res) => {
  try {
    const { platforms } = req.body;
    if (!Array.isArray(platforms)) {
      return res.status(400).json({ message: "platforms must be an array" });
    }
    const userId = req.session.userId;
    const existing = await db.select().from(connectedPlatforms).where(and(eq2(connectedPlatforms.userId, userId)));
    const existingMap = new Map(existing.map((p) => [p.platform, p]));
    const results = [];
    for (const platform of platforms) {
      const record = existingMap.get(platform);
      if (record) {
        const [updated] = await db.update(connectedPlatforms).set({ connected: true }).where(eq2(connectedPlatforms.id, record.id)).returning();
        results.push(updated);
      } else {
        const [inserted] = await db.insert(connectedPlatforms).values({ userId, platform, connected: true }).returning();
        results.push(inserted);
      }
    }
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.patch("/:id", requireAuth_default, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { connected } = req.body;
    const [updated] = await db.update(connectedPlatforms).set({ connected }).where(and(eq2(connectedPlatforms.id, id), eq2(connectedPlatforms.userId, req.session.userId))).returning();
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
var platforms_default = router;

// server/routes/vault.ts
import { Router as Router3 } from "express";
import { eq as eq3, desc } from "drizzle-orm";
var router2 = Router3();
router2.get("/", requireAuth_default, async (req, res) => {
  try {
    const items = await db.select().from(vaultItems).where(eq3(vaultItems.userId, req.session.userId)).orderBy(desc(vaultItems.createdAt));
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router2.post("/", requireAuth_default, async (req, res) => {
  try {
    const { type, title, content, fileUrl } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });
    const [item] = await db.insert(vaultItems).values({ userId: req.session.userId, type, title, content, fileUrl }).returning();
    return res.status(201).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
var vault_default = router2;

// server/routes/posts.ts
import { Router as Router4 } from "express";
import { eq as eq4, desc as desc2, and as and2 } from "drizzle-orm";
var router3 = Router4();
router3.get("/", requireAuth_default, async (req, res) => {
  try {
    const userPosts = await db.select().from(posts).where(eq4(posts.userId, req.session.userId)).orderBy(desc2(posts.createdAt));
    return res.json(userPosts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router3.post("/", requireAuth_default, async (req, res) => {
  try {
    const { caption, mediaUrl, status } = req.body;
    const [post] = await db.insert(posts).values({ userId: req.session.userId, caption, mediaUrl, status: status || "draft" }).returning();
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router3.patch("/:id", requireAuth_default, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { caption, status } = req.body;
    const [updated] = await db.update(posts).set({ caption, status }).where(and2(eq4(posts.id, id), eq4(posts.userId, req.session.userId))).returning();
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
var posts_default = router3;

// server/routes/planner.ts
import { Router as Router5 } from "express";
import { eq as eq5, asc } from "drizzle-orm";
var router4 = Router5();
router4.get("/", requireAuth_default, async (req, res) => {
  try {
    const items = await db.select().from(scheduledPosts).where(eq5(scheduledPosts.userId, req.session.userId)).orderBy(asc(scheduledPosts.scheduledFor));
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router4.post("/schedule", requireAuth_default, async (req, res) => {
  try {
    const { postId, platform, scheduledFor } = req.body;
    if (!postId || !platform || !scheduledFor) {
      return res.status(400).json({ message: "postId, platform, and scheduledFor are required" });
    }
    const [scheduled] = await db.insert(scheduledPosts).values({
      userId: req.session.userId,
      postId,
      platform,
      scheduledFor: new Date(scheduledFor),
      status: "pending"
    }).returning();
    return res.status(201).json(scheduled);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
var planner_default = router4;

// server/routes/analytics.ts
import { Router as Router6 } from "express";
import { eq as eq6, desc as desc3 } from "drizzle-orm";
var router5 = Router6();
var PLATFORMS = ["TikTok", "Instagram", "YouTube", "Facebook", "Twitter/X"];
router5.get("/summary", requireAuth_default, async (req, res) => {
  try {
    const snapshots = await db.select().from(analyticsSnapshots).where(eq6(analyticsSnapshots.userId, req.session.userId)).orderBy(desc3(analyticsSnapshots.capturedAt));
    const latest = {};
    for (const snap of snapshots) {
      if (snap.platform && !latest[snap.platform]) {
        latest[snap.platform] = snap;
      }
    }
    const result = PLATFORMS.map(
      (platform) => latest[platform] || { platform, views: 0, likes: 0, comments: 0 }
    );
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
var analytics_default = router5;

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = Number(process.env.PORT || 5e3);
var FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
var SESSION_SECRET = process.env.SESSION_SECRET;
var isProduction = process.env.NODE_ENV === "production";
if (isProduction && !SESSION_SECRET) {
  console.error("SESSION_SECRET environment variable is required in production");
  process.exit(1);
}
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);
if (isProduction) {
  app.set("trust proxy", 1);
}
var MemStore = MemoryStore(session);
app.use(
  session({
    store: new MemStore({ checkPeriod: 864e5 }),
    secret: SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 7 days
    }
  })
);
if (isProduction) {
  app.use((req, res, next) => {
    const mutating = ["POST", "PUT", "PATCH", "DELETE"];
    if (!mutating.includes(req.method)) return next();
    const origin = req.headers["origin"];
    const referer = req.headers["referer"];
    const validOrigin = origin === FRONTEND_URL;
    const validReferer = !origin && referer && new URL(referer).origin === FRONTEND_URL;
    if (!validOrigin && !validReferer) {
      return res.status(403).json({ error: "Forbidden: invalid origin" });
    }
    next();
  });
}
app.use("/api/auth", authRouter);
app.use("/api/platforms", platforms_default);
app.use("/api/vault", vault_default);
app.use("/api/posts", posts_default);
app.use("/api/planner", planner_default);
app.use("/api/analytics", analytics_default);
if (isProduction) {
  const staticPath = path.resolve(__dirname, "../../dist/public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});
var index_default = app;
export {
  index_default as default
};
