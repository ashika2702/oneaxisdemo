import { useThemeStore } from '@/store/useThemeStore';
import { Sun, Moon, Monitor, Eye, EyeOff, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, reducedMotion, setReducedMotion, sidebarCollapsed, setSidebarCollapsed } = useThemeStore();

  return (
    <div className="flex items-center gap-1 bg-gray-900/90 rounded-lg p-1 border border-gray-600 shadow-lg">
      {/* Theme modes */}
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded transition-all ${theme === 'dark' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        title="Dark mode"
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded transition-all ${theme === 'light' ? 'bg-amber-500 text-gray-900 shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        title="Light mode"
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('modern')}
        className={`p-1.5 rounded transition-all ${theme === 'modern' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        title="Modern gradient"
        aria-label="Modern gradient"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-gray-600 mx-0.5" />
      {/* Accessibility */}
      <button
        onClick={() => setReducedMotion(!reducedMotion)}
        className={`p-1.5 rounded transition-all ${reducedMotion ? 'bg-amber-500/30 text-amber-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        title={reducedMotion ? 'Reduced motion on' : 'Reduced motion off'}
        aria-label="Toggle reduced motion"
      >
        {reducedMotion ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
        title="Toggle sidebar"
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
      </button>
    </div>
  );
}
