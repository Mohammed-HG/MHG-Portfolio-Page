import { useState, useEffect, useRef } from 'react'
import "../styles/Cert.css";
import certImg1 from "../assets/freecodecamCert.jpg";

const Certifications = function() {
  const certificatesRef = useRef(null);

  const [isCertificatesVisible, setIsCertificatesVisible] = useState(false);


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
    </>
  );
}

export default Certifications;