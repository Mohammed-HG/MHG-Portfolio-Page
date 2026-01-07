import React, { useState } from 'react'
import "./styles/App.css";
import BurgerMenu from './components/BurgerMenu';
import ContactForm from "./sections/SubmitForm";
import SocialLinks from './sections/socialLinks';
import AboutMe from './sections/aboutMeSection';
import Certifications from './sections/CertificationSection';
import Projects from './sections/projectsSection';

const PortFolio = function() {
  const [activeLink, setActiveLink] = useState('Certificates');


  const goNext = () => {
  document.querySelector('.card-container')?.scrollBy({ 
    left: window.innerWidth, 
    behavior: 'smooth'
  });
}

const goPrev = () => {
  document.querySelector('.card-container')?.scrollBy({ 
    left: -window.innerWidth, 
    behavior: 'smooth' 
  });
}

const goDown = () => {
  document.querySelector('.cards-section')?.scrollIntoView({
    behavior: 'smooth'
  });
};

const handleLinkClick = (e, id) => {
    e.preventDefault();
    setActiveLink(id);

const container = document.querySelector('.card-container');
    if (container) {
      const cards = container.querySelectorAll('.cards');
      const index = Array.from(cards).findIndex(card => card.id === id);
      if (index !== -1) {
        container.scrollTo({
          left: index * container.clientWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  return(
    <>
      <div className="NavBar"><div className="Nav-title">MHG Portfolio Page</div><BurgerMenu /></div>
      <div className="main">
        
        {/* About Section */}
        <div id="About">
          <AboutMe />
          <button className="nav down" onClick={goDown} aria-label="Scroll Down">▽</button>
        </div>
        <div className="cards-section">
          {/*<button className="nav prev" onClick={goPrev} aria-label="Previous">◀</button>*/}

          <div className="card-container">
            <div className="card-header">
              <a 
              href="#SocialLinks" 
              className={`card-header-link ${activeLink === 'SocialLinks' ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, 'SocialLinks')}
              >
                Social
              </a>
              
              <a 
              href="#Certificates" 
              className={`card-header-link ${activeLink === 'Certificates' ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, 'Certificates')}
              >
                Certificates
              </a>

              <a 
              href="#Projects" 
              className={`card-header-link ${activeLink === 'Projects' ? 'active' : ''}`}
              onClick={(e) => handleLinkClick(e, 'Projects')}
              >
                Projects
              </a>
            </div>

            {/* Social Links Section */}
            <div className="cards" id="SocialLinks">
              <SocialLinks />
            </div>

            {/* Certification Section */}
            <div className="cards" id="Certificates">
              <Certifications />
            </div>

            {/* Projects Section */}
            <div className="cards" id="Projects">
              <Projects />
            </div>
          </div>          

          {/*<button className="nav next" onClick={goNext} aria-label="Next">▶</button>*/}
        </div>
      
      {/* Contact Section */}
      <div className="contact-form" id="Contact">
        <ContactForm />
      </div>
    </div>
    </>
  );
}

export default PortFolio;