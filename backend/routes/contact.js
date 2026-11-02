const express = require("express");
const { body, validationResult } = require("express-validator");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

function createContactRouter({ config, mailer, verifyCaptcha, logger }) {
  const router = express.Router();
  router.use((req, res, next) => {
    if (req.get("Origin") && req.get("Origin") !== config.origin)
      return res.status(403).json({ error: "This origin is not allowed." });
    if (req.get("Origin") === config.origin)
      res.set("Access-Control-Allow-Origin", config.origin).vary("Origin");
    if (req.method === "OPTIONS")
      return res
        .set("Access-Control-Allow-Methods", "POST")
        .set("Access-Control-Allow-Headers", "Content-Type")
        .sendStatus(204);
    next();
  });
  router.post(
    "/",
    rateLimit({
      windowMs: 3600000,
      limit: 5,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      keyGenerator: (req) => ipKeyGenerator(req.trustedClientIp || req.ip),
      message: { error: "Too many messages. Please try again in an hour." },
    }),
    (req, res, next) => {
      if (!req.is("application/json"))
        return res.status(415).json({ error: "Use JSON for this request." });
      if (
        !req.body ||
        Array.isArray(req.body) ||
        Object.keys(req.body).some(
          (key) =>
            !["name", "email", "message", "recaptchaToken", "_gotcha"].includes(
              key,
            ),
        )
      )
        return res.status(400).json({ error: "Invalid input." });
      if (req.body._gotcha)
        return res.status(400).json({ error: "Invalid input." });
      if (!config.captchaSecret || !mailer.ready)
        return res
          .status(503)
          .json({
            error:
              "Contact form is temporarily unavailable. Please use LinkedIn instead.",
          });
      next();
    },
    body("name")
      .isString()
      .bail()
      .trim()
      .isLength({ min: 1, max: 120 })
      .bail()
      .custom((value) => !/[\r\n\x00]/.test(value)),
    body("email")
      .isString()
      .bail()
      .trim()
      .isLength({ max: 254 })
      .bail()
      .isEmail()
      .bail()
      .custom((value) => !/[\r\n\x00]/.test(value)),
    body("message").isString().bail().trim().isLength({ min: 1, max: 2000 }),
    body("recaptchaToken").isString().bail().isLength({ min: 1, max: 4096 }),
    async (req, res) => {
      if (!validationResult(req).isEmpty())
        return res
          .status(422)
          .json({ error: "Please check your name, email and message." });
      let result;
      try {
        result = await verifyCaptcha(req.body.recaptchaToken);
      } catch {
        logger.warn("Contact verification unavailable.");
        return res
          .status(503)
          .json({
            error:
              "Verification is temporarily unavailable. Please try again later.",
          });
      }
      if (!result.success || !config.captchaHosts.includes(result.hostname))
        return res
          .status(400)
          .json({ error: "Please complete a new verification and try again." });
      const { name, email, message } = req.body;
      try {
        await mailer.send({ name, email, message });
        return res.json({ ok: true });
      } catch {
        logger.error("Contact delivery failed.");
        return res
          .status(503)
          .json({
            error:
              "Message delivery is temporarily unavailable. Please use LinkedIn instead.",
          });
      }
    },
  );
  return router;
}
module.exports = { createContactRouter };
