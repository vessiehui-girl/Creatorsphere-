import { execSync } from "child_process";

const run = (cmd: string) => {
  console.log(`→ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

// Build React frontend
console.log("📦 Building frontend...");
run("npx vite build --outDir dist/public");

// Build Express backend
console.log("📦 Building backend...");
run("npx esbuild server/index.ts --bundle --platform=node --outdir=dist --format=esm --packages=external");

console.log("✅ Build complete!");
