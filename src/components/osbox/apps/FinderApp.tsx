import React from 'react';
import { HardDrive, Folder, FileText, Network, FileCode } from 'lucide-react';

interface FinderAppProps {
  explorerPath: 'root' | 'projects' | 'system';
  setExplorerPath: (path: 'root' | 'projects' | 'system') => void;
  selectedFileContent: string | null;
  setSelectedFileContent: (content: string | null) => void;
}

export const FinderApp: React.FC<FinderAppProps> = ({
  explorerPath,
  setExplorerPath,
  selectedFileContent,
  setSelectedFileContent
}) => {
  const virtualFiles = {
    root: [
      { name: 'System Info.txt', type: 'file', content: 'Host System Name: J-MALLIK-CORE\nIP Address: 192.168.1.105\nActive Kernel: Unix 24.6.0\nSub-modules: 4 operational' },
      { name: 'Projects', type: 'dir', path: 'projects' },
      { name: 'System Stats', type: 'dir', path: 'system' }
    ],
    projects: [
      { name: 'Astra-AI.json', type: 'file', content: '{\n  "id": "astra-ai",\n  "category": "Enterprise AI",\n  "techStack": ["FastAPI", "React", "Docker"],\n  "status": "Production"\n}' },
      { name: 'Sentinel-Go.go', type: 'file', content: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Sentinel Telemetry Client v1.0.0 Online")\n}' }
    ],
    system: [
      { name: 'UptimeLogs.log', type: 'file', content: '[2026-07-08 09:00]: System boot successful.\n[2026-07-08 09:01]: Connected socket listeners.\n[2026-07-08 12:45]: Telemetry audit: OK.' }
    ]
  };

  const getFileIcon = (file: any) => {
    if (file.type === 'dir') {
      return <Folder size={32} className="finder-folder-icon" style={{ color: '#ffb300' }} />;
    }
    if (file.name.endsWith('.go') || file.name.endsWith('.json')) {
      return <FileCode size={32} className="finder-code-icon" style={{ color: '#00bcd4' }} />;
    }
    return <FileText size={32} className="finder-text-icon" style={{ color: '#eceff1' }} />;
  };

  return (
    <div className="finder-app font-sans">
      <div className="finder-left-sidebar">
        <span className="f-side-title">Locations</span>
        <button 
          onClick={() => { setExplorerPath('root'); setSelectedFileContent(null); }}
          className={`f-side-btn ${explorerPath === 'root' ? 'active' : ''}`}
        >
          <HardDrive size={14} />
          <span>Core Drive</span>
        </button>
        <button 
          onClick={() => { setExplorerPath('projects'); setSelectedFileContent(null); }}
          className={`f-side-btn ${explorerPath === 'projects' ? 'active' : ''}`}
        >
          <Folder size={14} />
          <span>Projects</span>
        </button>
        <button 
          onClick={() => { setExplorerPath('system'); setSelectedFileContent(null); }}
          className={`f-side-btn ${explorerPath === 'system' ? 'active' : ''}`}
        >
          <Network size={14} />
          <span>Diagnostics</span>
        </button>
      </div>

      <div className="finder-right-panel">
        <div className="f-files-row">
          {virtualFiles[explorerPath].map((file) => (
            <div 
              key={file.name} 
              className="f-file-item"
              onClick={() => {
                if (file.type === 'dir') {
                  setExplorerPath((file as any).path);
                  setSelectedFileContent(null);
                } else {
                  setSelectedFileContent(file.content || '');
                }
              }}
            >
              {getFileIcon(file)}
              <span>{file.name}</span>
            </div>
          ))}
        </div>

        {selectedFileContent && (
          <div className="f-preview-area">
            <span className="f-preview-title">Document Preview</span>
            <pre className="f-preview-box">{selectedFileContent}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
export default FinderApp;
