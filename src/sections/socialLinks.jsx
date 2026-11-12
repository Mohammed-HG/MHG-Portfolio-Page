import "../styles/SocialLinks.css";
import githubLogo from "../assets/github-logo.png";
import profile from "../assets/MHG_ProfileImg.jpg";
export default function SocialLinks({ copy }) {
  return (
    <div className="social-layout">
      <div className="social-profile">
        <img
          src={profile}
          width="112"
          height="112"
          className="social-avatar"
          alt={copy.name}
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className="eyebrow">{copy.socialKicker}</p>
          <h3>{copy.name}</h3>
          <p>
            {copy.socialRole} · <bdi>Mohammed-HG</bdi>
          </p>
        </div>
      </div>
      <div className="social-links">
        <a
          href="https://github.com/Mohammed-HG"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="social-icon github-icon"
            src={githubLogo}
            alt=""
            width="36"
            height="36"
          />
          <span className="social-link-copy">
            <strong>GitHub</strong>
            <small>{copy.github}</small>
          </span>
          <span aria-hidden="true">↗</span>
        </a>
        <a
          href="https://www.linkedin.com/in/mohammed-al-ghareeb/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="social-icon linkedin-icon" aria-hidden="true">
            in
          </span>
          <span className="social-link-copy">
            <strong>LinkedIn</strong>
            <small>{copy.linkedin}</small>
          </span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
