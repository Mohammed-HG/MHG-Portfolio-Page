import { useState, useEffect, useRef } from 'react'
import "../styles/AboutMe.css";

const AboutMe = function() {
  const aboutRef = useRef(null);

  const [isAboutVisible, setIsAboutVisible] = useState(false);
  
  const [displayedText, setDisplayedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const lines = [
    "MHG-Portfolio.exe",
    "Welcome to my Portfolio Page",
    "I'm Mohammed Alghareeb (MHG)",
    "Junior Web Developer!",
    "Scroll down to see my work ↓"
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
  const lineBreakDelay = 150;
  const firstLineDelay = 800;
  
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
    const delay = currentLineIndex === 0 ? lineBreakDelay + firstLineDelay : lineBreakDelay;
    
    const timer = setTimeout(() => {
      setCurrentLineIndex(prev => prev + 1);
      setCurrentCharIndex(0);
    }, delay);
    
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
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;

        if (entry.isIntersecting) {
          if (sectionId === 'About') setIsAboutVisible(true);
        } 
      });
    }, observerOptions);

    const sections = [aboutRef.current];
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
  
  const remainingLines = textLines.slice(1);
  
  return remainingLines.map((line, index) => {
    const originalIndex = index + 1;
    const isLastLine = originalIndex === textLines.length - 1;
    
    if (originalIndex === 1 && line) {
      return <h3 key={index} className="welcome typed-line">{line} {isLastLine && <span className="cursor">█</span>}</h3>;
    } else if (originalIndex === 2 && line) {
      return <p key={index} className="my-name typed-line">{line} {isLastLine && <span className="cursor">█</span>}</p>;
    } else if (originalIndex === 3 && line) {
      return <p key={index} className="skills typed-line">{line} {isLastLine && <span className="cursor">█</span>}</p>;
    } else if (originalIndex === 4 && line) {
      return <p key={index} className="social typed-line">{line} {isLastLine && <span className="cursor">█</span>}</p>;
    }
    return null;
  });
};

  return(
    <>
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
            <div className="prompt">
              <span className="prompt-prefix">mhg@portfolio:~$ </span>
              {currentLineIndex === 0 ? (
                <span className="label-typing">
                  {displayedText}
                  {currentLineIndex === 0 && currentCharIndex < lines[0].length && (
                    <span className="cursor">█</span>
                  )}
                </span>
              ) : (
                <span className="label-complete">{lines[0]}</span>
              )}
            </div>
            <div className="typing-text">
              {renderTypedText()}
            </div>
          </div>
        </section>
    </>
  );
}

export default AboutMe;