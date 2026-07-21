import { useState } from 'react';
import {
  Code, Copy, Check, Eye, Settings,
  Monitor, Smartphone, Palette, Link2,
  Info
} from 'lucide-react';
import EmbedWidget from '@/components/EmbedWidget';

export default function EmbedWidgetPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'configure' | 'code'>('preview');
  const [config, setConfig] = useState({
    theme: 'light' as 'light' | 'dark' | 'auto',
    showPricing: true,
    showContact: true,
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    width: '100%',
    height: '600px',
  });

  const embedCode = `<iframe
  src="https://oneaxis.live/embed/${config.theme}"
  width="${config.width}"
  height="${config.height}"
  style="border:none;border-radius:16px;"
  title="Azure Heights Tower"
></iframe>`;

  const scriptCode = `<script
  src="https://oneaxis.live/widget.js"
  data-project="azure-heights"
  data-theme="${config.theme}"
  data-pricing="${config.showPricing}"
  data-contact="${config.showContact}"
  data-primary="${config.primaryColor}"
></script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Embed Widget</h1>
          </div>
          <p className="text-gray-400 text-sm max-w-xl">
            Generate an embeddable widget for your project website. Let visitors explore units,
            view pricing, and make enquiries without leaving your site.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 w-fit">
          {([
            { id: 'preview', label: 'Live Preview', icon: Eye },
            { id: 'configure', label: 'Configure', icon: Settings },
            { id: 'code', label: 'Get Code', icon: Code },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-400" />
                Desktop Preview
              </h3>
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <EmbedWidget />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                Mobile Preview
              </h3>
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 flex justify-center">
                <div className="w-[375px]">
                  <EmbedWidget />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'configure' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  Appearance
                </h3>

                <div>
                  <label className="text-xs text-gray-500 block mb-2">Theme</label>
                  <div className="flex gap-2">
                    {(['light', 'dark', 'auto'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setConfig({ ...config, theme: t })}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                          config.theme === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-2">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-gray-600 bg-transparent cursor-pointer" />
                      <span className="text-sm font-mono text-gray-300">{config.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-2">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-gray-600 bg-transparent cursor-pointer" />
                      <span className="text-sm font-mono text-gray-300">{config.accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 space-y-5">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  Content
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'showPricing' as const, label: 'Show Pricing', desc: 'Display unit prices' },
                    { key: 'showContact' as const, label: 'Show Contact', desc: 'Display agent contact details' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg cursor-pointer">
                      <div>
                        <div className="text-sm text-white">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => setConfig({ ...config, [item.key]: !config[item.key] })}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          config[item.key] ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                          config[item.key] ? 'left-[22px]' : 'left-[2px]'
                        }`} />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Preview</h3>
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 sticky top-6">
                <EmbedWidget />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-blue-400" />
                    IFrame Embed
                  </h3>
                  <button
                    onClick={() => copyToClipboard(embedCode)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-900 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto font-mono">
                  {embedCode}
                </pre>
              </div>

              <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-400" />
                    JavaScript Embed
                  </h3>
                  <button
                    onClick={() => copyToClipboard(scriptCode)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-900 rounded-lg p-4 text-xs text-gray-300 overflow-x-auto font-mono">
                  {scriptCode}
                </pre>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-400">
                  <p className="text-white font-medium mb-1">Integration Guide</p>
                  <p>Paste the iframe code into any section of your website. The widget is fully responsive and will adapt to the container width. For WordPress, use the Custom HTML block.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Preview</h3>
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <EmbedWidget />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
