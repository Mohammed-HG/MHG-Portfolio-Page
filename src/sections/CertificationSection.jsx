import "../styles/Cert.css";
import certificate from "../assets/freecodecamCert.jpg";
export default function Certifications() {
  return (
    <div className="certificate-layout">
      <a
        className="certificate-image-link"
        href="https://www.freecodecamp.org/certification/mohammed-hg/responsive-web-design"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View my Responsive Web Design certificate"
      >
        <img
          src={certificate}
          width="1625"
          height="1016"
          alt="Mohammed Alghareeb's freeCodeCamp Responsive Web Design certificate"
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="certificate-copy">
        <p className="eyebrow">LEARNING MILESTONE</p>
        <span className="certificate-badge">freeCodeCamp</span>
        <h3>Responsive Web Design</h3>
        <p>
          A foundation in HTML, CSS and building layouts that adapt to different
          screens.
        </p>
        <a
          className="button button-secondary"
          href="https://www.freecodecamp.org/certification/mohammed-hg/responsive-web-design"
          target="_blank"
          rel="noopener noreferrer"
        >
          View verified certificate ↗
        </a>
      </div>
    </div>
  );
}
