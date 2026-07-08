import { useState, useEffect } from 'react';
import ThreeBackground from './components/ThreeBackground';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import Skills from './components/Skills';
import OSBoxPage from './components/OSBoxPage';
import Contact from './components/Contact';
import Reveal from './components/Reveal';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-route', currentPath);
  }, [currentPath]);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleScrollToWork = () => {
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 3D Wireframe Octopus Canvas */}
      {!currentPath.startsWith('/osbox') && <ThreeBackground theme={theme} />}

      {/* Grid Lines Overlay */}
      {!currentPath.startsWith('/osbox') && (
        <div className="grid-lines">
          <div className="grid-line" />
          <div className="grid-line" />
          <div className="grid-line" />
        </div>
      )}

      {/* Lag Cursor */}
      <CustomCursor />

      {/* Minimal Header */}
      {!['/osbox/macos', '/osbox/windows', '/osbox/linux'].includes(currentPath) && (
        <Navbar theme={theme} toggleTheme={toggleTheme} />
      )}

      {currentPath.startsWith('/osbox') ? (
        <OSBoxPage />
      ) : (
        <>
          {/* Layout Wrapper */}
          <main className="portfolio-content">
            
            {/* Minimal Hero Section */}
            <section className="section hero-sec">
              <div className="hero-text-content">
                <span className="hero-intro font-sans">Jeebanjyoti Mallik</span>
                <Reveal delay={0.15}>
                  <h1 className="hero-main-title font-syne">
                    Crafting digital <span>systems</span> with code & motion.
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="hero-bio">
                    Software Engineer & Systems Architect. Specializing in high-performance backend networks, 
                    scalable WebSocket hosts.
                  </p>
                </Reveal>
                <Reveal delay={0.45}>
                  <div className="hero-cta font-sans">
                    <button onClick={handleScrollToWork} className="cta-btn interactive">
                      <span>View Selected Work</span>
                      <span className="arrow">↓</span>
                    </button>
                  </div>
                </Reveal>
              </div>
            </section>

            {/* Selected Work Section */}
            <section id="projects" className="section">
              <Reveal delay={0.1}>
                <span className="section-tag">01 // Portfolio</span>
              </Reveal>
              <Reveal delay={0.25}>
                <h2 className="section-heading">Selected <span>Work</span></h2>
              </Reveal>
              <Projects />
            </section>

            {/* Tech Skills Section */}
            <section id="about" className="section">
              <Reveal delay={0.1}>
                <span className="section-tag">02 // Subsystems</span>
              </Reveal>
              <Reveal delay={0.25}>
                <h2 className="section-heading">Technical <span>Discipline</span></h2>
              </Reveal>
              <Skills />
            </section>

            {/* Contact Section */}
            <section id="contact" className="section" style={{ paddingBottom: '140px' }}>
              <Reveal delay={0.1}>
                <span className="section-tag">03 // Inquiry</span>
              </Reveal>
              <Reveal delay={0.25}>
                <h2 className="section-heading">Get in <span>Touch</span></h2>
              </Reveal>
              <Contact />
            </section>
          </main>

          {/* Minimalist Footer */}
          <footer className="minimal-footer font-sans">
            <div className="footer-container">
              <span className="footer-left">© 2026 J. MALLIK. ALL RIGHTS RESERVED.</span>
              <span className="footer-right">BUILT WITH THREE.JS & REACT</span>
            </div>
          </footer>
        </>
      )}

      {/* Inline styles for top-level app structure */}
      <style>{`
        .portfolio-content {
          width: 100%;
          position: relative;
          z-index: 10;
        }

        /* Hero Section styles */
        .hero-sec {
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding-top: 140px;
          padding-bottom: 60px;
        }

        .hero-text-content {
          max-width: 820px;
          text-align: left;
        }

        .hero-intro {
          font-size: 0.85rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: var(--accent-color);
          margin-bottom: 24px;
          display: block;
        }

        .hero-main-title {
          font-size: 4.8rem;
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -2px;
          color: var(--color-text-primary);
          margin-bottom: 28px;
        }

        .hero-main-title span {
          font-family: var(--font-serif);
          font-style: italic;
          font-weight: 300;
        }

        .hero-bio {
          font-size: 1.15rem;
          line-height: 1.6;
          color: var(--color-text-secondary);
          max-width: 620px;
          margin-bottom: 40px;
        }

        /* Hero Call to Action button */
        .hero-cta {
          display: flex;
        }
        
        .cta-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-primary);
          border-bottom: 1px solid var(--border-active);
          padding-bottom: 8px;
          cursor: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cta-btn .arrow {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cta-btn:hover {
          color: var(--accent-color);
          border-bottom-color: var(--accent-color);
        }

        .cta-btn:hover .arrow {
          transform: translateY(4px);
        }

        /* Footer styling */
        .minimal-footer {
          border-top: 1px solid var(--border-light);
          padding: 40px 0;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          position: relative;
          z-index: 10;
          background: var(--bg-dark);
        }

        .footer-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .hero-main-title {
            font-size: 3rem;
            letter-spacing: -1px;
          }
          .hero-bio {
            font-size: 1rem;
          }
          }
        }

        /* Custom cursor styles override inside OSBox */
        :root[data-route^="/osbox"] {
          cursor: default;
        }
        :root[data-route^="/osbox"] .custom-cursor,
        :root[data-route^="/osbox"] .custom-cursor-ring {
          display: none !important;
        }
      `}</style>
    </>
  );
}

export default App;
