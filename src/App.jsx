import { useRef, useState } from "react";
import "./styles/App.css";
import BurgerMenu from "./components/BurgerMenu";
import ContactForm from "./sections/SubmitForm";
import SocialLinks from "./sections/socialLinks";
import AboutMe from "./sections/aboutMeSection";
import Certifications from "./sections/CertificationSection";
import Projects from "./sections/projectsSection";
const tabs = [
  { id: "Projects", label: "Projects" },
  { id: "Certificates", label: "Certificates" },
  { id: "SocialLinks", label: "Connect" },
];
export default function Portfolio() {
  const [active, setActive] = useState("Projects");
  const buttons = useRef([]);
  function navigateTabs(event, index) {
    const offsets = { ArrowRight: 1, ArrowLeft: -1 };
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
    setActive(tabs[next].id);
    buttons.current[next]?.focus();
  }
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <nav className="navbar" aria-label="Main navigation">
          <a className="brand" href="#About">
            <span className="brand-symbol" aria-hidden="true">
              &lt;/&gt;
            </span>
            <span>
              MHG<span className="brand-detail"> / Portfolio</span>
            </span>
          </a>
          <BurgerMenu />
        </nav>
      </header>
      <main id="main-content">
        <section id="About" className="hero">
          <AboutMe />
        </section>
        <section
          id="Work"
          className="work-section section-shell"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">BUILD. LEARN. IMPROVE.</p>
              <h2 id="work-title">A look at my work</h2>
            </div>
            <span className="section-number" aria-hidden="true">
              01 / WORK
            </span>
          </div>
          <div className="work-surface">
            <div
              className="work-tabs"
              role="tablist"
              aria-label="Explore my portfolio"
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(element) => {
                    buttons.current[index] = element;
                  }}
                  id={"tab-" + tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active === tab.id}
                  aria-controls={tab.id}
                  tabIndex={active === tab.id ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  onKeyDown={(event) => navigateTabs(event, index)}
                >
                  {tab.label}
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
              <Projects />
            </div>
            <div
              id="Certificates"
              role="tabpanel"
              aria-labelledby="tab-Certificates"
              hidden={active !== "Certificates"}
              tabIndex={0}
            >
              <Certifications />
            </div>
            <div
              id="SocialLinks"
              role="tabpanel"
              aria-labelledby="tab-SocialLinks"
              hidden={active !== "SocialLinks"}
              tabIndex={0}
            >
              <SocialLinks />
            </div>
          </div>
        </section>
        <section
          id="Contact"
          className="contact-section section-shell"
          aria-labelledby="contact-title"
        >
          <ContactForm />
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a className="brand" href="#About">
          MHG<span className="brand-detail"> / Portfolio</span>
        </a>
        <p>Built with curiosity. Improved with every project.</p>
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
