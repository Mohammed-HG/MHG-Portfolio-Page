import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Portfolio from "./App";
vi.mock("react-google-recaptcha", async () => {
  const { useImperativeHandle } = await import("react");
  return {
    default: function Captcha({ ref }) {
      useImperativeHandle(ref, () => ({
        getValue: () => "test-token",
        reset: vi.fn(),
      }));
      return <span>Test verification</span>;
    },
  };
});
beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.stubEnv("VITE_RECAPTCHA_SITE_KEY", "");
  vi.stubEnv("VITE_CONTACT_ENABLED", "true");
});
test("direct section links select the matching tab after the app mounts", () => {
  window.history.replaceState(null, "", "/#Certificates");
  render(<Portfolio />);
  expect(
    screen
      .getByRole("tab", { name: "Certificates" })
      .getAttribute("aria-selected"),
  ).toBe("true");
  expect(
    screen.getByRole("heading", { name: "Responsive Web Design" }),
  ).toBeTruthy();
});
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
test("a configured CAPTCHA does not enable delivery before the mail provider is ready", () => {
  vi.stubEnv("VITE_RECAPTCHA_SITE_KEY", "test-site-key");
  vi.stubEnv("VITE_CONTACT_ENABLED", "false");
  render(<Portfolio />);
  expect(screen.getByRole("button", { name: "Send message ↗" }).disabled).toBe(
    true,
  );
  expect(screen.getByText(/Email delivery is being configured/)).toBeTruthy();
});
test("navigation closes on link selection and Escape, and hidden links are not accessible", async () => {
  const user = userEvent.setup();
  render(<Portfolio />);
  expect(screen.queryByRole("link", { name: /About me/ })).toBeNull();
  await user.click(screen.getByRole("button", { name: "Menu" }));
  await user.click(screen.getByRole("link", { name: /About me/ }));
  expect(
    screen.getByRole("button", { name: "Menu" }).getAttribute("aria-expanded"),
  ).toBe("false");
  await user.click(screen.getByRole("button", { name: "Menu" }));
  await user.keyboard("{Escape}");
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: "Menu" }),
  );
});
test("tabs show matching content and support arrow-key navigation", async () => {
  const user = userEvent.setup();
  render(<Portfolio />);
  expect(
    screen.getByRole("tab", { name: "Projects" }).getAttribute("aria-selected"),
  ).toBe("true");
  expect(
    screen.getByRole("heading", { name: "QR Code Generator" }),
  ).toBeTruthy();
  screen.getByRole("tab", { name: "Projects" }).focus();
  await user.keyboard("{ArrowRight}");
  expect(
    screen
      .getByRole("tab", { name: "Certificates" })
      .getAttribute("aria-selected"),
  ).toBe("true");
  expect(
    screen.queryByRole("heading", { name: "QR Code Generator" }),
  ).toBeNull();
  await user.keyboard("{End}");
  expect(
    screen.getByRole("heading", { name: "Mohammed Alghareeb" }),
  ).toBeTruthy();
});
test("section IDs are unique and primary content has one H1", () => {
  render(<Portfolio />);
  const ids = Array.from(
    document.querySelectorAll("[id]"),
    (element) => element.id,
  );
  expect(new Set(ids).size).toBe(ids.length);
  expect(document.querySelectorAll("h1").length).toBe(1);
  expect(screen.getByRole("link", { name: "View live project ↗" }).href).toBe(
    "https://mhg-qr-code-generator.netlify.app/",
  );
});
test("missing CAPTCHA configuration offers LinkedIn and disables email submission", () => {
  render(<Portfolio />);
  expect(screen.getByRole("button", { name: "Send message ↗" }).disabled).toBe(
    true,
  );
  expect(screen.getByText(/Email contact is being configured/)).toBeTruthy();
});
async function fillContact(user) {
  await user.type(screen.getByLabelText("Your name"), "Test visitor");
  await user.type(
    screen.getByLabelText("Email address"),
    "visitor@example.com",
  );
  await user.type(
    screen.getByLabelText("Your message"),
    "A local test message",
  );
}
test("submission blocks concurrent sends and announces successful delivery", async () => {
  vi.stubEnv("VITE_RECAPTCHA_SITE_KEY", "test-site-key");
  let resolve;
  const request = vi.fn(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  vi.stubGlobal("fetch", request);
  const user = userEvent.setup();
  render(<Portfolio />);
  await fillContact(user);
  await user.click(screen.getByRole("button", { name: "Send message ↗" }));
  expect(screen.getByRole("button", { name: "Sending…" }).disabled).toBe(true);
  fireEvent.submit(screen.getByRole("form", { name: "Send a message" }));
  expect(request).toHaveBeenCalledTimes(1);
  resolve({ ok: true, json: async () => ({ ok: true }) });
  await waitFor(() =>
    expect(screen.getByRole("status").textContent).toContain("has been sent"),
  );
});
test("delivery errors remain visible without showing a false success", async () => {
  vi.stubEnv("VITE_RECAPTCHA_SITE_KEY", "test-site-key");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: false,
      json: async () => ({ error: "Please try again later." }),
    })),
  );
  const user = userEvent.setup();
  render(<Portfolio />);
  await fillContact(user);
  await user.click(screen.getByRole("button", { name: "Send message ↗" }));
  await waitFor(() =>
    expect(screen.getByRole("status").textContent).toBe(
      "Please try again later.",
    ),
  );
});
