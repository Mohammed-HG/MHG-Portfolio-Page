import "../styles/AboutMe.css";
export default function AboutMe() {
  return (
    <div className="hero-grid section-shell">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true" /> JUNIOR WEB
          DEVELOPER
        </p>
        <h1>
          Hi, I'm Mohammed.
          <br />
          <span>I build for the web.</span>
        </h1>
        <p className="hero-description">
          I'm Mohammed Alghareeb, also known as MHG. I enjoy turning ideas into
          useful web experiences and learning something new with every build.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#Work">
            Explore my work <span aria-hidden="true">↗</span>
          </a>
          <a className="button button-secondary" href="#Contact">
            Let's connect
          </a>
        </div>
        <div className="hero-tags" aria-label="Interests">
          <span>Web development</span>
          <span>Responsive design</span>
          <span>Continuous learning</span>
        </div>
      </div>
      <div
        className="terminal"
        aria-label="A little about my development journey"
      >
        <div className="terminal-header">
          <div className="terminal-lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>mhg — portfolio</span>
          <span className="terminal-code" aria-hidden="true">
            ~
          </span>
        </div>
        <div className="terminal-body">
          <p className="terminal-command">
            <span>mhg@portfolio:~$</span> whoami
            <span className="terminal-cursor" aria-hidden="true">
              ▌
            </span>
          </p>
          <p className="terminal-name">Mohammed Alghareeb</p>
          <p className="terminal-muted">Junior web developer</p>
          <div className="terminal-divider" />
          <p className="terminal-comment">// always a work in progress</p>
          <p>
            <span className="code-key">const</span> developer = {"{"}
          </p>
          <p className="code-indent">
            alias: <span className="code-string">'MHG'</span>,
          </p>
          <p className="code-indent">
            focus: <span className="code-string">'Building & learning'</span>,
          </p>
          <p className="code-indent">
            next: <span className="code-string">'A better version'</span>
          </p>
          <p>{"}"};</p>
          <p className="terminal-ready">
            <span aria-hidden="true">✓</span> Ready for the next challenge.
          </p>
        </div>
      </div>
      <a className="scroll-hint" href="#Work">
        <span aria-hidden="true">↓</span> Discover more below
      </a>
    </div>
  );
}
