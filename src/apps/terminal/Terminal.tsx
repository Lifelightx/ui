import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../core/store/index';
import { fileStore, fsHelpers } from '../../core/store/fileStore';

interface TerminalAppProps {
  osType: 'macos' | 'windows' | 'ubuntu';
}

interface CommandLog {
  cmd: string;
  out: string;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ osType }) => {
  const [termInput, setTermInput] = useState('');
  const [currentPath, setCurrentPath] = useState('/Users/jeebanjyoti');
  const [termLogs, setTermLogs] = useState<CommandLog[]>([
    { cmd: 'system_init', out: `Welcome to ${osType === 'macos' ? 'zsh' : osType === 'windows' ? 'PowerShell' : 'bash'} shell.\nType "help" to view available commands.` }
  ]);
  
  const termEndRef = useRef<HTMLDivElement>(null);

  // Sync with file system updates automatically
  useStore(fileStore, (s) => s.root);

  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [termLogs]);

  const handleCommandRun = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = termInput.trim();
    if (!cleanCmd) return;

    let output = '';
    const parts = cleanCmd.split(' ');
    const primary = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    const currentNode = fsHelpers.getNodeByPath(currentPath);

    switch (primary) {
      case 'help':
        output = 'Available commands:\n  help         - List command help information\n  pwd          - Print current directory path\n  ls           - List folder contents\n  cd <dir>     - Navigate to folder\n  cat <file>   - Display file contents\n  touch <file> - Create a new file\n  mkdir <dir>  - Create a new directory\n  rm <file/dir>- Remove file or directory\n  whoami       - Print active user session\n  neofetch     - Display operating system diagnostics\n  clear        - Clear screen history';
        break;
      case 'clear':
        setTermLogs([]);
        setTermInput('');
        return;
      case 'whoami':
        output = osType === 'macos' ? 'jeebanjyoti@apple-macbook-pro' : osType === 'windows' ? 'DESKTOP-CORE\\Administrator' : 'ubuntu@ubuntu-node-01';
        break;
      case 'pwd':
        output = currentPath;
        break;
      case 'ls':
        if (currentNode && currentNode.type === 'folder' && currentNode.children) {
          if (currentNode.children.length === 0) {
            output = '(empty directory)';
          } else {
            output = currentNode.children.map((child) => child.name + (child.type === 'folder' ? '/' : '')).join('   ');
          }
        } else {
          output = 'ls: error reading directory';
        }
        break;
      case 'cd':
        if (!arg) {
          setCurrentPath('/Users/jeebanjyoti');
          output = 'Returned to home directory.';
        } else {
          let targetPath = '';
          if (arg === '..') {
            const segs = currentPath.split('/').filter(Boolean);
            segs.pop();
            targetPath = '/' + segs.join('/');
          } else if (arg.startsWith('/')) {
            targetPath = arg;
          } else {
            targetPath = currentPath + (currentPath === '/' ? '' : '/') + arg;
          }

          const targetNode = fsHelpers.getNodeByPath(targetPath);
          if (targetNode && targetNode.type === 'folder') {
            setCurrentPath(targetPath);
          } else {
            output = `cd: no such directory: ${arg}`;
          }
        }
        break;
      case 'cat':
        if (!arg) {
          output = 'Usage: cat <filename>';
        } else {
          const filePath = currentPath + (currentPath === '/' ? '' : '/') + arg;
          const fileNode = fsHelpers.getNodeByPath(filePath);
          if (fileNode && fileNode.type === 'file') {
            output = fileNode.content || '(empty file)';
          } else {
            output = `cat: ${arg}: No such file`;
          }
        }
        break;
      case 'touch':
        if (!arg) {
          output = 'Usage: touch <filename>';
        } else {
          const created = fsHelpers.createFile(currentPath, arg, '');
          if (created) {
            output = `Created file: ${arg}`;
          } else {
            output = `touch: cannot create file: ${arg}`;
          }
        }
        break;
      case 'mkdir':
        if (!arg) {
          output = 'Usage: mkdir <foldername>';
        } else {
          const created = fsHelpers.createFolder(currentPath, arg);
          if (created) {
            output = `Created folder: ${arg}`;
          } else {
            output = `mkdir: folder already exists or path invalid`;
          }
        }
        break;
      case 'rm':
        if (!arg) {
          output = 'Usage: rm <name>';
        } else {
          const deleted = fsHelpers.deleteNode(currentPath, arg);
          if (deleted) {
            output = `Removed: ${arg}`;
          } else {
            output = `rm: cannot remove ${arg}: no such file or folder`;
          }
        }
        break;
      case 'neofetch':
        if (osType === 'macos') {
          output = `                   ,x88888x,        OS: macOS Sequoia 15.0\n                ,888888888888,      Kernel: Darwin 24.0.0 x86_64\n              ,8888888x88888888,    Uptime: 2 hours, 14 mins\n             88888888888888888888   Shell: zsh 5.9\n            888888888888888888888   DE: Aqua\n           8888888888888888888888   WM: Quartz Compositor\n           8888888888888888888888   Terminal: Terminal.app\n           8888888888888888888888   CPU: Apple M3 Pro Max\n            88888888888888888888    Memory: 32 GB RAM\n             888888888888888888\n              \`x888888888888x\`\n                \`x88888888x\``;
        } else if (osType === 'windows') {
          output = `   #################   OS: Windows 11 Enterprise Pro\n   #################   Kernel: Windows NT 10.0.22631\n   #################   Uptime: 4 hours, 32 mins\n   #################   Shell: PowerShell v7.4.1\n                       DE: Fluent Workspace\n   #################   WM: Desktop Window Manager\n   #################   CPU: Intel Core i9-14900K @ 5.80GHz\n   #################   Memory: 64 GB RAM\n   #################   System Architecture: x64`;
        } else {
          output = `            .---.            OS: Ubuntu 24.04 LTS (Noble Numbat)\n           /     \\           Kernel: Linux 6.8.0-31-generic\n          \\\\      //          Uptime: 6 days, 18 hours\n           \\\\====//           Shell: bash 5.2.21\n          / \`\`\`\`\` \\          DE: GNOME 46.0\n         / |     | \\         WM: Mutter (Wayland)\n        {  |     |  }        CPU: AMD Ryzen 9 7950X\n        |  |     |  |        Memory: 128 GB RAM\n       /   |     |   \\\n      /    \`-----\`    \\\n     # oooooo###oooooo #`;
        }
        break;
      default:
        output = `${primary}: command not found. Type "help" for a list of operations.`;
    }

    setTermLogs((prev) => [...prev, { cmd: cleanCmd, out: output }]);
    setTermInput('');
  };

  const promptSym = osType === 'ubuntu' ? `ubuntu@node:${currentPath}$ ` : osType === 'windows' ? `PS ${currentPath.replace(/\//g, '\\')}> ` : `jeebanjyoti@macbook ${currentPath.split('/').pop()} % `;
  const promptColor = osType === 'ubuntu' ? '#df4a16' : osType === 'windows' ? '#0078d7' : '#a855f7';

  return (
    <div className="terminal-app" onClick={() => termEndRef.current?.scrollIntoView({ behavior: 'smooth' })}>
      <div className="term-history-log">
        {termLogs.map((log, idx) => (
          <div key={idx} className="term-history-item">
            <span style={{ color: promptColor, fontWeight: 'bold' }}>{promptSym}</span>
            <span style={{ color: '#fff' }}>{log.cmd}</span>
            <pre className="term-out-text">{log.out}</pre>
          </div>
        ))}
        <div ref={termEndRef} />
      </div>

      <form onSubmit={handleCommandRun} className="term-prompt-line">
        <span style={{ color: promptColor, fontWeight: 'bold' }}>{promptSym}</span>
        <input 
          type="text" 
          value={termInput}
          onChange={(e) => setTermInput(e.target.value)}
          className="term-input-field"
          placeholder='Type "help", "ls", "cd", "neofetch"...'
          autoFocus
          autoComplete="off"
          style={{ caretColor: promptColor }}
        />
      </form>
    </div>
  );
};
export default TerminalApp;
