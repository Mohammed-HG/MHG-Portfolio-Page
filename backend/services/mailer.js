const nodemailer = require("nodemailer");
function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
}
function createMailer(env = process.env) {
  const password = env.SMTP_PASS || env.SMTP_PASSWORD;
  const ready = Boolean(
    env.SMTP_HOST &&
    env.SMTP_USER &&
    password &&
    env.FROM_EMAIL &&
    env.TO_EMAIL,
  );
  if (!ready)
    return {
      ready: false,
      send: async () => {
        throw new Error("Mail is not configured.");
      },
    };
  const port = Number(env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("Invalid SMTP port.");
  const secure = env.SMTP_SECURE === "true";
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure,
    auth: { user: env.SMTP_USER, pass: password },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    tls: { rejectUnauthorized: true },
    logger: false,
    debug: false,
  });
  return {
    ready: true,
    async send({ name, email, message }) {
      await transporter.sendMail({
        from: env.FROM_EMAIL,
        to: env.TO_EMAIL,
        replyTo: email,
        subject: "Portfolio message from " + name,
        text: "From: " + name + " <" + email + ">\n\n" + message,
        html:
          "<p><strong>From:</strong> " +
          escapeHtml(name) +
          " &lt;" +
          escapeHtml(email) +
          "&gt;</p><p>" +
          escapeHtml(message).replace(/\n/g, "<br>") +
          "</p>",
        disableFileAccess: true,
        disableUrlAccess: true,
      });
    },
    close: () => transporter.close(),
  };
}
module.exports = { createMailer, escapeHtml };
