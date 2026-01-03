import React from 'react'
import "./styles/App.css";
import BurgerMenu from './components/BurgerMenu';
import ContactForm from "./sections/SubmitForm";
import AboutMe from './sections/aboutMeSection';
import Certifications from './sections/CertificationSection';
import Projects from './sections/projectsSection';

const PortFolio = function() {

  const goNext = () => {
  document.querySelector('.card-section')?.scrollBy({ 
    left: window.innerWidth, 
    behavior: 'smooth' 
  });
}

const goPrev = () => {
  document.querySelector('.card-section')?.scrollBy({ 
    left: -window.innerWidth, 
    behavior: 'smooth' 
  });
}

  return(
    <>
      <div className="NavBar"><BurgerMenu /></div>

      <button className="nav prev" onClick={goPrev} aria-label="Previous">◀</button>
      <button className="nav next" onClick={goNext} aria-label="Next">▶</button>

      <div className="main">
        <div className="card-section">

        {/* About Section */}
        <div className="card" id="About">
          <AboutMe />
        </div>
        
        {/* Certification Section */}
        <div className="card" id="Certificates">
          <Certifications />
        </div>

        {/* Projects Section */}
        <div className="card" id="Projects">
          <Projects />
        </div>
        
        {/* Contact Section */}
        <div className="card" id="Contact">
          <ContactForm />
        </div>

      </div>
    </div>
    </>
  );
}

export default PortFolio;