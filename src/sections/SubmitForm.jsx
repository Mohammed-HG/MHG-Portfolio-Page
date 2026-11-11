import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/SubmitForm.css";
export default function ContactForm({ copy, language }) {
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
        message: "unavailable",
      });
      return;
    }
    const token = captcha.current?.getValue();
    if (!token) {
      setStatus({
        type: "error",
        message: "verify",
      });
      return;
    }
    inFlight.current = true;
    setStatus({ type: "sending", message: "sending" });
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
      if (!response.ok || !result.ok) {
        setStatus({
          type: "error",
          message:
            response.status === 429
              ? "rateLimit"
              : response.status === 400 &&
                  result.error ===
                    "Please complete a new verification and try again."
                ? "verifyAgain"
                : "delivery",
          detail: result.error,
        });
        return;
      }
      form.reset();
      setStatus({
        type: "success",
        message: "success",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.name === "TimeoutError"
            ? "timeout"
            : error.name === "TypeError"
              ? "network"
              : "delivery",
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
        <p className="eyebrow">{copy.contactKicker}</p>
        <h2 id="contact-title">
          {copy.contactTitle}
          <br />
          <span>{copy.contactTitleLine}</span>
        </h2>
        <p>{copy.contactDesc}</p>
        <a
          className="text-link"
          href="https://www.linkedin.com/in/mohammed-al-ghareeb/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.contactLink}
        </a>
      </div>
      <form
        className="message-form"
        onSubmit={submit}
        aria-label={copy.form}
        aria-busy={status.type === "sending"}
      >
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="contact-name">{copy.yourName}</label>
            <input
              id="contact-name"
              name="name"
              dir="auto"
              autoComplete="name"
              placeholder={copy.namePlaceholder}
              minLength={1}
              maxLength={120}
              required
              disabled={status.type === "sending"}
            />
          </div>
          <div className="form-field">
            <label htmlFor="contact-email">{copy.email}</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="you@example.com"
              maxLength={254}
              required
              disabled={status.type === "sending"}
            />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="contact-message">{copy.yourMessage}</label>
          <textarea
            id="contact-message"
            name="message"
            dir="auto"
            rows={5}
            placeholder={copy.messagePlaceholder}
            minLength={1}
            maxLength={2000}
            required
            disabled={status.type === "sending"}
          />
          <span className="field-help">{copy.limit}</span>
        </div>
        <div hidden aria-hidden="true">
          <label htmlFor="contact-website">{copy.blank}</label>
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
              key={language + captchaSize}
              hl={language}
              size={captchaSize}
              ref={captcha}
              sitekey={siteKey}
              theme="dark"
              onExpired={() =>
                setStatus({
                  type: "error",
                  message: "expired",
                })
              }
              onErrored={() =>
                setStatus({
                  type: "error",
                  message: "captchaError",
                })
              }
            />
          </div>
        ) : (
          <p className="form-notice">{copy.mailPending}</p>
        )}
        {siteKey && !contactEnabled && (
          <p className="form-notice">{copy.mailNotice}</p>
        )}
        <button
          className="button button-primary submit-button"
          type="submit"
          disabled={!siteKey || !contactEnabled || status.type === "sending"}
        >
          {status.type === "sending" ? copy.sendingButton : copy.sendButton}
        </button>
        <div
          className={"form-status status-" + status.type}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {(language === "en" && status.detail) || copy[status.message]}
        </div>
        <p className="privacy-note">
          {copy.privacyNote}
          {siteKey && (
            <>
              {" "}
              {copy.captchaNote}{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.privacy}
              </a>{" "}
              ·{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.terms}
              </a>
              .
            </>
          )}
        </p>
      </form>
    </div>
  );
}
