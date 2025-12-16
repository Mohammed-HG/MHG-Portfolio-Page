import React from 'react'
import "./App.css";
import BurgerMenu from './components/BurgerMenu';
import ContactForm from "./sections/SubmitForm";
import AboutMe from './sections/aboutMeSection';
import Certifications from './sections/CertificationSection';
import Projects from './sections/projectsSection';

const PortFolio = function() {

  return(
    <>
      <div className="NavBar"><BurgerMenu /></div>

      <div className="main">
        {/* About Section */}
        <div id="About">
          <AboutMe />
        </div>
        
        {/* Certification Section */}
        <div id="Certificates">
          <Certifications />
        </div>

        {/* Projects Section */}
        <div id="Projects">
          <Projects />
        </div>

        {/* Contact Section */}
        <div id="Contact">
          <ContactForm />
        </div>
      </div>
    </>
  );
}

export default PortFolio;