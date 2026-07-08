import React, { useState } from 'react';
import { Reveal } from './Reveal';
import { 
  Cpu, Server, Terminal, Network, Radio, Database, 
  Code2, Atom, Box, Sparkles, Globe, Layout, Wind, 
  Cloud, Workflow, Play, Settings 
} from 'lucide-react';

interface SkillCategory {
  id: string;
  name: string;
  description: string;
  items: string[];
}

export const Skills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('sys');

  const categories: SkillCategory[] = [
    {
      id: 'sys',
      name: 'System Engineering',
      description: 'Building microservices, handling real-time streams, concurrency architectures, and system calls.',
      items: ['Go (Golang)', 'Node.js', 'Python', 'C/C++', 'gRPC', 'WebSockets', 'Redis', 'PostgreSQL']
    },
    {
      id: 'web',
      name: 'Interactive Interfaces',
      description: 'Designing high-performance graphic applications, WebGL visualizers, and smooth responsive systems.',
      items: ['TypeScript', 'React.js', 'Three.js / WebGL', 'GLSL Shaders', 'Next.js', 'CSS Grid/Flexbox', 'Framer Motion']
    },
    {
      id: 'infra',
      name: 'Infrastructure & Ops',
      description: 'Orchestrating container hosts, managing automated pipelines, and deploying distributed code bases.',
      items: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'GitHub Actions', 'Linux Shell Scripting', 'AWS Cloud', 'Docker API']
    }
  ];

  const active = categories.find((cat) => cat.id === activeCategory) || categories[0];

  const getSkillIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('go (')) return <Cpu size={14} className="skill-icon" />;
    if (lower.includes('node')) return <Server size={14} className="skill-icon" />;
    if (lower.includes('python')) return <Terminal size={14} className="skill-icon" />;
    if (lower.includes('c/c++')) return <Cpu size={14} className="skill-icon" />;
    if (lower.includes('grpc')) return <Network size={14} className="skill-icon" />;
    if (lower.includes('websocket')) return <Radio size={14} className="skill-icon" />;
    if (lower.includes('redis')) return <Database size={14} className="skill-icon" />;
    if (lower.includes('postgresql')) return <Database size={14} className="skill-icon" />;
    
    if (lower.includes('typescript')) return <Code2 size={14} className="skill-icon" />;
    if (lower.includes('react')) return <Atom size={14} className="skill-icon" />;
    if (lower.includes('three.js')) return <Box size={14} className="skill-icon" />;
    if (lower.includes('glsl')) return <Sparkles size={14} className="skill-icon" />;
    if (lower.includes('next')) return <Globe size={14} className="skill-icon" />;
    if (lower.includes('css')) return <Layout size={14} className="skill-icon" />;
    if (lower.includes('framer')) return <Wind size={14} className="skill-icon" />;
    
    if (lower.includes('docker')) return <Box size={14} className="skill-icon" />;
    if (lower.includes('kubernetes')) return <Cloud size={14} className="skill-icon" />;
    if (lower.includes('pipeline') || lower.includes('ci/cd')) return <Workflow size={14} className="skill-icon" />;
    if (lower.includes('github')) return <Play size={14} className="skill-icon" />;
    if (lower.includes('shell') || lower.includes('linux')) return <Terminal size={14} className="skill-icon" />;
    if (lower.includes('aws')) return <Cloud size={14} className="skill-icon" />;
    if (lower.includes('api')) return <Settings size={14} className="skill-icon" />;
    
    return <Code2 size={14} className="skill-icon" />;
  };

  return (
    <div className="skills-layout">
      {/* Left Column: Tech Philosophy */}
      <Reveal delay={0.1}>
        <div className="skills-intro">
          <h4 className="skills-sublabel font-sans">Subsystems</h4>
          <p className="skills-philosophy font-serif">
            "Architecture is about managing complexity with simple structures. 
            Performance lies in the balance of fast memory layouts and clean visual output."
          </p>
          <p className="skills-subtext">
            I write modular code that executes efficiently at scale, whether it is rendering 3D particles in a GPU buffer or synchronizing container operations across isolated hosts.
          </p>
        </div>
      </Reveal>

      {/* Right Column: Interactive categories & list */}
      <Reveal delay={0.25}>
        <div className="skills-interactive">
          
          {/* Categories trigger list */}
          <div className="skills-buttons">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`skills-btn interactive ${activeCategory === cat.id ? 'active' : ''}`}
              >
                <span className="skills-btn-num">0{categories.indexOf(cat) + 1}.</span>
                <span className="skills-btn-name">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Selected Stack Panel */}
          <div className="skills-display">
            <p className="skills-display-desc font-sans">{active.description}</p>
            <div className="skills-tags-grid">
              {active.items.map((item, idx) => (
                <div key={item} className="skills-tag-item font-sans" style={{ animationDelay: `${idx * 0.05}s` }}>
                  {getSkillIcon(item)}
                  <span className="tag-label">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Reveal>

      <style>{`
        .skills-layout {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          text-align: left;
          width: 100%;
          border-top: 1px solid var(--border-light);
          padding-top: 60px;
        }

        /* Intro column */
        .skills-intro {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .skills-sublabel {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--color-text-muted);
        }
        .skills-philosophy {
          font-size: 1.6rem;
          line-height: 1.4;
          font-weight: 300;
          color: var(--color-text-primary);
        }
        .skills-subtext {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        /* Interactive column */
        .skills-interactive {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .skills-buttons {
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 30px;
        }
        .skills-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          text-align: left;
          font-size: 1.15rem;
          font-family: var(--font-sans);
          color: var(--color-text-secondary);
          cursor: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-bottom: 1px solid transparent;
        }
        .skills-btn-num {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .skills-btn:hover {
          color: var(--color-text-primary);
          transform: translateX(8px);
        }
        .skills-btn.active {
          color: var(--color-text-primary);
          font-weight: 600;
          transform: translateX(8px);
        }
        .skills-btn.active .skills-btn-num {
          color: var(--accent-color);
        }

        /* Stack items list styling */
        .skills-display {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .skills-display-desc {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
        .skills-tags-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .skills-tag-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--color-text-primary);
          opacity: 0;
          animation: fade-in-tag 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .skills-tag-item .skill-icon {
          color: var(--accent-color);
          flex-shrink: 0;
        }
        
        @keyframes fade-in-tag {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 900px) {
          .skills-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default Skills;
