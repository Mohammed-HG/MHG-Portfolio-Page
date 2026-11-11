import "../styles/AboutMe.css";
export default function AboutMe({ copy }) {
  return (
    <div className="hero-grid section-shell">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" aria-hidden="true" /> {copy.roleKicker}
        </p>
        <h1>
          {copy.hello}
          <br />
          <span>{copy.heroTitle}</span>
        </h1>
        <p className="hero-description">{copy.intro}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#Work">
            {copy.explore} <span aria-hidden="true">↗</span>
          </a>
          <a className="button button-secondary" href="#Contact">
            {copy.connectAction}
          </a>
        </div>
        <div className="hero-tags" aria-label={copy.interests}>
          <span>{copy.web}</span>
          <span>{copy.responsive}</span>
          <span>{copy.learning}</span>
        </div>
      </div>
      <div className="terminal" dir="ltr" aria-label={copy.terminalLabel}>
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
          <p className="terminal-name">{copy.name}</p>
          <p className="terminal-muted">{copy.role}</p>
          <div className="terminal-divider" />
          <p className="terminal-comment">{copy.terminalComment}</p>
          <p>
            <span className="code-key">const</span> developer = {"{"}
          </p>
          <p className="code-indent">
            alias: <span className="code-string">'MHG'</span>,
          </p>
          <p className="code-indent">
            focus:{" "}
            <span className="code-string" dir="auto">
              {copy.building}
            </span>
            ,
          </p>
          <p className="code-indent">
            next:{" "}
            <span className="code-string" dir="auto">
              {copy.better}
            </span>
          </p>
          <p>{"}"};</p>
          <p className="terminal-ready">
            <span aria-hidden="true">✓</span> {copy.ready}
          </p>
        </div>
      </div>
      <a className="scroll-hint" href="#Work">
        <span aria-hidden="true">↓</span> {copy.discover}
      </a>
    </div>
  );
}
