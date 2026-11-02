function configFromEnv(env = process.env) {
  const raw = (
    env.CLIENT_ORIGIN || "https://mohammed-hg-portfolio.netlify.app"
  ).replace(/\/$/, "");
  const parsed = new URL(raw);
  if (
    parsed.origin !== raw ||
    !["https:", "http:"].includes(parsed.protocol) ||
    (env.NODE_ENV === "production" && parsed.protocol !== "https:")
  )
    throw new Error("CLIENT_ORIGIN must be an exact HTTPS origin.");
  const trustProxyHops = Number(env.TRUST_PROXY_HOPS || 1);
  const port = Number(env.PORT || 5000);
  if (
    !Number.isInteger(trustProxyHops) ||
    trustProxyHops < 0 ||
    trustProxyHops > 2 ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  )
    throw new Error("Invalid port or proxy configuration.");
  const captchaHosts = (env.RECAPTCHA_ALLOWED_HOSTNAMES || parsed.hostname)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return {
    origin: parsed.origin,
    trustProxyHops,
    port,
    captchaHosts,
    captchaSecret: env.RECAPTCHA_SECRET_KEY || "",
    proxySecret: env.PORTFOLIO_PROXY_SECRET || "",
    requireSignedProxy: env.NODE_ENV === "production",
  };
}
module.exports = { configFromEnv };
