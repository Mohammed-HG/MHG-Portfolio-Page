require("dotenv").config({ quiet: true });
const { configFromEnv } = require("./config");
const { createMailer } = require("./services/mailer");
const { createApp } = require("./app");
function start() {
  const config = configFromEnv();
  const mailer = createMailer();
  const verifyCaptcha = async (token) => {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: config.captchaSecret,
          response: token,
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) throw new Error("Verification unavailable.");
    return response.json();
  };
  if (!mailer.ready || !config.captchaSecret)
    console.warn(
      "Contact delivery unavailable: complete mail and verification configuration.",
    );
  const app = createApp({ config, mailer, verifyCaptcha });
  const server = app.listen(config.port, "0.0.0.0", () =>
    console.log("Portfolio server listening on " + config.port),
  );
  server.requestTimeout = 20000;
  server.headersTimeout = 10000;
  let closing = false;
  const stop = () => {
    if (closing) return;
    closing = true;
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(() => {
      mailer.close?.();
      clearTimeout(timeout);
    });
  };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
  return server;
}
if (require.main === module) {
  try {
    start();
  } catch {
    console.error("Startup failed: check server configuration.");
    process.exitCode = 1;
  }
}
module.exports = { start };
