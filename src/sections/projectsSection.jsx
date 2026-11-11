import "../styles/Projects.css";
export default function Projects({ copy }) {
  return (
    <div className="project-list">
      <article className="project-layout">
        <div className="project-visual" aria-hidden="true">
          <div className="qr-mark">
            <svg viewBox="0 0 120 120">
              <path d="M10 10h30v30H10zM80 10h30v30H80zM10 80h30v30H10z" />
              <path d="M20 20h10v10H20zM90 20h10v10H90zM20 90h10v10H20zM55 10v15M55 40v20h25M10 55h30M55 80v30M80 55h30M80 80h10v15h20v15M105 65v10M70 100h10" />
            </svg>
          </div>
          <span className="visual-label">{copy.qrVisual}</span>
        </div>
        <div className="project-copy">
          <p className="eyebrow">{copy.featured}</p>
          <h3>{copy.qrTitle}</h3>
          <p>{copy.qrDesc}</p>
          <ul className="technology-tags" aria-label={copy.tech}>
            <li>React</li>
            <li>Node.js</li>
            <li>MySQL</li>
          </ul>
          <div className="project-links">
            <a
              className="button button-primary"
              href="https://mhg-qr-code-generator.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.live}
            </a>
            <a
              className="text-link"
              href="https://github.com/Mohammed-HG/QR-Code-Project"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.source}
            </a>
          </div>
        </div>
      </article>
      <article className="project-layout">
        <div className="project-visual desktop-visual" aria-hidden="true">
          <div className="desktop-preview" dir="ltr">
            <div className="desktop-preview-bar">
              <i />
              <i />
              <i />
            </div>
            <div className="desktop-preview-icons">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
        <div className="project-copy">
          <p className="eyebrow">{copy.desktopKicker}</p>
          <h3>{copy.desktopTitle}</h3>
          <p>{copy.desktopDesc}</p>
          <ul className="technology-tags" aria-label={copy.tech}>
            <li>{copy.desktopPlatform}</li>
          </ul>
          <div className="project-links">
            <a
              className="text-link"
              href="https://github.com/Mohammed-HG/win-desktop-pop-up-folder-project"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.desktopLink}
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
