import "../styles/Cert.css";
import certificate from "../assets/freecodecamCert.jpg";
export default function Certifications({ copy }) {
  return (
    <div className="certificate-layout">
      <a
        className="certificate-image-link"
        href="https://www.freecodecamp.org/certification/mohammed-hg/responsive-web-design"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.certLabel}
      >
        <img
          src={certificate}
          width="1625"
          height="1016"
          alt={copy.certAlt}
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="certificate-copy">
        <p className="eyebrow">{copy.certKicker}</p>
        <span className="certificate-badge">freeCodeCamp</span>
        <h3>{copy.certTitle}</h3>
        <p>{copy.certDescription}</p>
        <a
          className="button button-secondary"
          href="https://www.freecodecamp.org/certification/mohammed-hg/responsive-web-design"
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.certLink}
        </a>
      </div>
    </div>
  );
}
