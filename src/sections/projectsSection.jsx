import { useState, useEffect, useRef } from 'react'
import "../App.css";


const Projects = function() {
  const projectsRef = useRef(null);

  const [isProjectsVisible, setIsProjectsVisible] = useState(false);

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
          if (sectionId === 'Projects') setIsProjectsVisible(true);
        } 
      });
    }, observerOptions);

    const sections = [projectsRef.current];
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return(
    <> 
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
    </>
  );
}

export default Projects;