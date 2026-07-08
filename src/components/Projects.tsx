import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Code, X, ChevronRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { GithubIcon } from './Icons';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
  features: string[];
  codeSnippet: {
    filename: string;
    language: string;
    code: string;
  };
}

export const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProject]);

  const projects: Project[] = [
    {
      id: 1,
      title: 'astra-ai',
      subtitle: 'Enterprise AI Chat & RAG Platform',
      description: 'An enterprise-grade, full-stack AI chat application designed for performance, scalability, and an exceptional user experience. astra ai provides a secure, locally-hostable environment for interacting with large language models, featuring integrated Document & Git Repository RAG capabilities and real-time streaming.',
      tags: ['FastAPI (Python)', 'React 18', 'WebSockets', 'Git RAG Pipeline', 'Docker', 'PostgreSQL'],
      github: 'https://github.com/Lifelightx',
      live: 'https://github.com/Lifelightx',
      features: [
        'FastAPI asynchronous router driving low-latency token streaming over WebSockets.',
        'Integrated Document & Git repository RAG pipelines to ingest complete codebases, answer architectural questions, and draft new features.',
        'Fully-orchestrated multi-container architecture with Docker Compose and Nginx reverse proxy configuration.'
      ],
      codeSnippet: {
        filename: 'chat_router.py',
        language: 'python',
        code: `from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from astra.core.llm import generate_llm_stream

router = APIRouter()

@router.websocket("/ws/chat/stream")
async def chat_websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Await user query json containing message contents
            data = await websocket.receive_json()
            user_prompt = data.get("prompt", "")
            
            # Stream response tokens back to client instantly
            async for token in generate_llm_stream(user_prompt):
                await websocket.send_json({"token": token})
    except WebSocketDisconnect:
        # Gracefully handle connection closures
        pass`
      }
    },
    {
      id: 2,
      title: 'smartphonetestfarm',
      subtitle: 'Mobile Device Farm Orchestrator',
      description: 'A high-performance Go-based mobile device farm with WebSocket streaming, remote control, automation, device orchestration, and cloud-ready architecture.',
      tags: ['Go (Golang)', 'WebSockets', 'Automation', 'iOS/Android streaming', 'Orchestration'],
      github: 'https://github.com/Lifelightx/smartphonetestfarm',
      live: 'https://github.com/Lifelightx/smartphonetestfarm',
      features: [
        'Instanced screen capture frame relay with high-speed H.264 video encoding.',
        'Remote control input synthesis using low-latency WebSocket connection handlers.',
        'Platform-agnostic agent orchestrator supporting concurrent device management.'
      ],
      codeSnippet: {
        filename: 'main.go',
        language: 'go',
        code: `package main

import (
	"log"
	"net/http"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}

func handleStream(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket connection upgrade failed:", err)
		return
	}
	defer conn.Close()
	
	// Relay compressed H.264 screen frames to Web client
	for {
		frame := getNextFrame()
		if err := conn.WriteMessage(websocket.BinaryMessage, frame); err != nil {
			break;
		}
	}
}`
      }
    },
    {
      id: 3,
      title: 'dockerRegistry',
      subtitle: 'Private Docker Catalog Interface',
      description: 'Docker Registry UI is a powerful, user-friendly web application that provides complete visibility and control over your private Docker registry catalog, tags, and manifests.',
      tags: ['TypeScript', 'React.js', 'Docker V2 API', 'TailwindCSS'],
      github: 'https://github.com/Lifelightx/dockerRegistry',
      live: 'https://github.com/Lifelightx/dockerRegistry',
      features: [
        'Complete catalog dashboard browsing and tag manifest indexing.',
        'Private registry token-based authentication integration layers.',
        'Sleek responsive web layout for rapid multi-container image management.'
      ],
      codeSnippet: {
        filename: 'registry.ts',
        language: 'typescript',
        code: `interface RegistryCatalog {
  repositories: string[];
}

export async function fetchCatalog(registryUrl: string, headers: HeadersInit): Promise<string[]> {
  const response = await fetch(\`\${registryUrl}/v2/_catalog\`, {
    method: 'GET',
    headers: headers
  });
  
  if (!response.ok) {
    throw new Error('Failed to query Docker Registry catalog');
  }
  
  const data: RegistryCatalog = await response.json();
  return data.repositories;
}`
      }
    },
    {
      id: 4,
      title: 'sentinel',
      subtitle: 'Distributed Container & Host Monitor',
      description: 'A small and lightweight tool for monitoring host server metrics and running container health. Employs a master-agent monitoring design.',
      tags: ['Go (Golang)', 'Container API', 'Distributed Systems', 'Monitoring'],
      github: 'https://github.com/Lifelightx/sentinel',
      live: 'https://github.com/Lifelightx/sentinel',
      features: [
        'High-speed system telemetry agent collection (CPU, Memory, Network metrics).',
        'Docker Daemon sockets listener to trace active container instances in real time.',
        'Lightweight master collector exposing visual reports and node health indicators.'
      ],
      codeSnippet: {
        filename: 'collector.go',
        language: 'go',
        code: `package monitor

import (
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/mem"
)

type SystemMetrics struct {
	CPUPercent float64 \`json:"cpu_percent"\`
	MemPercent float64 \`json:"mem_percent"\`
}

func CollectHostMetrics() (*SystemMetrics, error) {
	cPercent, err := cpu.Percent(0, false)
	if err != nil {
		return nil, err
	}
	mStats, err := mem.VirtualMemory()
	if err != nil {
		return nil, err
	}
	return &SystemMetrics{
		CPUPercent: cPercent[0],
		MemPercent: mStats.UsedPercent,
	}, nil
}`
      }
    },
    {
      id: 5,
      title: 'create-api-stack',
      subtitle: 'Node Boilerplate Scaffold Package',
      description: 'An NPM helper package designed to initialize Node.js APIs quickly. Installs templates pre-configured with secure settings, logging, and environment parsing.',
      tags: ['JavaScript', 'Node.js', 'Express', 'NPM Package', 'CLI'],
      github: 'https://github.com/Lifelightx/create-api-stack',
      live: 'https://github.com/Lifelightx/create-api-stack',
      features: [
        'Boilerplate CLI script generating standardized API template models.',
        'Built-in support for CORS, standard helmet headers, and express logging middlewares.',
        'Configured dotenv parameters ready to deploy on any hosting environment.'
      ],
      codeSnippet: {
        filename: 'cli.js',
        language: 'javascript',
        code: `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function bootstrapProject(targetPath) {
  const fullPath = path.resolve(targetPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  
  // Creates default server.js and configurations
  const packageJson = {
    name: path.basename(fullPath),
    version: "1.0.0",
    main: "server.js",
    dependencies: { "express": "^4.19.0" }
  };
  
  fs.writeFileSync(
    path.join(fullPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('Project template initialized successfully!');
}

bootstrapProject(process.argv[2] || './my-api');`
      }
    }
  ];

  // 3D Tilt Card Component
  const TiltCard: React.FC<{ project: Project }> = ({ project }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Small minimal tilt: max 5 degrees
      const rotateX = -(y - centerY) / (rect.height / 2) * 5;
      const rotateY = (x - centerX) / (rect.width / 2) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    };

    const handleMouseLeave = () => {
      const card = cardRef.current;
      if (!card) return;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    return (
      <div
        ref={cardRef}
        className="project-card interactive"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setActiveProject(project)}
      >
        <div className="card-meta">
          <span className="card-number">0{project.id}</span>
          <span className="card-subtitle">{project.subtitle}</span>
        </div>
        <h3 className="card-title font-serif">{project.title}</h3>
        <p className="card-desc">{project.description}</p>
        <div className="card-tags font-sans">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="card-action font-sans">
          <span>Read Details</span>
          <ChevronRight size={14} className="chevron" />
        </div>
      </div>
    );
  };

  return (
    <div className="projects-container">
      <div className="projects-grid">
        {projects.map((project, idx) => (
          <Reveal key={project.id} delay={idx * 0.15}>
            <TiltCard project={project} />
          </Reveal>
        ))}
      </div>

      {/* Details Sheet Modal (Minimalist Drawer/Overlay) */}
      {activeProject && (
        <div className="sheet-overlay" onClick={() => setActiveProject(null)}>
          <div className="sheet-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="sheet-header">
              <span className="sheet-subtitle font-sans">{activeProject.subtitle}</span>
              <button className="sheet-close-btn interactive" onClick={() => setActiveProject(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="sheet-body">
              <h2 className="sheet-title font-serif">{activeProject.title}</h2>
              <p className="sheet-desc">{activeProject.description}</p>

              {/* Bullet features */}
              <div className="sheet-features-section">
                <h4 className="section-sublabel font-sans">Key Architecture</h4>
                <ul className="sheet-features-list">
                  {activeProject.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>

              {/* Code Blueprint Snippet */}
              <div className="sheet-code-section">
                <div className="code-header font-sans">
                  <Code size={14} className="purple" />
                  <span>{activeProject.codeSnippet.filename}</span>
                </div>
                <div className="code-content">
                  <pre className="font-mono">
                    <code>{activeProject.codeSnippet.code}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sheet-footer font-sans">
              <div className="sheet-links">
                <a href={activeProject.github} target="_blank" rel="noopener noreferrer" className="footer-link interactive">
                  <GithubIcon size={14} />
                  <span>Repository</span>
                </a>
                <a href={activeProject.live} target="_blank" rel="noopener noreferrer" className="footer-link primary-btn interactive">
                  <span>Launch Project</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .projects-container {
          width: 100%;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-top: 40px;
        }

        /* Card design */
        .project-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          text-align: left;
          height: 100%;
          cursor: none;
          transform-style: preserve-3d;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-card:hover {
          border-color: var(--border-active);
          background: var(--bg-card-hover, rgba(25, 25, 28, 0.5));
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .card-number {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }
        .card-subtitle {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--accent-color);
          font-weight: 500;
        }
        .card-title {
          font-size: 1.6rem;
          font-weight: 400;
          color: var(--color-text-primary);
          margin-bottom: 12px;
        }
        .card-desc {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-bottom: 28px;
          flex-grow: 1;
        }
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 28px;
        }
        .tag {
          font-size: 0.75rem;
          background: var(--bg-tag, rgba(255, 255, 255, 0.03));
          border: 1px solid var(--border-light);
          color: var(--color-text-secondary);
          padding: 4px 10px;
          border-radius: 4px;
        }
        .card-action {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-primary);
          border-top: 1px solid var(--border-light);
          padding-top: 20px;
          margin-top: auto;
        }
        .card-action .chevron {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-card:hover .card-action .chevron {
          transform: translateX(4px);
        }

        /* Minimal Side Sheet Overlay */
        .sheet-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--bg-overlay, rgba(4, 4, 5, 0.7));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 10000;
          display: flex;
          justify-content: flex-end;
        }
        
        .sheet-content {
          width: 100%;
          max-width: 550px;
          height: 100%;
          background: var(--bg-dark);
          border-left: 1px solid var(--border-light);
          padding: 48px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: -20px 0 50px var(--sheet-shadow, rgba(0, 0, 0, 0.4));
          animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .sheet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .sheet-subtitle {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--accent-color);
        }
        .sheet-close-btn {
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: none;
          transition: color 0.2s;
        }
        .sheet-close-btn:hover {
          color: var(--color-text-primary);
        }

        .sheet-body {
          flex-grow: 1;
          text-align: left;
        }
        .sheet-title {
          font-size: 2.2rem;
          font-weight: 400;
          color: var(--color-text-primary);
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        .sheet-desc {
          font-size: 1rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .sheet-features-section {
          margin-bottom: 36px;
        }
        .section-sublabel {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }
        .sheet-features-list {
          list-style: none;
          padding: 0;
        }
        .sheet-features-list li {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
          padding-left: 20px;
          position: relative;
        }
        .sheet-features-list li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: var(--accent-color);
        }

        /* Blueprint code box */
        .sheet-code-section {
          margin-top: 36px;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.01);
        }
        .code-header {
          background: rgba(255, 255, 255, 0.02);
          padding: 10px 16px;
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--border-light);
        }
        .code-header .purple {
          color: var(--accent-color);
        }
        .code-content {
          padding: 16px;
          overflow-x: auto;
        }
        .code-content pre {
          margin: 0;
          font-size: 0.8rem;
          line-height: 1.4;
          color: #d1d5db;
        }

        /* Sheet Footer */
        .sheet-footer {
          margin-top: 48px;
          border-top: 1px solid var(--border-light);
          padding-top: 24px;
        }
        .sheet-links {
          display: flex;
          gap: 16px;
        }
        .footer-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--color-text-primary);
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          border: 1px solid var(--border-light);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: none;
        }
        .footer-link:hover {
          border-color: var(--color-text-primary);
          background: var(--border-light);
        }
        .footer-link.primary-btn {
          background: var(--color-text-primary);
          border-color: var(--color-text-primary);
          color: var(--bg-dark);
        }
        .footer-link.primary-btn:hover {
          background: transparent;
          color: var(--color-text-primary);
        }

        @media (max-width: 900px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
          .sheet-content {
            padding: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default Projects;
