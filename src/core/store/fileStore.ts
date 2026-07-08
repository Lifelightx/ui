import { createStore } from './index';

export interface FSNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FSNode[];
}

interface FileSystemState {
  root: FSNode;
}

const initialFileSystem: FileSystemState = {
  root: {
    name: 'root',
    type: 'folder',
    children: [
      {
        name: 'Users',
        type: 'folder',
        children: [
          {
            name: 'jeebanjyoti',
            type: 'folder',
            children: [
              {
                name: 'Desktop',
                type: 'folder',
                children: [
                  {
                    name: 'System_Info.txt',
                    type: 'file',
                    content: 'Host System Name: J-MALLIK-CORE\nIP Address: 192.168.1.105\nActive Kernel: Unix 24.6.0\nSub-modules: 4 operational'
                  },
                  {
                    name: 'Astra-AI.json',
                    type: 'file',
                    content: '{\n  "id": "astra-ai",\n  "category": "Enterprise AI",\n  "techStack": ["FastAPI", "React", "Docker"],\n  "status": "Production"\n}'
                  },
                  {
                    name: 'Sentinel-Go.go',
                    type: 'file',
                    content: 'package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Sentinel Telemetry Client v1.0.0 Online")\n}'
                  }
                ]
              },
              {
                name: 'Documents',
                type: 'folder',
                children: [
                  {
                    name: 'Readme.md',
                    type: 'file',
                    content: '# Welcome to the OS Virtualization Sandbox!\n\nThis is a fully interactive simulation environment designed by Antigravity.\nYou can run commands in the terminal, edit files in VSCode, launch web pages, and customize themes.'
                  },
                  {
                    name: 'AboutMe.txt',
                    type: 'file',
                    content: 'Name: Jeebanjyoti Mallik\nRole: Software Engineer & Systems Architect\nSpecialization: Distributed Systems, High-performance backend networks.'
                  }
                ]
              },
              {
                name: 'Downloads',
                type: 'folder',
                children: [
                  {
                    name: 'telemetry_audit.log',
                    type: 'file',
                    content: '[2026-07-08 09:00]: System boot successful.\n[2026-07-08 09:01]: Connected socket listeners.\n[2026-07-08 12:45]: Telemetry audit: OK.'
                  }
                ]
              },
              {
                name: 'Music',
                type: 'folder',
                children: [
                  {
                    name: 'lofi_study_beats.mp3',
                    type: 'file',
                    content: '[Audio Stream Mock binary data]'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

export const fileStore = createStore<FileSystemState>(initialFileSystem);

// Path utility functions
export const fsHelpers = {
  getNodeByPath: (path: string): FSNode | null => {
    const state = fileStore.getState();
    if (path === '/' || path === '') return state.root;
    
    const parts = path.split('/').filter(Boolean);
    let current: FSNode | undefined = state.root;

    for (const part of parts) {
      if (!current || current.type !== 'folder') return null;
      current = current.children?.find((child) => child.name === part);
    }

    return current || null;
  },

  createFile: (parentPath: string, filename: string, content: string = '') => {
    const state = fileStore.getState();
    const deepCopy = JSON.parse(JSON.stringify(state.root)) as FSNode;

    const parts = parentPath.split('/').filter(Boolean);
    let current = deepCopy;

    for (const part of parts) {
      if (current.type !== 'folder') return false;
      const found = current.children?.find((c) => c.name === part);
      if (!found) return false;
      current = found;
    }

    if (current.type !== 'folder') return false;
    current.children = current.children || [];
    
    // Check duplicate
    const existing = current.children.find((c) => c.name === filename);
    if (existing) {
      existing.content = content;
    } else {
      current.children.push({
        name: filename,
        type: 'file',
        content
      });
    }

    fileStore.setState({ root: deepCopy });
    return true;
  },

  createFolder: (parentPath: string, folderName: string) => {
    const state = fileStore.getState();
    const deepCopy = JSON.parse(JSON.stringify(state.root)) as FSNode;

    const parts = parentPath.split('/').filter(Boolean);
    let current = deepCopy;

    for (const part of parts) {
      if (current.type !== 'folder') return false;
      const found = current.children?.find((c) => c.name === part);
      if (!found) return false;
      current = found;
    }

    if (current.type !== 'folder') return false;
    current.children = current.children || [];
    
    // Duplicate check
    const existing = current.children.find((c) => c.name === folderName);
    if (existing) return false;

    current.children.push({
      name: folderName,
      type: 'folder',
      children: []
    });

    fileStore.setState({ root: deepCopy });
    return true;
  },

  deleteNode: (parentPath: string, name: string) => {
    const state = fileStore.getState();
    const deepCopy = JSON.parse(JSON.stringify(state.root)) as FSNode;

    const parts = parentPath.split('/').filter(Boolean);
    let current = deepCopy;

    for (const part of parts) {
      if (current.type !== 'folder') return false;
      const found = current.children?.find((c) => c.name === part);
      if (!found) return false;
      current = found;
    }

    if (current.type !== 'folder' || !current.children) return false;
    current.children = current.children.filter((c) => c.name !== name);

    fileStore.setState({ root: deepCopy });
    return true;
  }
};
