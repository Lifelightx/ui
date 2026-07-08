import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const Navbar: React.FC<{ theme: 'dark' | 'light'; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'sandbox') {
      window.history.pushState({}, '', '/osbox');
      window.dispatchEvent(new Event('popstate'));
      return;
    }

    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        
        {/* Left Side: Monogram/Name */}
        <div className="nav-logo interactive" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="logo-text font-serif">J. Mallik</span>
        </div>

        {/* Right Side: Simple Links & Theme Toggle */}
        <nav className="nav-links font-sans">
          <button onClick={() => scrollToSection('projects')} className="nav-item interactive">
            Selected Work
          </button>
          <button onClick={() => scrollToSection('about')} className="nav-item interactive">
            About & Tech
          </button>
          <button onClick={() => scrollToSection('sandbox')} className="nav-item interactive">
            OS Sandbox
          </button>
          <button onClick={() => scrollToSection('contact')} className="nav-item interactive">
            Get in Touch
          </button>
          
          <button onClick={toggleTheme} className="theme-toggle-btn interactive" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </nav>

      </div>

      <style>{`
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 9999;
          display: flex;
          align-items: center;
          background: transparent;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .navbar-header.scrolled {
          height: 70px;
          background: var(--bg-navbar, rgba(8, 8, 9, 0.8));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
        }

        .nav-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .nav-logo {
          font-weight: 400;
          letter-spacing: -0.5px;
          cursor: none;
        }
        .logo-text {
          font-size: 1.25rem;
          color: var(--color-text-primary);
          font-family: var(--font-serif);
        }

        /* Navigation links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .nav-item {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          font-size: 0.88rem;
          font-family: var(--font-sans);
          letter-spacing: 0.5px;
          font-weight: 400;
          cursor: none;
          transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          padding: 4px 0;
        }
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: var(--color-text-primary);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-item:hover {
          color: var(--color-text-primary);
        }
        .nav-item:hover::after {
          transform: scaleX(1);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Theme Toggle Button */
        .theme-toggle-btn {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: none;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .theme-toggle-btn:hover {
          color: var(--color-text-primary);
          background: var(--border-light);
        }

        @media (max-width: 768px) {
          .nav-links {
            gap: 16px;
          }
          .logo-text {
            font-size: 1.15rem;
          }
          .nav-item {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
