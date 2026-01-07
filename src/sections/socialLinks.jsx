import { useState } from "react";
import "../styles/SocialLinks.css";

const SocialLinks = () => {
  const [open, setOpen] = useState(false);

  const GitHubLink = "https://github.com/Mohammed-HG";
  const LinkedInLink = "https://www.linkedin.com/in/mohammed-al-ghareeb/";

  const ProfileImg = "src/assets/MHG_ProfileImg.jpg";
  const GitHubImg = "src/assets/github-logo.png";
  const LinkedInImg = "https://cdn-icons-png.flaticon.com/512/174/174857.png";

  return (
    <div className="social-card">
    
      {/* Profile */}
      <div className="social-content">
        <img
          src={ProfileImg}
          alt="Profile"
          className="social-avatar"
        />

        <h5 className="user-name">Mohammed-HG</h5>
        <span className="user-skill">Web Developer</span>

        <div className="social-actions">
          <a
            href={GitHubLink}
            target="_blank"
            className="click-btn1"
          >
            <img
              src={GitHubImg}
              alt="GitHub"
              className="social-icon"
            />
            GitHub
          </a>

          <a
            href={LinkedInLink}
            target="_blank"
            className="click-btn2"
          >
            <img
              src={LinkedInImg}
              alt="LinkedIn"
              className="social-icon"
            />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
