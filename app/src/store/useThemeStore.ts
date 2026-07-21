import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light' | 'modern';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  density: 'compact' | 'comfortable' | 'spacious';
  setDensity: (d: 'compact' | 'comfortable' | 'spacious') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const modes: ThemeMode[] = ['dark', 'light', 'modern'];
        const idx = modes.indexOf(get().theme);
        set({ theme: modes[(idx + 1) % modes.length] });
      },
      reducedMotion: false,
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      sidebarCollapsed: false,
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      density: 'comfortable',
      setDensity: (density) => set({ density }),
    }),
    { name: 'oneaxis-theme' }
  )
);
