const express = require("express");
const helmet = require("helmet");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { createContactRouter } = require("./routes/contact");
const { signedProxy } = require("./proxy");

function createApp({ config, mailer, verifyCaptcha, logger = console }) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", config.trustProxyHops);
  app.use(helmet());
  app.use(express.json({ limit: "10kb", strict: true }));
  app.get("/healthz", (_req, res) => res.json({ status: "ok" }));
  app.get("/readyz", (_req, res) =>
    res
      .status(mailer.ready && config.captchaSecret ? 200 : 503)
      .json({ ready: Boolean(mailer.ready && config.captchaSecret) }),
  );
  app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use("/api", signedProxy(config));
  app.use(
    "/api",
    rateLimit({
      windowMs: 60000,
      limit: 60,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      keyGenerator: (req) => ipKeyGenerator(req.trustedClientIp || req.ip),
      message: { error: "Too many requests. Please try again later." },
    }),
  );
  app.use(
    "/api/contact",
    createContactRouter({ config, mailer, verifyCaptcha, logger }),
  );
  app.use((_req, res) => res.status(404).json({ error: "Not found." }));
  app.use((error, _req, res, _next) => {
    const status =
      error.type === "entity.too.large"
        ? 413
        : error.type === "entity.parse.failed"
          ? 400
          : 500;
    if (status === 500) logger.error("Request failed: internal_error");
    res
      .status(status)
      .json({
        error:
          status === 413
            ? "Message is too large."
            : status === 400
              ? "Invalid JSON."
              : "Service temporarily unavailable.",
      });
  });
  return app;
}
module.exports = { createApp };
