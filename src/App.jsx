import { useState, useEffect, useRef } from 'react'
import BurgerMenu from './BurgerMenu';
import "./App.css";
import certImg1 from "./assets/freecodecamCert.jpg";

const PortFolio = function() {
  const aboutRef = useRef(null);
  const certificatesRef = useRef(null);
  const projectsRef = useRef(null);

  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isCertificatesVisible, setIsCertificatesVisible] = useState(false);
  const [isProjectsVisible, setIsProjectsVisible] = useState(false);
  
  const [displayedText, setDisplayedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const LinkedIn = "https://www.linkedin.com/in/mohammed-al-ghareeb/";
  
  const lines = [
    "Welcome to my Portfolio Page",
    "I'm Mohammed Alghareeb (MHG)",
    "Junior Web Developer!",
    "This my LinkedIn Account:",
    "Go to LinkedIn"
  ];

  useEffect(() => {
    if (!isAboutVisible) {
      setDisplayedText('');
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
      setIsTypingComplete(false);
      return;
    }

    if (currentLineIndex >= lines.length) {
      setIsTypingComplete(true);
      return;
    }

    const typingSpeed = 50;
    const lineBreakDelay = 250;
    
    if (currentCharIndex < lines[currentLineIndex].length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => {
          const currentLineText = lines[currentLineIndex].substring(0, currentCharIndex + 1);
          
          let newText = '';
          for (let i = 0; i < currentLineIndex; i++) {
            newText += lines[i] + '\n';
          }
          newText += currentLineText;
          
          return newText;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, typingSpeed);
      
      return () => clearTimeout(timer);
    } else if (currentLineIndex < lines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, lineBreakDelay);
      
      return () => clearTimeout(timer);
    } else {
      setIsTypingComplete(true);
    }
  }, [isAboutVisible, currentLineIndex, currentCharIndex]);

  useEffect(() => {
    if (isAboutVisible) {
      setDisplayedText('');
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
    } else {
      setDisplayedText('');
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
    }
  }, [isAboutVisible]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;

        if (entry.isIntersecting) {
          if (sectionId === 'About') setIsAboutVisible(true);
          if (sectionId === 'Certificates') setIsCertificatesVisible(true);
          if (sectionId === 'Projects') setIsProjectsVisible(true);
        } 
      });
    }, observerOptions);

    const sections = [aboutRef.current, certificatesRef.current, projectsRef.current];
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const renderTypedText = () => {
    const textLines = displayedText.split('\n');
    
    return textLines.map((line, index) => {
      const isLastLine = index === textLines.length - 1;
      if (index === 0 && line) {
        return <h1 key={index} className="welcome typed-line">{line} {isLastLine && <span className="cursor">█</span>}</h1>;
      } else if (index === 1 && line) {
        return <h3 key={index} className="my-name typed-line">{line} {isLastLine && <span className="cursor">█</span>}</h3>;
      } else if (index === 2 && line) {
        return <p key={index} className="skills typed-line">{line} {isLastLine && <span className="cursor">█</span>}</p>;
      } else if (index === 3 && line) {
        return <p key={index} className="social typed-line">{line} {isLastLine && <span className="cursor">█</span>}</p>;
      } else if (index === 4 && line) {
        return <a key={index} href={LinkedIn} target="_blank" className="social-link typed-line">{line} {isLastLine && <span className="cursor">█</span>}</a>;
      }
      return null;
    });
  };

  return(
    <>
      <div className="NavBar"><BurgerMenu /></div>

      <div className="main">
        {/* About Section */}
        <section ref={aboutRef} className="hero-section" id="About">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="close"></span>
              <span className="minimize"></span>
              <span className="maximize"></span>
            </div>
            <div className="terminal-title">bash — portfolio</div>
          </div>
          <div className="terminal-body">
            <div className="prompt">mhg@portfolio:~$ MHG-Portfolio.exe</div>
            <div className="typing-text">
              {renderTypedText()}
            </div>
          </div> 
        </section>
        
        {/* Certification Section */}
        <section ref={certificatesRef} className="certs-section" id="Certificates">
          <div className="cert-section">
            <h2 className={`text1 ${isCertificatesVisible ? 'slide-in-left' : 'slide-out-left'}`}>
              My Certificates:
            </h2>
            <div className="cert-imgs">
              <img 
                src={certImg1} 
                alt="freeCodeCamp Certificate" 
                className={`cert-img ${isCertificatesVisible ? 'slide-in-right delay-2' : 'slide-out-right'}`}
              />
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section ref={projectsRef} className="projects-section" id="Projects">
          <div className="projects-content">
            <h2 className={`section-title ${isProjectsVisible ? 'fade-in' : 'fade-out'}`}>
              My Projects
            </h2>
            <div className="projects-grid">
              <p className={isProjectsVisible ? 'fade-in delay-1' : 'fade-out'}>
                Projects coming soon...
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default PortFolio;