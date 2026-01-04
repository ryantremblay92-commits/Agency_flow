import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

// Critical Railway Health Check - Must be at the top level
app.get("/api/health", (req, res) => {
  console.log(`[health] Railway health check request received from ${req.headers['x-forwarded-for'] || req.ip} at ${new Date().toISOString()}`);
  res.status(200).json({
    status: "OK",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

// START LISTENING IMMEDIATELY for Railway health check
const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen(
  {
    port,
    host: "0.0.0.0",
  },
  () => {
    log(`serving on port ${port} (Ready for health checks)`);

    // Continue loading application routes and logic in the background
    (async () => {
      try {
        await registerRoutes(httpServer, app);

        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";

          res.status(status).json({ message });
          throw err;
        });

        // importantly only setup vite in development and after
        // setting up all the other routes so the catch-all route
        // doesn't interfere with the other routes
        if (process.env.NODE_ENV === "production") {
          serveStatic(app);
          log("Static files serving enabled (production mode)");
        } else {
          const { setupVite } = await import("./vite");
          await setupVite(httpServer, app);
          log("Vite development server enabled");
        }
      } catch (error) {
        log(`CRITICAL ERROR DURING INITIALIZATION: ${error instanceof Error ? error.message : String(error)}`, "error");
      }
    })();
  },
);
