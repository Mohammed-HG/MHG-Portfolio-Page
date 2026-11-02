import "../styles/SocialLinks.css";
import profile from "../assets/MHG_ProfileImg.jpg";
export default function SocialLinks() {
  return (
    <div className="social-layout">
      <div className="social-profile">
        <img
          src={profile}
          width="112"
          height="112"
          className="social-avatar"
          alt="Mohammed Alghareeb"
          loading="lazy"
          decoding="async"
        />
        <div>
          <p className="eyebrow">LET'S CONNECT</p>
          <h3>Mohammed Alghareeb</h3>
          <p>Web developer · MHG</p>
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
            <small>Explore my code and projects</small>
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
            <small>Connect with me professionally</small>
          </span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
