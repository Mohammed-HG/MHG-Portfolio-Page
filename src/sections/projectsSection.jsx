import "../styles/Projects.css";
export default function Projects() {
  return (
    <div className="project-layout">
      <div className="project-visual" aria-hidden="true">
        <div className="qr-mark">
          <svg viewBox="0 0 120 120">
            <path d="M10 10h30v30H10zM80 10h30v30H80zM10 80h30v30H10z" />
            <path d="M20 20h10v10H20zM90 20h10v10H90zM20 90h10v10H20zM55 10v15M55 40v20h25M10 55h30M55 80v30M80 55h30M80 80h10v15h20v15M105 65v10M70 100h10" />
          </svg>
        </div>
        <span className="visual-label">MAKE IT SCANNABLE.</span>
      </div>
      <div className="project-copy">
        <p className="eyebrow">FEATURED PROJECT</p>
        <h3>QR Code Generator</h3>
        <p>
          A customizable QR code tool for links, text, Wi-Fi networks and
          locations. Choose patterns, colors, icons and an optional caption,
          then download your code.
        </p>
        <ul className="technology-tags" aria-label="Project technologies">
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
            View live project ↗
          </a>
          <a
            className="text-link"
            href="https://github.com/Mohammed-HG/QR-Code-Project"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source code ↗
          </a>
        </div>
      </div>
    </div>
  );
}
