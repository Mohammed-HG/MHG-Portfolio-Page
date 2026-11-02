import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/SubmitForm.css";
export default function ContactForm() {
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const captcha = useRef(null),
    inFlight = useRef(false);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const contactEnabled = import.meta.env.VITE_CONTACT_ENABLED === "true";
  const [captchaSize, setCaptchaSize] = useState(() =>
    window.matchMedia?.("(max-width: 600px)")?.matches ? "compact" : "normal",
  );
  useEffect(() => {
    const media = window.matchMedia?.("(max-width: 600px)");
    if (!media) return;
    const update = (event) =>
      setCaptchaSize(event.matches ? "compact" : "normal");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    if (fields.get("_gotcha")) return;
    if (!siteKey || !contactEnabled) {
      setStatus({
        type: "error",
        message:
          "Contact form is temporarily unavailable. Please use LinkedIn instead.",
      });
      return;
    }
    const token = captcha.current?.getValue();
    if (!token) {
      setStatus({
        type: "error",
        message: "Please complete the verification first.",
      });
      return;
    }
    inFlight.current = true;
    setStatus({ type: "sending", message: "Sending your message…" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name").trim(),
          email: fields.get("email").trim(),
          message: fields.get("message").trim(),
          recaptchaToken: token,
        }),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok)
        throw new Error(
          result.error ||
            "Message delivery is temporarily unavailable. Please try again later.",
        );
      form.reset();
      setStatus({
        type: "success",
        message: "Thanks! Your message has been sent.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.name === "TimeoutError"
            ? "The server took too long to respond. Please try again shortly."
            : error.name === "TypeError"
              ? "Unable to connect. Please check your connection and try again."
              : error.message,
      });
    } finally {
      inFlight.current = false;
      captcha.current?.reset();
      setStatus((value) =>
        value.type === "sending" ? { type: "idle", message: "" } : value,
      );
    }
  }
  return (
    <div className="contact-layout">
      <div className="contact-copy">
        <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
        <h2 id="contact-title">
          Let's start
          <br />
          <span>a conversation.</span>
        </h2>
        <p>
          Have a question about my work or an idea to share? I'd be happy to
          hear from you.
        </p>
        <a
          className="text-link"
          href="https://www.linkedin.com/in/mohammed-al-ghareeb/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect on LinkedIn ↗
        </a>
      </div>
      <form
        className="message-form"
        onSubmit={submit}
        aria-label="Send a message"
        aria-busy={status.type === "sending"}
      >
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="contact-name">Your name</label>
            <input
              id="contact-name"
              name="name"
              autoComplete="name"
              placeholder="How should I call you?"
              minLength={1}
              maxLength={120}
              required
              disabled={status.type === "sending"}
            />
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">Email address</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={254}
              required
              disabled={status.type === "sending"}
            />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="contact-message">Your message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="Tell me a little about it…"
            minLength={1}
            maxLength={2000}
            required
            disabled={status.type === "sending"}
          />
          <span className="field-help">Up to 2,000 characters.</span>
        </div>
        <div hidden aria-hidden="true">
          <label htmlFor="contact-website">Leave this blank</label>
          <input
            id="contact-website"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {siteKey ? (
          <div className="captcha-wrapper">
            <ReCAPTCHA
              key={captchaSize}
              size={captchaSize}
              ref={captcha}
              sitekey={siteKey}
              theme="dark"
              onExpired={() =>
                setStatus({
                  type: "error",
                  message: "Verification expired. Please complete it again.",
                })
              }
              onErrored={() =>
                setStatus({
                  type: "error",
                  message:
                    "Verification could not load. Please use LinkedIn instead.",
                })
              }
            />
          </div>
        ) : (
          <p className="form-notice">
            Email contact is being configured. You can reach me on{" "}
            <a
              href="https://www.linkedin.com/in/mohammed-al-ghareeb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>{" "}
            in the meantime.
          </p>
        )}
        {siteKey && !contactEnabled && (
          <p className="form-notice">
            Email delivery is being configured. Please use the LinkedIn link
            above in the meantime.
          </p>
        )}
        <button
          className="button button-primary submit-button"
          type="submit"
          disabled={!siteKey || !contactEnabled || status.type === "sending"}
        >
          {status.type === "sending" ? "Sending…" : "Send message ↗"}
        </button>
        <div
          className={"form-status status-" + status.type}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {status.message}
        </div>
        <p className="privacy-note">
          Your details are used only to reply to your message.
          {siteKey && (
            <>
              {" "}
              This form uses Google reCAPTCHA.{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy
              </a>{" "}
              ·{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>
              .
            </>
          )}
        </p>
      </form>
    </div>
  );
}
