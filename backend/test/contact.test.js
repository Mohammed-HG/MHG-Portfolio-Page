const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
const { createApp } = require("../app");
const { configFromEnv } = require("../config");
const { escapeHtml } = require("../services/mailer");
const origin = "https://mohammed-hg-portfolio.netlify.app";
const valid = {
  name: "A visitor",
  email: "visitor@example.com",
  message: "Hello there",
  recaptchaToken: "test-token",
};
async function fixture(run, overrides = {}) {
  let sent = 0;
  const config = {
    origin,
    trustProxyHops: 0,
    captchaSecret: "test-secret",
    captchaHosts: ["mohammed-hg-portfolio.netlify.app"],
    ...overrides.config,
  };
  const app = createApp({
    config,
    mailer: {
      ready: true,
      send: async () => {
        sent++;
      },
      ...overrides.mailer,
    },
    verifyCaptcha:
      overrides.verifyCaptcha ||
      (async () => ({ success: true, hostname: config.captchaHosts[0] })),
    logger: { error() {}, warn() {} },
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  const post = (data = valid, headers = {}) =>
    fetch(base + "/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
        ...headers,
      },
      body: JSON.stringify(data),
    });
  try {
    await run({ post, base, sent: () => sent });
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
test("a valid message is delivered once and APIs are not cached", () =>
  fixture(async ({ post, sent }) => {
    const response = await post();
    assert.equal(response.status, 200);
    assert.equal(sent(), 1);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  }));
test("missing mail or CAPTCHA configuration fails closed", async () => {
  await fixture(
    async ({ post, sent }) => {
      assert.equal((await post()).status, 503);
      assert.equal(sent(), 0);
    },
    { config: { captchaSecret: "" } },
  );
  await fixture(
    async ({ post }) => {
      assert.equal((await post()).status, 503);
    },
    { mailer: { ready: false } },
  );
});
test("wrong CAPTCHA hostname cannot send mail", () =>
  fixture(
    async ({ post, sent }) => {
      assert.equal((await post()).status, 400);
      assert.equal(sent(), 0);
    },
    {
      verifyCaptcha: async () => ({
        success: true,
        hostname: "unrelated.example",
      }),
    },
  ));
test("invalid input, header injection, arrays and oversized tokens are rejected", () =>
  fixture(async ({ post, sent }) => {
    for (const value of [
      { ...valid, name: "Test\r\nBcc: injected" },
      { ...valid, email: "not-an-email" },
      { ...valid, name: ["test"] },
      { ...valid, recaptchaToken: "x".repeat(4097) },
      { ...valid, extra: "unexpected" },
    ]) {
      assert.ok([400, 422].includes((await post(value)).status));
    }
    assert.equal(sent(), 0);
  }));
test("honeypot rejects bots", () =>
  fixture(async ({ post }) =>
    assert.equal((await post({ ...valid, _gotcha: "bot" })).status, 400),
  ));
test("wrong origin is forbidden and valid CORS origin has no trailing slash", () =>
  fixture(async ({ post }) => {
    assert.equal(
      (await post(valid, { Origin: "https://unrelated.example" })).status,
      403,
    );
    assert.equal(
      (await post()).headers.get("access-control-allow-origin"),
      origin,
    );
  }));
test("Google and mail failures return safe errors", async () => {
  for (const overrides of [
    {
      verifyCaptcha: async () => {
        throw new Error("secret must never be returned");
      },
    },
    {
      mailer: {
        send: async () => {
          throw new Error("private SMTP details");
        },
      },
    },
  ]) {
    await fixture(async ({ post }) => {
      const result = await post();
      assert.equal(result.status, 503);
      assert.doesNotMatch(await result.text(), /private|secret must/);
    }, overrides);
  }
});
test("size limit and malformed JSON return controlled JSON errors", () =>
  fixture(async ({ base }) => {
    for (const [body, expected] of [
      ["{", 400],
      [JSON.stringify({ message: "x".repeat(12000) }), 413],
    ]) {
      const result = await fetch(base + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      assert.equal(result.status, expected);
      assert.match(result.headers.get("content-type"), /json/);
    }
  }));
test("contact rate limit applies after five requests", () =>
  fixture(async ({ post }) => {
    for (let i = 0; i < 5; i++) assert.equal((await post()).status, 200);
    assert.equal((await post()).status, 429);
  }));
function sign(claims, secret) {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return (
    header +
    "." +
    payload +
    "." +
    createHmac("sha256", secret)
      .update(header + "." + payload)
      .digest("base64url")
  );
}
test("signed proxy blocks direct, expired, forged and foreign-site requests", () =>
  fixture(
    async ({ post }) => {
      const claims = {
        iss: "netlify",
        exp: Math.floor(Date.now() / 1000) + 60,
        site_url: origin,
        deploy_context: "production",
      };
      for (const token of [
        "",
        sign(claims, "wrong"),
        sign({ ...claims, exp: 1 }, "proxy-secret"),
        sign(
          { ...claims, site_url: "https://unrelated.example" },
          "proxy-secret",
        ),
        sign({ ...claims, deploy_context: "deploy-preview" }, "proxy-secret"),
      ]) {
        assert.equal((await post(valid, { "x-nf-sign": token })).status, 403);
      }
    },
    { config: { proxySecret: "proxy-secret", requireSignedProxy: true } },
  ));
test("verified proxy isolates visitors and ignores client IP headers without valid signatures", () =>
  fixture(
    async ({ post }) => {
      const token = sign(
        {
          iss: "netlify",
          exp: Math.floor(Date.now() / 1000) + 60,
          site_url: origin,
          deploy_context: "production",
        },
        "proxy-secret",
      );
      for (let i = 0; i < 5; i++)
        assert.equal(
          (
            await post(valid, {
              "x-nf-sign": token,
              "x-nf-client-connection-ip": "198.51.100.1",
            })
          ).status,
          200,
        );
      assert.equal(
        (
          await post(valid, {
            "x-nf-sign": token,
            "x-nf-client-connection-ip": "198.51.100.1",
          })
        ).status,
        429,
      );
      assert.equal(
        (
          await post(valid, {
            "x-nf-sign": token,
            "x-nf-client-connection-ip": "203.0.113.1",
          })
        ).status,
        200,
      );
      assert.equal(
        (
          await post(valid, {
            "x-nf-sign": "forged",
            "x-nf-client-connection-ip": "203.0.113.2",
          })
        ).status,
        403,
      );
    },
    { config: { proxySecret: "proxy-secret", requireSignedProxy: true } },
  ));
test("configuration normalization and HTML escaping protect boundaries", () => {
  assert.equal(configFromEnv({ CLIENT_ORIGIN: origin + "/" }).origin, origin);
  assert.throws(() =>
    configFromEnv({
      NODE_ENV: "production",
      CLIENT_ORIGIN: "http://example.com",
    }),
  );
  assert.throws(() => configFromEnv({ TRUST_PROXY_HOPS: "true" }));
  assert.equal(escapeHtml('<script>&"'), "&lt;script&gt;&amp;&quot;");
});
