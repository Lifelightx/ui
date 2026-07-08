import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle, Plus, RefreshCw, Folder, Settings, Search, GitBranch, Play, Grid } from 'lucide-react';
import { useStore } from '../../core/store/index';
import { fileStore, fsHelpers } from '../../core/store/fileStore';

export const VSCodeApp: React.FC = () => {
  const [activeFile, setActiveFile] = useState({
    name: 'Readme.md',
    path: '/Users/jeebanjyoti/Documents',
    content: ''
  });
  const [editingContent, setEditingContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  // Creation state
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Sync with filesystem store
  const fileSystem = useStore(fileStore, (s) => s.root);

  // Dynamic files list
  const [workspaceFiles, setWorkspaceFiles] = useState<{ name: string; path: string }[]>([]);

  const loadWorkspaceFiles = () => {
    const files: { name: string; path: string }[] = [];
    const traverse = (node: any, currentPath: string) => {
      if (node.type === 'file') {
        files.push({ name: node.name, path: currentPath });
      } else if (node.type === 'folder' && node.children) {
        for (const child of node.children) {
          const segs = currentPath.split('/').filter(Boolean);
          if (node.name !== 'root') {
            segs.push(node.name);
          }
          const actualPath = '/' + segs.join('/');
          
          if (child.type === 'file') {
            files.push({ name: child.name, path: actualPath });
          } else {
            traverse(child, actualPath);
          }
        }
      }
    };
    
    const userNode = fsHelpers.getNodeByPath('/Users/jeebanjyoti');
    if (userNode && userNode.children) {
      for (const child of userNode.children) {
        if (child.type === 'file') {
          files.push({ name: child.name, path: '/Users/jeebanjyoti' });
        } else {
          traverse(child, '/Users/jeebanjyoti');
        }
      }
    }
    setWorkspaceFiles(files);
  };

  useEffect(() => {
    loadWorkspaceFiles();
  }, [fileSystem]);

  const loadFileContent = (name: string, path: string) => {
    const fileNode = fsHelpers.getNodeByPath(path + '/' + name);
    if (fileNode && fileNode.type === 'file') {
      setActiveFile({ name, path, content: fileNode.content || '' });
      setEditingContent(fileNode.content || '');
      setSaveStatus(null);
    }
  };

  useEffect(() => {
    loadFileContent(activeFile.name, activeFile.path);
  }, []);

  const handleSave = () => {
    const success = fsHelpers.createFile(activeFile.path, activeFile.name, editingContent);
    if (success) {
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(null), 2500);
    } else {
      setSaveStatus('Error saving file.');
    }
  };

  const handleCreateFile = () => {
    const name = newFileName.trim();
    if (!name) return;
    
    const targetPath = activeFile.path || '/Users/jeebanjyoti/Documents';
    const success = fsHelpers.createFile(targetPath, name, '');
    if (success) {
      setIsCreatingFile(false);
      setNewFileName('');
      setActiveFile({
        name,
        path: targetPath,
        content: ''
      });
      setEditingContent('');
    } else {
      alert('Could not create file. Check if filename already exists.');
    }
  };

  return (
    <div className="vscode-container">
      {/* 1. Activity Bar (VS Code left bar) */}
      <div className="vscode-activity-bar">
        <div className="activity-group-top">
          <div className="activity-icon active">
            <Folder size={20} />
          </div>
          <div className="activity-icon">
            <Search size={20} />
          </div>
          <div className="activity-icon">
            <GitBranch size={20} />
          </div>
          <div className="activity-icon">
            <Play size={20} />
          </div>
          <div className="activity-icon">
            <Grid size={20} />
          </div>
        </div>
        <div className="activity-group-bottom">
          <div className="activity-icon">
            <Settings size={20} />
          </div>
        </div>
      </div>

      {/* 2. Sidebar Explorer */}
      <div className="vscode-sidebar">
        <div className="vscode-sidebar-header">
          <span className="vscode-sidebar-title">Explorer: Workspace</span>
          <div className="vscode-sidebar-actions">
            <button 
              onClick={() => setIsCreatingFile(true)} 
              title="New File"
              className="sidebar-action-btn"
            >
              <Plus size={14} />
            </button>
            <button 
              onClick={loadWorkspaceFiles} 
              title="Refresh Explorer"
              className="sidebar-action-btn"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        <div className="vscode-files-list">
          {/* Creating file input field */}
          {isCreatingFile && (
            <div className="vscode-new-file-input-wrapper">
              <FileText size={14} className="file-icon" />
              <input
                type="text"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsCreatingFile(false);
                  }, 200);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFile();
                  if (e.key === 'Escape') setIsCreatingFile(false);
                }}
                placeholder="filename.txt"
                className="new-file-input"
              />
            </div>
          )}

          {workspaceFiles.map((file) => (
            <button
              key={`${file.path}/${file.name}`}
              onClick={() => loadFileContent(file.name, file.path)}
              className={`vscode-file-item ${
                activeFile.name === file.name && activeFile.path === file.path ? 'active' : ''
              }`}
            >
              <FileText size={14} className="file-icon" />
              <span className="file-name-text">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Editor Main Work Area */}
      <div className="vscode-editor-main">
        {/* Editor Tabs bar */}
        <div className="vscode-tabs-bar">
          <div className="vscode-tab active">
            <FileText size={12} className="tab-icon" />
            <span className="tab-name">{activeFile.name}</span>
          </div>
          <div className="vscode-editor-actions">
            {saveStatus && (
              <span className="save-status-msg">
                <CheckCircle size={12} />
                <span>{saveStatus}</span>
              </span>
            )}
            <button onClick={handleSave} className="vscode-save-btn">
              <Save size={12} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Editor path breadcrumbs */}
        <div className="vscode-breadcrumbs">
          <span>workspace</span>
          <span className="separator">&gt;</span>
          <span>{activeFile.path.replace(/^\/Users\/jeebanjyoti\/?/, '') || 'home'}</span>
          <span className="separator">&gt;</span>
          <span className="active-breadcrumb">{activeFile.name}</span>
        </div>

        {/* Text Area */}
        <div className="vscode-textarea-container">
          <div className="vscode-line-numbers">
            {Array.from({ length: Math.max(15, editingContent.split('\n').length + 5) }).map((_, i) => (
              <div key={i} className="line-number-item">{i + 1}</div>
            ))}
          </div>
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="vscode-textarea"
            placeholder="// Write code or edit text contents here..."
            spellCheck="false"
          />
        </div>

        {/* Status Bar */}
        <div className="vscode-status-bar">
          <div className="status-left">
            <span className="status-item bg-purple">LF</span>
            <span className="status-item">UTF-8</span>
            <span className="status-item">TypeScript React</span>
          </div>
          <div className="status-right">
            <span className="status-item">Ln {editingContent.split('\n').length}, Col {editingContent.length}</span>
            <span className="status-item">Spaces: 2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VSCodeApp;
