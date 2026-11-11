import { translations } from "./translations";
import { useEffect, useRef, useState } from "react";
import "./styles/App.css";
import BurgerMenu from "./components/BurgerMenu";
import ContactForm from "./sections/SubmitForm";
import SocialLinks from "./sections/socialLinks";
import AboutMe from "./sections/aboutMeSection";
import Certifications from "./sections/CertificationSection";
import Projects from "./sections/projectsSection";
const tabs = ["Projects", "Certificates", "SocialLinks"];
const languageKey = "portfolio-language";

function getLanguage() {
  try {
    return localStorage.getItem(languageKey) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}
export default function Portfolio() {
  const [language, setLanguage] = useState(getLanguage);
  const copy = translations[language];
  const rtl = language === "ar";
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.title = copy.pageTitle;
    try {
      localStorage.setItem(languageKey, language);
    } catch {
      // Language switching still works when storage is unavailable.
    }
  }, [language, rtl, copy]);
  const [active, setActive] = useState(
    () => tabs.find((tab) => "#" + tab === window.location.hash) || "Projects",
  );
  const buttons = useRef([]);
  useEffect(() => {
    let id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    if (id)
      document
        .getElementById(id)
        ?.scrollIntoView?.({ block: "start", behavior: "instant" });
  }, []);
  function navigateTabs(event, index) {
    const offsets = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 };
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : event.key in offsets
            ? (index + offsets[event.key] + tabs.length) % tabs.length
            : null;
    if (next === null) return;
    event.preventDefault();
    setActive(tabs[next]);
    buttons.current[next]?.focus();
  }
  return (
    <>
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>
      <header className="site-header">
        <nav className="navbar" aria-label={copy.nav}>
          <a className="brand" href="#About">
            <span className="brand-symbol" aria-hidden="true">
              &lt;/&gt;
            </span>
            <span>
              MHG<span className="brand-detail">{copy.portfolio}</span>
            </span>
          </a>
          <div className="nav-actions">
            <button
              className="menu-trigger language-switch"
              type="button"
              lang={rtl ? "en" : "ar"}
              onClick={() => setLanguage(rtl ? "en" : "ar")}
            >
              {rtl ? "English" : "العربية"}
            </button>
            <BurgerMenu copy={copy} />
          </div>
        </nav>
      </header>
      <main id="main-content">
        <section id="About" className="hero">
          <AboutMe copy={copy} />
        </section>
        <section
          id="Work"
          className="work-section section-shell"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">{copy.workKicker}</p>
              <h2 id="work-title">{copy.workTitle}</h2>
            </div>
            <span className="section-number" aria-hidden="true">
              {copy.workIndex}
            </span>
          </div>
          <div className="work-surface">
            <div
              className="work-tabs"
              role="tablist"
              aria-label={copy.tabsLabel}
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  ref={(element) => {
                    buttons.current[index] = element;
                  }}
                  id={"tab-" + tab}
                  type="button"
                  role="tab"
                  aria-selected={active === tab}
                  aria-controls={tab}
                  tabIndex={active === tab ? 0 : -1}
                  onClick={() => setActive(tab)}
                  onKeyDown={(event) => navigateTabs(event, index)}
                >
                  {copy[tab]}
                </button>
              ))}
            </div>
            <div
              id="Projects"
              role="tabpanel"
              aria-labelledby="tab-Projects"
              hidden={active !== "Projects"}
              tabIndex={0}
            >
              <Projects copy={copy} />
            </div>
            <div
              id="Certificates"
              role="tabpanel"
              aria-labelledby="tab-Certificates"
              hidden={active !== "Certificates"}
              tabIndex={0}
            >
              <Certifications copy={copy} />
            </div>
            <div
              id="SocialLinks"
              role="tabpanel"
              aria-labelledby="tab-SocialLinks"
              hidden={active !== "SocialLinks"}
              tabIndex={0}
            >
              <SocialLinks copy={copy} />
            </div>
          </div>
        </section>
        <section
          id="Contact"
          className="contact-section section-shell"
          aria-labelledby="contact-title"
        >
          <ContactForm copy={copy} language={language} />
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a className="brand" href="#About">
          MHG<span className="brand-detail">{copy.portfolio}</span>
        </a>
        <p>{copy.footer}</p>
        <a
          href="https://github.com/Mohammed-HG"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </footer>
    </>
  );
}
