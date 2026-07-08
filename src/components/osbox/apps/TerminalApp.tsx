import React, { useState, useRef, useEffect } from 'react';

interface TerminalAppProps {
  osType: 'macos' | 'windows' | 'linux';
}

interface CommandLog {
  cmd: string;
  out: string;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ osType }) => {
  const [termInput, setTermInput] = useState('');
  const [termLogs, setTermLogs] = useState<CommandLog[]>([
    { cmd: 'system_init', out: `Welcome to ${osType === 'macos' ? 'zsh' : osType === 'windows' ? 'PowerShell' : 'bash'} shell.\nType "help" to view available commands.` }
  ]);
  
  const termEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [termLogs]);

  const virtualFiles = {
    'system_info.txt': 'Host System Name: J-MALLIK-CORE\nIP Address: 192.168.1.105\nActive Kernel: Unix 24.6.0\nSub-modules: 4 operational',
    'astra-ai.json': '{\n  "id": "astra-ai",\n  "category": "Enterprise AI",\n  "techStack": ["FastAPI", "React", "Docker"],\n  "status": "Production"\n}',
    'sentinel-go.go': 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Sentinel Telemetry Client v1.0.0 Online")\n}',
    'uptimelogs.log': '[2026-07-08 09:00]: System boot successful.\n[2026-07-08 09:01]: Connected socket listeners.\n[2026-07-08 12:45]: Telemetry audit: OK.'
  };

  const handleCommandRun = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = termInput.trim();
    if (!cleanCmd) return;

    let output = '';
    const parts = cleanCmd.split(' ');
    const primary = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (primary) {
      case 'help':
        output = 'Available commands:\n  help        - List command help information\n  ls          - List directory contents\n  cat <file>  - Display file contents\n  whoami      - Print active user session\n  neofetch    - Display operating system diagnostics\n  clear       - Clear screen history';
        break;
      case 'clear':
        setTermLogs([]);
        setTermInput('');
        return;
      case 'whoami':
        output = osType === 'macos' ? 'jeebanjyoti@apple-macbook-pro' : osType === 'windows' ? 'DESKTOP-CORE\\Administrator' : 'ubuntu@ubuntu-node-01';
        break;
      case 'ls':
        output = 'system_info.txt   astra-ai.json   sentinel-go.go   uptimelogs.log';
        break;
      case 'cat':
        if (!arg) {
          output = 'Usage: cat <filename>';
        } else {
          const matchKey = Object.keys(virtualFiles).find(k => k.toLowerCase() === arg.toLowerCase());
          if (matchKey) {
            output = (virtualFiles as any)[matchKey];
          } else {
            output = `cat: ${arg}: No such file or directory`;
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

    setTermLogs(prev => [...prev, { cmd: cleanCmd, out: output }]);
    setTermInput('');
  };

  const promptSym = osType === 'linux' ? 'ubuntu@node:~$ ' : osType === 'windows' ? 'PS C:\\Users\\Admin> ' : 'jeebanjyoti@macbook % ';
  const promptColor = osType === 'linux' ? '#df4a16' : osType === 'windows' ? '#0078d7' : '#a855f7';

  return (
    <div className="terminal-app">
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
          placeholder='Type "help", "neofetch", "ls"...'
          autoFocus
          autoComplete="off"
          style={{ caretColor: promptColor }}
        />
      </form>
    </div>
  );
};
export default TerminalApp;
