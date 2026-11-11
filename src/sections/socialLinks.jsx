import "../styles/SocialLinks.css";
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
          <p>{copy.socialRole}</p>
        </div>
      </div>
      <div className="social-links">
        <a
          href="https://github.com/Mohammed-HG"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
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
          <span>
            <strong>LinkedIn</strong>
            <small>{copy.linkedin}</small>
          </span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
