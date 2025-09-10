import { app } from "../server/app";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/vite";

// Initialize routes once (serverless cold start)
let initialized = false;
async function ensureInitialized() {
  if (initialized) return;
  // In serverless, we don't need an HTTP server instance; register on the app
  await registerRoutes(app as any);
  serveStatic(app as any);
  initialized = true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureInitialized();
  // Delegate handling to Express
  (app as any)(req, res);
}


