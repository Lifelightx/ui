import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle } from 'lucide-react';
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

  // Sync with filesystem store
  useStore(fileStore, (s) => s.root);

  // Editable files list
  const workspaceFiles = [
    { name: 'System_Info.txt', path: '/Users/jeebanjyoti/Desktop' },
    { name: 'Astra-AI.json', path: '/Users/jeebanjyoti/Desktop' },
    { name: 'Sentinel-Go.go', path: '/Users/jeebanjyoti/Desktop' },
    { name: 'Readme.md', path: '/Users/jeebanjyoti/Documents' },
    { name: 'AboutMe.txt', path: '/Users/jeebanjyoti/Documents' }
  ];

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

  return (
    <div className="vscode-editor font-sans flex h-full" style={{ background: '#1e1e1e', color: '#d4d4d4' }}>
      {/* Sidebar Explorer */}
      <div className="vscode-sidebar w-48 border-r border-neutral-800 flex flex-col" style={{ background: '#252526' }}>
        <div className="vscode-sidebar-title px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-800">
          Explorer: Workspace
        </div>
        <div className="vscode-files-list flex-1 overflow-y-auto p-2 space-y-1">
          {workspaceFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => loadFileContent(file.name, file.path)}
              className={`flex items-center space-x-2 w-full text-left px-2 py-1.5 rounded text-sm transition ${
                activeFile.name === file.name ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <FileText size={14} className="text-purple-400" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Main Work Area */}
      <div className="vscode-editor-main flex-1 flex flex-col h-full">
        {/* Editor Tabs bar */}
        <div className="vscode-tabs-bar flex items-center justify-between px-4 py-1.5 bg-neutral-900 border-b border-neutral-800">
          <div className="flex items-center space-x-2 text-xs text-neutral-300">
            <span className="font-semibold text-purple-400">{activeFile.name}</span>
            <span className="text-neutral-500">({activeFile.path})</span>
          </div>
          <div className="flex items-center space-x-4">
            {saveStatus && (
              <span className="flex items-center space-x-1 text-xs text-green-400 animate-pulse">
                <CheckCircle size={12} />
                <span>{saveStatus}</span>
              </span>
            )}
            <button 
              onClick={handleSave} 
              className="flex items-center space-x-1 px-2 py-1 bg-purple-600 rounded text-xs text-white hover:bg-purple-700 transition"
            >
              <Save size={12} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="vscode-textarea-container flex-1 p-2">
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="w-full h-full bg-transparent resize-none border-none outline-none font-mono text-sm leading-relaxed"
            style={{ color: '#9cdcfe', caretColor: '#aeafad' }}
            placeholder="// Write code or edit text contents here..."
          />
        </div>
      </div>
    </div>
  );
};
export default VSCodeApp;
