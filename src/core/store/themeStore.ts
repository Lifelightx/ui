import { createStore } from './index';

export type OSType = 'macos' | 'windows' | 'ubuntu';

interface ThemeState {
  currentOS: OSType;
  accentColor: string;
  wallpaper: string;
  soundEnabled: boolean;
}

const getInitialOS = (): OSType => {
  const path = window.location.pathname;
  if (path.includes('macos')) return 'macos';
  if (path.includes('windows')) return 'windows';
  if (path.includes('linux')) return 'ubuntu';
  return 'macos'; // default
};

const initialThemeState: ThemeState = {
  currentOS: getInitialOS(),
  accentColor: '#a855f7',
  wallpaper: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0f172a 100%)',
  soundEnabled: true
};

export const themeStore = createStore<ThemeState>(initialThemeState);

export const themeActions = {
  setOS: (os: OSType) => {
    let wp = 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0f172a 100%)';
    let accent = '#a855f7';
    
    if (os === 'windows') {
      wp = 'linear-gradient(135deg, #0f172a 0%, #0b3c5d 50%, #092c3e 100%)';
      accent = '#0078d4';
    } else if (os === 'ubuntu') {
      wp = 'linear-gradient(135deg, #2c001e 0%, #5e2750 50%, #11000e 100%)';
      accent = '#df4a16';
    }

    themeStore.setState({
      currentOS: os,
      wallpaper: wp,
      accentColor: accent
    });
  },

  setAccentColor: (color: string) => {
    themeStore.setState({ accentColor: color });
  },

  setWallpaper: (wallpaper: string) => {
    themeStore.setState({ wallpaper });
  },

  toggleSound: () => {
    const current = themeStore.getState().soundEnabled;
    themeStore.setState({ soundEnabled: !current });
  }
};
