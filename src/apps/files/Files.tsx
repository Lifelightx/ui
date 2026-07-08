import React, { useState } from 'react';
import { Folder, FileText, FileCode, ArrowLeft } from 'lucide-react';
import { useStore } from '../../core/store/index';
import { fileStore, fsHelpers } from '../../core/store/fileStore';
import type { FSNode } from '../../core/store/fileStore';
import { windowActions } from '../../core/store/windowStore';

export const FilesApp: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/Users/jeebanjyoti');
  const [selectedFile, setSelectedFile] = useState<FSNode | null>(null);

  // Sync with file system store updates
  useStore(fileStore, (s) => s.root);
  const currentNode = fsHelpers.getNodeByPath(currentPath);

  const getFileIcon = (file: FSNode) => {
    if (file.type === 'folder') {
      return <Folder size={32} style={{ color: '#ffb300' }} />;
    }
    if (file.name.endsWith('.go') || file.name.endsWith('.json')) {
      return <FileCode size={32} style={{ color: '#00bcd4' }} />;
    }
    return <FileText size={32} style={{ color: '#eceff1' }} />;
  };

  const handleNodeDoubleClick = (node: FSNode) => {
    if (node.type === 'folder') {
      const nextPath = currentPath + (currentPath === '/' ? '' : '/') + node.name;
      setCurrentPath(nextPath);
      setSelectedFile(null);
    } else {
      setSelectedFile(node);
    }
  };

  const navigateBack = () => {
    if (currentPath === '/' || currentPath === '') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath('/' + parts.join('/'));
    setSelectedFile(null);
  };

  const handleOpenInVSCode = () => {
    if (selectedFile) {
      windowActions.openWindow('vscode', 'VS Code', 'vscode');
    }
  };

  return (
    <div className="finder-app font-sans">
      {/* Sidebar navigation */}
      <div className="finder-left-sidebar">
        <span className="f-side-title">Shortcuts</span>
        <button 
          onClick={() => { setCurrentPath('/Users/jeebanjyoti/Desktop'); setSelectedFile(null); }}
          className={`f-side-btn ${currentPath === '/Users/jeebanjyoti/Desktop' ? 'active' : ''}`}
        >
          <Folder size={14} />
          <span>Desktop</span>
        </button>
        <button 
          onClick={() => { setCurrentPath('/Users/jeebanjyoti/Documents'); setSelectedFile(null); }}
          className={`f-side-btn ${currentPath === '/Users/jeebanjyoti/Documents' ? 'active' : ''}`}
        >
          <Folder size={14} />
          <span>Documents</span>
        </button>
        <button 
          onClick={() => { setCurrentPath('/Users/jeebanjyoti/Downloads'); setSelectedFile(null); }}
          className={`f-side-btn ${currentPath === '/Users/jeebanjyoti/Downloads' ? 'active' : ''}`}
        >
          <Folder size={14} />
          <span>Downloads</span>
        </button>
        <button 
          onClick={() => { setCurrentPath('/Users/jeebanjyoti/Music'); setSelectedFile(null); }}
          className={`f-side-btn ${currentPath === '/Users/jeebanjyoti/Music' ? 'active' : ''}`}
        >
          <Folder size={14} />
          <span>Music</span>
        </button>
      </div>

      {/* Main panel content */}
      <div className="finder-right-panel">
        <div className="finder-navigation-header">
          <button 
            onClick={navigateBack} 
            disabled={currentPath === '/' || currentPath === ''}
            className="finder-back-btn"
          >
            <ArrowLeft size={14} />
          </button>
          <span className="finder-current-path">{currentPath}</span>
        </div>

        <div className="f-files-row">
          {currentNode?.children?.map((node) => (
            <div 
              key={node.name}
              className="f-file-item"
              onDoubleClick={() => handleNodeDoubleClick(node)}
              onClick={() => setSelectedFile(node)}
            >
              {getFileIcon(node)}
              <span>{node.name}</span>
            </div>
          ))}
          {(!currentNode?.children || currentNode.children.length === 0) && (
            <div className="p-8 text-neutral-400 text-sm w-full text-center">
              Empty directory
            </div>
          )}
        </div>

        {selectedFile && selectedFile.type === 'file' && (
          <div className="f-preview-area">
            <div className="f-preview-header">
              <span className="f-preview-title">Preview: {selectedFile.name}</span>
              <button 
                onClick={handleOpenInVSCode} 
                className="px-2 py-1 bg-purple-600 rounded text-xs text-white hover:bg-purple-700 transition"
              >
                Open in VS Code
              </button>
            </div>
            <pre className="f-preview-box">{selectedFile.content}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
export default FilesApp;
