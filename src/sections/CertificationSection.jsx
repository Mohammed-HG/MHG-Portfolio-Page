import { useState, useEffect, useRef } from 'react'
import "../styles/Cert.css";
import certImg1 from "../assets/freecodecamCert.jpg";

const Certifications = function() {
  const certificatesRef = useRef(null);

  const [isCertificatesVisible, setIsCertificatesVisible] = useState(false);

  const cert1 = "https://www.freecodecamp.org/certification/mohammed-hg/responsive-web-design";

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
          if (sectionId === 'Certificates') setIsCertificatesVisible(true);
        } 
      });
    }, observerOptions);

    const sections = [certificatesRef.current];
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
        {/* Certification Section */}
        <section ref={certificatesRef} className="certs-section" id="Certificates">
          <div className="cert-section">
            <div
              className={`cert-card ${isCertificatesVisible ? 'slide-in-right delay-2' : 'slide-out-right'}`}
            >
              <img
                src={certImg1}
                alt="freeCodeCamp Certificate"
                className="cert-card-img"
              />

              <div className="cert-card-body">
                <span className="cert-badge">
                  freeCodeCamp
                </span>

                <h5 className="cert-title">
                  Responsive Web Design Certification
                </h5>

                <a
                  href={cert1}
                  target="_blank"
                  rel="noreferrer"
                  className="cert-btn"
                >
                  View Certificate →
                </a>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}

export default Certifications;