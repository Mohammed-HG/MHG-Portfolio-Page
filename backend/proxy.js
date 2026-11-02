const { createHmac, timingSafeEqual } = require("node:crypto");
const { isIP } = require("node:net");
function signedProxy(config) {
  return (req, res, next) => {
    if (!config.proxySecret)
      return config.requireSignedProxy
        ? res
            .status(503)
            .json({ error: "Contact form is temporarily unavailable." })
        : next();
    try {
      const token = req.get("x-nf-sign") || "";
      if (token.length > 8192) throw new Error("Invalid token.");
      const parts = token.split(".");
      if (parts.length !== 3 || parts.some((part) => !/^[\w-]+$/.test(part)))
        throw new Error("Invalid token.");
      const header = JSON.parse(Buffer.from(parts[0], "base64url"));
      const claims = JSON.parse(Buffer.from(parts[1], "base64url"));
      const signature = Buffer.from(parts[2], "base64url");
      const expected = createHmac("sha256", config.proxySecret)
        .update(parts[0] + "." + parts[1])
        .digest();
      if (
        header.alg !== "HS256" ||
        signature.length !== expected.length ||
        !timingSafeEqual(signature, expected) ||
        !Number.isInteger(claims.exp) ||
        claims.exp <= Date.now() / 1000 ||
        claims.iss !== "netlify" ||
        claims.site_url !== config.origin ||
        claims.deploy_context !== "production"
      )
        throw new Error("Invalid token.");
      const clientIp = req.get("x-nf-client-connection-ip");
      if (clientIp && isIP(clientIp)) req.trustedClientIp = clientIp;
      next();
    } catch {
      res.status(403).json({ error: "Untrusted proxy request." });
    }
  };
}
module.exports = { signedProxy };
