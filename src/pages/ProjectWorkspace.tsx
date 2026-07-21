import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Home, Eye, Layers, MessageSquare, GitCompare,
  Sparkles, FileCheck, Upload, ChevronLeft, ChevronRight, X,
  Send, Bot, User, TrendingUp, AlertTriangle, Lightbulb,
  CheckCircle, Clock, DollarSign, Maximize2, Minimize2, CreditCard,
  RotateCcw, Share2, Bookmark, Code, FileOutput, Target, BarChart3, Calculator, Trophy,
  Building2, HardHat, Hammer, ClipboardCheck,
  Grid3X3, Mountain, FileText, Compass, Sofa, MapPinned, Menu,
  Droplets, Users, UserCheck, Zap, Database, Globe, MessageCircle,
  Wand2, Sun, Layout, MapPin, Leaf,
  Presentation, Megaphone, Cpu, Radio, Factory,
  Activity, Flame, Shield, GitPullRequest, GitBranch, RefreshCw, Star, Moon, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import type { ViewMode, ChatMessage, Unit } from '@/types';

// Room type icon mapping
const sectionIcons: Record<string, React.ReactNode> = {
  living: <Sofa className="w-4 h-4" />,
  kitchen: <Home className="w-4 h-4" />,
  bedroom: <Eye className="w-4 h-4" />,
  bathroom: <Droplets className="w-4 h-4" />,
  dining: <Users className="w-4 h-4" />,
  garage: <Box className="w-4 h-4" />,
  pool: <Droplets className="w-4 h-4" />,
  garden: <Mountain className="w-4 h-4" />,
  balcony: <Eye className="w-4 h-4" />,
  study: <FileText className="w-4 h-4" />,
  gym: <Zap className="w-4 h-4" />,
  foyer: <Home className="w-4 h-4" />,
  'maid-room': <Users className="w-4 h-4" />,
};

import NotificationCenter from '@/components/NotificationCenter';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

/* ─── Heavy components loaded on-demand ─── */
const Enhanced3DViewer = lazy(() => import('@/components/Enhanced3DViewer'));
const ResidentialHome3D = lazy(() => import('@/components/ResidentialHome3D'));
const AerialLotMap = lazy(() => import('@/components/AerialLotMap'));
const PanoramaViewer = lazy(() => import('@/components/PanoramaViewer'));
const BrochureExport = lazy(() => import('@/components/BrochureExport'));
const SiteMapPanel = lazy(() => import('@/components/SiteMapPanel'));
const LotIngestionEngine = lazy(() => import('@/components/LotIngestionEngine'));
const LotArrayView = lazy(() => import('@/components/LotArrayView'));
const TrueViewEngine = lazy(() => import('@/components/TrueViewEngine'));
const ComparisonCart = lazy(() => import('@/components/ComparisonCart'));
const AgentCopilot = lazy(() => import('@/components/AgentCopilot'));
const PromptToRender = lazy(() => import('@/components/PromptToRender'));
const TemplateMarketplace = lazy(() => import('@/components/TemplateMarketplace'));
const NeighbourhoodIntelligence = lazy(() => import('@/components/NeighbourhoodIntelligence'));
const SustainabilityVisualiser = lazy(() => import('@/components/SustainabilityVisualiser'));
const SunlightShadowEngine = lazy(() => import('@/components/SunlightShadowEngine'));
const ReportGenerator = lazy(() => import('@/components/ReportGenerator'));
const FinancialProjections = lazy(() => import('@/components/FinancialProjections'));
const PitchDeckBuilder = lazy(() => import('@/components/PitchDeckBuilder'));
const MarketingCommandCenter = lazy(() => import('@/components/MarketingCommandCenter'));
const AlgorithmPanel = lazy(() => import('@/components/AlgorithmPanel'));
const LiveDataIntelligence = lazy(() => import('@/components/LiveDataIntelligence'));
const EnvironmentalImpact = lazy(() => import('@/components/EnvironmentalImpact'));
const InfrastructureLayer = lazy(() => import('@/components/InfrastructureLayer'));
const CityDigitalTwin = lazy(() => import('@/components/CityDigitalTwin'));
const ConstructionPhasing = lazy(() => import('@/components/ConstructionPhasing'));
const HotspotAnnotations = lazy(() => import('@/components/HotspotAnnotations'));
const SolarOptimizer = lazy(() => import('@/components/SolarOptimizer'));
const PulseDashboard = lazy(() => import('@/components/PulseDashboard'));
const RevenueAtRisk = lazy(() => import('@/components/RevenueAtRisk'));
const AxisConcierge = lazy(() => import('@/components/AxisConcierge'));
const HOLDSuite = lazy(() => import('@/components/HOLDSuite'));
const OrgManager = lazy(() => import('@/components/OrgManager'));
const ApprovalWorkflow = lazy(() => import('@/components/ApprovalWorkflow'));
const ModelVersioning = lazy(() => import('@/components/ModelVersioning'));
const DataFlywheel = lazy(() => import('@/components/DataFlywheel'));
const SettingsHub = lazy(() => import('@/components/SettingsHub'));
const BuyerPortal = lazy(() => import('@/components/BuyerPortal'));
const SettlementRadar = lazy(() => import('@/components/SettlementRadar'));
const WidgetBuilder = lazy(() => import('@/components/WidgetBuilder'));
const UploadPipeline = lazy(() => import('@/components/UploadPipeline'));
const ProposalGenerator = lazy(() => import('@/components/ProposalGenerator'));
import ErrorBoundary from '@/components/ErrorBoundary';
import ThemeToggle from '@/components/ThemeToggle';
import { getDefaultModules, ALL_MODULES, type ProjectType } from '@/lib/moduleRegistry';

/* ────────────────────────────────────────────────
   3D SCENE SELECTOR — Renders the right model
   for each project type
   ──────────────────────────────────────────────── */
/* ────────────────────────────────────────────────
   STACK PLAN VIEW
   ──────────────────────────────────────────────── */
function StackPlanView({ units, selectedUnit, onSelectUnit }: { units: Unit[]; selectedUnit: string | null; onSelectUnit: (id: string) => void }) {
  const maxFloor = Math.max(...units.map((u) => u.floor));
  const floors = Array.from({ length: maxFloor }, (_, i) => maxFloor - i);
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-white font-semibold">Stack Plan</h3>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-emerald-500" /> Available</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-blue-500" /> Reserved</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-gray-500" /> Sold</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-amber-500" /> Coming Soon</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 px-2">
        {floors.map((floor) => {
          const floorUnits = units.filter((u) => u.floor === floor);
          return (
            <div key={floor} className="flex items-center gap-2">
              <div className="w-8 text-xs text-gray-500 font-mono text-right">{floor}</div>
              <div className="flex-1 flex gap-1">
                {floorUnits.map((unit) => {
                  const isSelected = selectedUnit === unit.id;
                  const bgColor = unit.status === 'available' ? 'bg-emerald-500 hover:bg-emerald-400' :
                                  unit.status === 'sold' ? 'bg-gray-600' :
                                  unit.status === 'reserved' ? 'bg-blue-500 hover:bg-blue-400' :
                                  'bg-amber-500 hover:bg-amber-400';
                  
                  return (
                    <button
                      key={unit.id}
                      onClick={() => onSelectUnit(unit.id)}
                      className={`flex-1 h-10 rounded-md ${bgColor} ${
                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                      } transition-all flex items-center justify-center text-xs text-white font-medium`}
                    >
                      {unit.unitNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   UNIT DETAIL PANEL
   ──────────────────────────────────────────────── */
function UnitDetailPanel({ unit, onClose }: { unit: Unit; onClose: () => void }) {
  const [activeMaterialTab, setActiveMaterialTab] = useState('flooring');
  const { projects, activeProjectId, updateProject } = useStore();
  const project = projects.find((p) => p.id === activeProjectId);
  
  if (!unit || !project) return null;
  
  const materials = project.materials.filter((m) => m.category.toLowerCase() === activeMaterialTab);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-80 glass-panel border-l border-gray-700 h-full overflow-y-auto scrollbar-thin"
    >
      <div className="p-5 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">Unit {unit.unitNumber}</h3>
          <p className="text-gray-400 text-sm">{unit.type}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-5 space-y-5">
        {/* Status & Price */}
        <div className="flex items-center justify-between">
          <Badge className={
            unit.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' :
            unit.status === 'sold' ? 'bg-gray-500/10 text-gray-400' :
            unit.status === 'reserved' ? 'bg-blue-500/10 text-blue-400' :
            'bg-amber-500/10 text-amber-400'
          }>
            {unit.status}
          </Badge>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">${(unit.price / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500">{unit.area} sqm</div>
          </div>
        </div>
        
        {/* Specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-500 text-xs">Bedrooms</div>
            <div className="text-white font-semibold">{unit.bedrooms}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-500 text-xs">Bathrooms</div>
            <div className="text-white font-semibold">{unit.bathrooms}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-500 text-xs">View</div>
            <div className="text-white font-semibold">{unit.view}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-gray-500 text-xs">Facing</div>
            <div className="text-white font-semibold">{unit.facing}</div>
          </div>
        </div>
        
        {/* Material Customization */}
        <div>
          <h4 className="text-white font-medium mb-3">Customize Finishes</h4>
          <div className="flex gap-2 mb-3">
            {['flooring', 'kitchen', 'bathroom'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveMaterialTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                  activeMaterialTab === tab 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-gray-800/50 text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            {materials.map((mat) => (
              <div 
                key={mat.id} 
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                  unit.materials[activeMaterialTab] === mat.name
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'
                }`}
                onClick={() => {
                  const updatedMaterials = { ...unit.materials, [activeMaterialTab]: mat.name };
                  updateProject(project.id, {
                    units: project.units.map((u) => 
                      u.id === unit.id ? { ...u, materials: updatedMaterials } : u
                    ),
                  });
                }}
              >
                <div 
                  className="w-8 h-8 rounded-lg border border-gray-600 flex-shrink-0"
                  style={{ backgroundColor: mat.color }}
                />
                <div className="flex-1">
                  <div className="text-sm text-white">{mat.name}</div>
                  <div className="text-xs text-gray-500">{mat.availability}</div>
                </div>
                <div className="text-right">
                  {mat.pricePerUnit > 0 && (
                    <div className="text-sm text-amber-400">+${mat.pricePerUnit.toLocaleString()}</div>
                  )}
                  {mat.pricePerUnit === 0 && (
                    <div className="text-xs text-emerald-400">Included</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Summary */}
        <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Base Price</span>
            <span className="text-white">${(unit.basePrice / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Customizations</span>
            <span className="text-amber-400">+${unit.customizationPrice.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-700 pt-2 flex justify-between">
            <span className="text-white font-medium">Total</span>
            <span className="text-white font-bold text-lg">${(unit.price / 1000).toFixed(0)}K</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">
            <Bookmark className="w-4 h-4 mr-2" />
            Reserve Unit
          </Button>
          <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
            <Share2 className="w-4 h-4 mr-2" />
            Share With Client
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────
   AI CHAT PANEL
   ──────────────────────────────────────────────── */
function AIChatPanel() {
  const { chatMessages, addChatMessage, projects, activeProjectId } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const project = projects.find((p) => p.id === activeProjectId);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const handleSend = () => {
    if (!input.trim() || !project) return;
    
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      type: 'text',
    };
    
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'price': `Based on the current pricing for ${project.name}, the average unit price is $${(project.units.reduce((a, u) => a + u.price, 0) / project.units.length / 1000).toFixed(0)}K. Marina view units carry an 8% premium. Would you like me to run a pricing optimization scenario?`,
        'sold': `So far, ${project.units.filter(u => u.status === 'sold').length} of ${project.units.length} units have been sold (${Math.round(project.units.filter(u => u.status === 'sold').length / project.units.length * 100)}%). The fastest-moving unit type is the 2-BR at 75% sell-through.`,
        'recommend': `I've analyzed ${project.name} against 47 similar projects. My top recommendation: convert two 1-BR units on floors 8-12 to studios. This could increase total project revenue by 3.2% based on market demand patterns.`,
        'compare': `Comparing the available units: Type C (2-BR) offers the best value per sqm at $600/sqm vs $750/sqm for Type D. However, Type D has a 95% marina view attach rate which justifies the premium.`,
        'default': `I've analyzed your question about "${input}". Based on the project data for ${project.name}, I can see several relevant insights. Would you like me to generate a detailed report or create a what-if scenario to explore this further?`,
      };
      
      const lowerInput = input.toLowerCase();
      const responseKey = Object.keys(responses).find(k => lowerInput.includes(k)) || 'default';
      
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responses[responseKey],
        timestamp: new Date().toISOString(),
        type: lowerInput.includes('recommend') ? 'insight' : lowerInput.includes('compare') ? 'comparison' : 'text',
      };
      
      addChatMessage(aiMsg);
      setIsTyping(false);
    }, 1500);
  };
  
  const suggestions = [
    'Show me the cheapest 3-bedroom units',
    'Compare Type B vs Type C pricing',
    'What is the best unit mix for revenue?',
    'Generate a pricing scenario',
  ];
  
  return (
    <div className="h-full flex flex-col glass-panel border-l border-gray-700">
      <div className="p-4 border-b border-gray-700 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white font-medium text-sm">OneAxis AI</h3>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Online</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant' 
                ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                : 'bg-gray-700'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-300'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-gray-800 p-3 rounded-xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        {/* Suggestions */}
        {chatMessages.length <= 1 && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-gray-500 mb-2">Try asking:</div>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(s);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg bg-gray-800/50 text-xs text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about pricing, units, scenarios..."
            className="bg-gray-800 border-gray-700 text-gray-300 placeholder:text-gray-600"
          />
          <Button 
            size="icon" 
            className="bg-blue-600 hover:bg-blue-500 flex-shrink-0"
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   WHAT-IF SIMULATOR
   ──────────────────────────────────────────────── */
function WhatIfSimulator() {
  const { projects, activeProjectId } = useStore();
  const project = projects.find((p) => p.id === activeProjectId);
  const [floorPremium, setFloorPremium] = useState(2);
  const [viewPremium, setViewPremium] = useState(8);
  const [cornerPremium, setCornerPremium] = useState(5);
  const [selectedMaterial, setSelectedMaterial] = useState('standard');
  
  if (!project) return null;
  
  const currentTotal = project.units.reduce((a, u) => a + u.price, 0);
  
  // Calculate scenario total
  const scenarioTotal = project.units.reduce((a, u) => {
    let price = u.basePrice;
    price *= (1 + (u.floor - 1) * floorPremium / 100);
    if (u.view === 'Marina View') price *= (1 + viewPremium / 100);
    if (u.view === 'Corner Premium') price *= (1 + cornerPremium / 100);
    if (selectedMaterial === 'premium') price += 15000;
    if (selectedMaterial === 'luxury') price += 35000;
    return a + price;
  }, 0);
  
  const delta = scenarioTotal - currentTotal;
  const deltaPercent = (delta / currentTotal * 100).toFixed(1);
  
  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">What-If Simulator</h2>
        <p className="text-gray-400 text-sm">Adjust pricing rules and materials to see instant impact on total project value.</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              Pricing Rules
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">Floor Premium (per floor)</label>
                  <span className="text-sm text-blue-400 font-medium">+{floorPremium}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={floorPremium}
                  onChange={(e) => setFloorPremium(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">View Premium (Marina)</label>
                  <span className="text-sm text-blue-400 font-medium">+{viewPremium}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={viewPremium}
                  onChange={(e) => setViewPremium(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>20%</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-gray-300">Corner Premium</label>
                  <span className="text-sm text-blue-400 font-medium">+{cornerPremium}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={cornerPremium}
                  onChange={(e) => setCornerPremium(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Material Package
            </h3>
            
            <div className="space-y-2">
              {[
                { id: 'standard', name: 'Standard Package', desc: 'Porcelain tile, standard kitchen, chrome fixtures', price: 0 },
                { id: 'premium', name: 'Premium Package', desc: 'Oak hardwood, walnut kitchen, brushed gold', price: 15000 },
                { id: 'luxury', name: 'Luxury Package', desc: 'Marble flooring, custom kitchen, designer fixtures', price: 35000 },
              ].map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedMaterial(pkg.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedMaterial === pkg.id
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white font-medium">{pkg.name}</div>
                    {pkg.price > 0 && <div className="text-sm text-amber-400">+${pkg.price.toLocaleString()}/unit</div>}
                    {pkg.price === 0 && <div className="text-xs text-emerald-400">Included</div>}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{pkg.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="space-y-5">
          <div className="glass-panel rounded-xl p-5 bg-gradient-to-br from-blue-950/50 to-cyan-950/50 border-blue-500/20">
            <h3 className="text-white font-medium mb-4">Project Value Impact</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Current Total Value</span>
                <span className="text-white font-semibold">${(currentTotal / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Scenario Total Value</span>
                <span className="text-white font-bold text-xl">${(scenarioTotal / 1000000).toFixed(2)}M</span>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Value Impact</span>
                  <div className={`text-lg font-bold ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {delta >= 0 ? '+' : ''}${(delta / 1000).toFixed(0)}K ({deltaPercent}%)
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual bar */}
            <div className="mt-4">
              <div className="flex items-end gap-4 h-32">
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">Current</div>
                  <div 
                    className="w-full bg-gray-700 rounded-t-lg transition-all"
                    style={{ height: `${(currentTotal / scenarioTotal) * 100}%` }}
                  />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-emerald-400 mb-2">Scenario</div>
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all"
                    style={{ height: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel rounded-xl p-5">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              AI Insight
            </h3>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
              <Lightbulb className="w-4 h-4 inline mr-1" />
              With these adjustments, your project value increases by {deltaPercent}%. 
              Based on market data, the premium material package has a 68% selection rate 
              and typically accelerates sales velocity by 15%.
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white">
              <Bookmark className="w-4 h-4 mr-2" />
              Save Scenario
            </Button>
            <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   AI OPTIONEER
   ──────────────────────────────────────────────── */
function AIOptioneer() {
  const { projects, activeProjectId } = useStore();
  const project = projects.find((p) => p.id === activeProjectId);
  const [generating, setGenerating] = useState(false);
  const [scenarios, setScenarios] = useState<any[]>([]);
  
  const generateOptions = () => {
    setGenerating(true);
    setTimeout(() => {
      setScenarios([
        { name: 'Maximum Revenue', revenue: 52.4, units: 50, avgPrice: 1.05, risk: 'Medium', color: 'from-blue-500 to-cyan-400' },
        { name: 'Fastest Sell-Out', revenue: 48.2, units: 48, avgPrice: 1.0, risk: 'Low', color: 'from-emerald-500 to-teal-400' },
        { name: 'Balanced Mix', revenue: 50.1, units: 49, avgPrice: 1.02, risk: 'Low', color: 'from-purple-500 to-pink-400' },
        { name: 'Premium Focus', revenue: 55.8, units: 44, avgPrice: 1.27, risk: 'High', color: 'from-amber-500 to-orange-400' },
      ]);
      setGenerating(false);
    }, 2000);
  };
  
  if (!project) return null;
  
  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">AI Optioneer</h2>
        <p className="text-gray-400 text-sm">Generate optimized project configurations based on your constraints.</p>
      </div>
      
      {scenarios.length === 0 && (
        <div className="glass-panel rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Generate Optimal Configurations</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Our AI will analyze your project constraints and generate multiple viable configurations 
            with full revenue modeling and risk assessment.
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Unit mix optimization
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Revenue modeling
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Risk assessment
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Market benchmarking
            </div>
          </div>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-500 text-white px-8"
            onClick={generateOptions}
            disabled={generating}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Options
              </>
            )}
          </Button>
        </div>
      )}
      
      {scenarios.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">4 Optimal Configurations Generated</h3>
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300" onClick={() => setScenarios([])}>
              <RotateCcw className="w-3 h-3 mr-1" />
              Regenerate
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {scenarios.map((scenario, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-xl p-5 hover:bg-gray-800/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">{scenario.name}</h4>
                  <Badge className={
                    scenario.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                    scenario.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }>
                    {scenario.risk} Risk
                  </Badge>
                </div>
                
                <div className="h-2 rounded-full bg-gray-800 mb-4 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${scenario.color} rounded-full`} style={{ width: `${(scenario.revenue / 60) * 100}%` }} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">${scenario.revenue}M</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{scenario.units}</div>
                    <div className="text-xs text-gray-500">Units</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">${scenario.avgPrice}M</div>
                    <div className="text-xs text-gray-500">Avg Price</div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-gray-300">
                  View Full Configuration
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────
   DIGITAL HANDOFF VIEW
   ──────────────────────────────────────────────── */
function DigitalHandoffView() {
  const stages = [
    {
      key: 'sales',
      name: 'Sales & Marketing',
      icon: <Building2 className="w-5 h-5" />,
      status: 'completed',
      color: 'emerald',
      items: [
        { name: 'Interactive Sales Deck', status: 'completed', type: 'model' },
        { name: 'Pricing Strategy', status: 'completed', type: 'document' },
        { name: 'Marketing Materials', status: 'completed', type: 'document' },
      ],
    },
    {
      key: 'design',
      name: 'Design Development',
      icon: <HardHat className="w-5 h-5" />,
      status: 'in-progress',
      color: 'blue',
      items: [
        { name: 'Detailed Floor Plans', status: 'completed', type: 'document' },
        { name: 'MEP Coordination', status: 'in-progress', type: 'model' },
        { name: 'Interior Design Package', status: 'pending', type: 'document' },
      ],
    },
    {
      key: 'construction',
      name: 'Construction',
      icon: <Hammer className="w-5 h-5" />,
      status: 'locked',
      color: 'gray',
      items: [
        { name: 'Construction Documents', status: 'pending', type: 'document' },
        { name: 'Phasing Plan', status: 'pending', type: 'model' },
        { name: 'Shop Drawings', status: 'pending', type: 'document' },
      ],
    },
    {
      key: 'operations',
      name: 'Operations',
      icon: <ClipboardCheck className="w-5 h-5" />,
      status: 'locked',
      color: 'gray',
      items: [
        { name: 'As-Built Digital Twin', status: 'pending', type: 'model' },
        { name: 'O&M Manuals', status: 'pending', type: 'document' },
        { name: 'Warranty Documentation', status: 'pending', type: 'document' },
      ],
    },
  ];
  
  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Digital Handoff</h2>
        <p className="text-gray-400 text-sm">One continuous project thread from sales to operations. No data loss at any handoff.</p>
      </div>
      
      <div className="space-y-4">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-panel rounded-xl p-5 border-l-4 ${
              stage.status === 'completed' ? 'border-l-emerald-500' :
              stage.status === 'in-progress' ? 'border-l-blue-500' :
              'border-l-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stage.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  stage.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-gray-800 text-gray-500'
                }`}>
                  {stage.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{stage.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {stage.status === 'completed' && (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">Completed</span>
                      </>
                    )}
                    {stage.status === 'in-progress' && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-xs text-blue-400">In Progress</span>
                      </>
                    )}
                    {stage.status === 'locked' && (
                      <>
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">Awaiting Previous Stage</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <Badge className={
                stage.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                stage.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                'bg-gray-800 text-gray-500'
              }>
                {stage.items.filter(i => i.status === 'completed').length}/{stage.items.length} Deliverables
              </Badge>
            </div>
            
            <div className="space-y-2">
              {stage.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    {item.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    {item.status === 'in-progress' && <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
                    {item.status === 'pending' && <Clock className="w-4 h-4 text-gray-600" />}
                    <span className={`text-sm ${item.status === 'completed' ? 'text-gray-300 line-through' : 'text-white'}`}>
                      {item.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-gray-700 text-gray-500 text-xs">
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
            
            {i < stages.length - 1 && (
              <div className="flex justify-center mt-4">
                <div className={`w-px h-6 ${
                  stage.status === 'completed' ? 'bg-emerald-500/50' : 'bg-gray-800'
                }`} />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   MAIN PROJECT WORKSPACE
   ──────────────────────────────────────────────── */
export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, activeView, setActiveView, chatOpen, toggleChat, sidebarOpen, toggleSidebar } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedLot, setSelectedLot] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [showBrochure, setShowBrochure] = useState(false);
  const [showPanorama, setShowPanorama] = useState(false);
  const [showSiteMap] = useState(false);
  const [resViewMode, setResViewMode] = useState<'day' | 'sunset' | 'night'>('day');

  const project = projects.find((p) => p.id === id) || projects[0];
  const selectedUnitData = project?.units.find((u) => u.id === selectedUnit);

  // Module registry icon map
  const iconMap: Record<string, any> = {
    Box: Box, Layers: Layers, Grid3X3: Grid3X3, MapPinned: MapPinned, Compass: Compass,
    Eye: Eye, Sun: Sun, Building2: Building2, HardHat: HardHat, Zap: Zap,
    FileText: FileText, Wand2: Wand2, GitCompare: GitCompare, CreditCard: CreditCard,
    FileCheck: FileCheck, Calculator: Calculator, Shield: Shield, Bot: Bot,
    Megaphone: Megaphone, Target: Target, Sparkles: Sparkles, BarChart3: BarChart3,
    Flame: Flame, Activity: Activity, MapPin: MapPin, Leaf: Leaf, Radio: Radio,
    Factory: Factory, Cpu: Cpu, RefreshCw: RefreshCw, Home: Home, Sofa: Sofa,
    AlertTriangle: AlertTriangle, Trophy: Trophy, TrendingUp: TrendingUp, Settings: Settings, UserCheck: UserCheck, Clock: Clock,
    Presentation: Presentation, Layout: Layout, GitPullRequest: GitPullRequest,
    GitBranch: GitBranch, Moon: Moon, Star: Star,
  };

  // Dynamic nav items from module registry based on project type
  const getNavItems = (): { key: ViewMode; label: string; icon: any; category: string }[] => {
    if (!project?.type) return [];
    const defaultModuleIds = getDefaultModules(project.type as ProjectType);
    return defaultModuleIds
      .map(id => ALL_MODULES.find(m => m.id === id))
      .filter(Boolean)
      .map(m => ({
        key: m!.id as ViewMode,
        label: m!.label,
        icon: iconMap[m!.icon] || Box,
        category: m!.category,
      }));
  };

  const navItems = getNavItems();

  return (
    <div className="h-screen bg-[#06080f] text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-gray-800 glass-panel flex items-center px-4 flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>

          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors hidden sm:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Box className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-white">{project?.name}</h1>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
              {project?.stage}
            </Badge>
            {project?.type && (
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs capitalize">
                {project.type.replace('-', ' ')}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center overflow-hidden mx-2">
          <div className="flex items-center bg-gray-800/50 rounded-lg p-1 overflow-x-auto scrollbar-hide max-w-full">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all flex-shrink-0 ${
                  activeView === item.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden sm:block"><ThemeToggle /></div>
          <div className="hidden md:block"><NotificationCenter /></div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-gray-400 hover:text-white p-1.5 sm:px-2.5"
            onClick={toggleChat}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-gray-400 hover:text-white hidden sm:flex p-1.5 sm:px-2.5"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-1">
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-400 p-1.5" onClick={() => setShowWidget(!showWidget)} title="Widget"><Code className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400 p-1.5" onClick={() => setShowUpload(!showUpload)} title="Upload"><Upload className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-purple-400 p-1.5" onClick={() => setShowPanorama(!showPanorama)} title="360°"><Grid3X3 className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-amber-400 p-1.5" onClick={() => setShowBrochure(!showBrochure)} title="Brochure"><FileText className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-amber-400 p-1.5" onClick={() => setShowProposal(!showProposal)} title="Proposal"><FileOutput className="w-4 h-4" /></Button>
          </div>

          {/* Mobile: just upload */}
          <div className="flex lg:hidden">
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-green-400 p-1.5" onClick={() => setShowUpload(!showUpload)} title="Upload"><Upload className="w-4 h-4" /></Button>
          </div>
          <div className="hidden lg:block w-px h-5 bg-gray-700 mx-1" />
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-gray-400 hover:text-amber-400 hidden lg:flex p-1.5"
            onClick={() => setShowProposal(!showProposal)}
            title="Generate Proposal"
          >
            <FileOutput className="w-4 h-4" />
          </Button>
          <div className="flex -space-x-2 ml-2">
            {project?.stakeholders.slice(0, 3).map((s, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white border-2 border-gray-900">
                {s.name.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
            {project?.stakeholders && project.stakeholders.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 border-2 border-gray-900">
                +{project.stakeholders.length - 3}
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Left Sidebar - File/Project Info */}
        <AnimatePresence>
          {(sidebarOpen || mobileMenuOpen) && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`border-r border-gray-800 glass-panel overflow-y-auto scrollbar-thin flex-shrink-0 z-50 ${
                mobileMenuOpen ? 'fixed left-0 top-14 bottom-0 w-[280px] lg:relative lg:top-0' : 'hidden lg:block'
              } ${sidebarOpen && !mobileMenuOpen ? 'w-[260px]' : ''}`}
            >
              <div className="p-4">
                {/* Project Stats - Dynamic by type */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {project?.type === 'residential' ? (
                    <>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">{project?.rooms.length}</div>
                        <div className="text-xs text-gray-500">Rooms</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-emerald-400">
                          {project?.rooms.filter(r => r.type === 'bedroom').length}
                        </div>
                        <div className="text-xs text-gray-500">Bedrooms</div>
                      </div>
                    </>
                  ) : project?.type === 'land-development' ? (
                    <>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">{project?.lots.length}</div>
                        <div className="text-xs text-gray-500">Total Lots</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-emerald-400">
                          {project?.lots.filter(l => l.status === 'available').length}
                        </div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-white">{project?.units.length}</div>
                        <div className="text-xs text-gray-500">Total Units</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-emerald-400">
                          {project?.units.filter(u => u.status === 'available').length}
                        </div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Files */}
                <div className="mb-4">
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Project Files</h3>
                  <div className="space-y-1">
                    {project?.files.map((file) => (
                      <div key={file.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <FileCheck className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-300 truncate flex-1">{file.name}</span>
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-gray-500 hover:text-gray-300 text-xs"
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Upload More Files
                  </Button>
                </div>

                {/* Quick Integrations */}
                <div>
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Connect</h3>
                  <div className="space-y-1">
                    <button onClick={() => navigate('/integrations/crm')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-left">
                      <Database className="w-3.5 h-3.5 text-blue-400" /> CRM Sync
                    </button>
                    <button onClick={() => navigate('/integrations/whatsapp')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-left">
                      <MessageCircle className="w-3.5 h-3.5 text-green-400" /> WhatsApp
                    </button>
                    <button onClick={() => navigate('/integrations/portals')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-left">
                      <Globe className="w-3.5 h-3.5 text-indigo-400" /> Portals
                    </button>
                    <button onClick={() => navigate('/ai-content')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-left">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Content
                    </button>
                    <button onClick={() => navigate('/developers')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-800 hover:text-white transition-all text-left">
                      <Code className="w-3.5 h-3.5 text-amber-400" /> API & Embed
                    </button>
                  </div>
                </div>

                {/* AI Insights */}
                <div>
                  <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-2">AI Insights</h3>
                  <div className="space-y-2">
                    {project?.aiInsights.slice(0, 3).map((insight) => (
                      <div 
                        key={insight.id} 
                        className={`p-3 rounded-lg border text-xs ${
                          insight.type === 'risk' ? 'bg-red-500/5 border-red-500/20 text-red-300' :
                          insight.type === 'opportunity' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' :
                          'bg-blue-500/5 border-blue-500/20 text-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {insight.type === 'risk' && <AlertTriangle className="w-3 h-3" />}
                          {insight.type === 'opportunity' && <TrendingUp className="w-3 h-3" />}
                          {insight.type === 'recommendation' && <Lightbulb className="w-3 h-3" />}
                          <span className="font-medium">{insight.title}</span>
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Toggle Sidebar Button - Desktop only */}
        <button
          onClick={toggleSidebar}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-gray-800 border border-gray-700 rounded-r-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors hidden lg:flex"
          style={{ marginLeft: sidebarOpen ? 260 : 0 }}
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
        
        {/* Main Viewport */}
        <main className="flex-1 relative overflow-hidden">
          <Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Loading tool...</p>
              </div>
            </div>
          }>
          {activeView === '3d' && (
            <ErrorBoundary>
              {project?.type === 'residential' ? (
                <div className="h-full relative">
                  {/* Day/Night toggle for residential */}
                  <div className="absolute top-4 left-4 z-10 flex gap-1 bg-black/60 backdrop-blur-sm rounded-lg p-1 border border-gray-700">
                    {([
                      { key: 'day' as const, label: 'Day', icon: <Eye className="w-3 h-3" /> },
                      { key: 'sunset' as const, label: 'Sunset', icon: <Mountain className="w-3 h-3" /> },
                      { key: 'night' as const, label: 'Night', icon: <Grid3X3 className="w-3 h-3" /> },
                    ]).map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setResViewMode(t.key)}
                        className={`px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition-all ${
                          resViewMode === t.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {t.icon}
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <Canvas shadows camera={{ position: [20, 15, 20], fov: 45 }}>
                    <ResidentialHome3D
                      viewMode="realistic"
                      timeOfDay={resViewMode}
                      onRoomSelect={setSelectedRoom}
                      selectedRoom={selectedRoom}
                    />
                    <OrbitControls enablePan enableZoom enableRotate />
                    <PerspectiveCamera makeDefault position={[20, 15, 20]} />
                  </Canvas>
                </div>
              ) : (
                <Enhanced3DViewer
                  projectType={project?.type || 'real-estate'}
                  units={project?.units || []}
                  selectedUnit={selectedUnit}
                  onSelectUnit={setSelectedUnit}
                />
              )}
            </ErrorBoundary>
          )}

          {activeView === 'stack' && (
            <ErrorBoundary>
              <div className="h-full p-4">
                <StackPlanView
                  units={project?.units || []}
                  selectedUnit={selectedUnit}
                  onSelectUnit={setSelectedUnit}
                />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'floorplan' && (
            <ErrorBoundary>
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Home className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Floor Plan View</h3>
                  <p className="text-gray-500 text-sm max-w-md">
                    Interactive floor plan with unit details. Upload CAD files to generate detailed 2D floor plans with measurements and annotations.
                  </p>
                </div>
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'rooms' && project?.type === 'residential' && (
            <ErrorBoundary>
              <div className="h-full p-4 overflow-y-auto scrollbar-thin">
                <h3 className="text-white font-semibold text-lg mb-4">Room Overview</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {project.rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedRoom === room.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400">{sectionIcons[room.type] || <Sofa className="w-4 h-4" />}</span>
                        <span className="text-xs text-gray-500">{room.floor === 0 ? 'GF' : `F${room.floor}`}</span>
                      </div>
                      <h4 className="text-white font-medium text-sm mb-1">{room.name}</h4>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{room.area} m²</span>
                        <span>{room.width}m x {room.depth}m</span>
                      </div>
                      {room.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {room.features.slice(0, 2).map((f) => (
                            <span key={f} className="px-1.5 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-400">{f}</span>
                          ))}
                          {room.features.length > 2 && (
                            <span className="px-1.5 py-0.5 text-[10px] text-gray-500">+{room.features.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'lots' && project?.type === 'land-development' && (
            <ErrorBoundary>
              <AerialLotMap
                lots={project.lots}
                onSelectLot={setSelectedLot}
                selectedLot={selectedLot}
                showBeforeAfter={true}
              />
            </ErrorBoundary>
          )}

          {activeView === 'panorama' && (
            <ErrorBoundary>
              <PanoramaViewer
                spots={project?.panoramas || []}
                onClose={() => setActiveView('3d')}
              />
            </ErrorBoundary>
          )}

          {activeView === 'brochure' && (
            <ErrorBoundary>
              <BrochureExport
                projectName={project?.name || 'Project'}
                projectType={project?.type || 'real-estate'}
                onClose={() => setActiveView('3d')}
              />
            </ErrorBoundary>
          )}

          {activeView === 'lot-ingestion' && (
            <ErrorBoundary>
              <div className="h-full">
                <LotIngestionEngine />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'lot-array' && (
            <ErrorBoundary>
              <div className="h-full">
                <LotArrayView lots={project?.lots} />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'sitemap' && (
            <ErrorBoundary>
              <SiteMapPanel geoSite={project?.geoSite || null} />
            </ErrorBoundary>
          )}

          {activeView === 'true-view' && (
            <ErrorBoundary>
              <div className="h-full">
                <TrueViewEngine />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'comparison-cart' && (
            <ErrorBoundary>
              <div className="h-full">
                <ComparisonCart />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'agent-copilot' && (
            <ErrorBoundary>
              <div className="h-full">
                <AgentCopilot />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'prompt-render' && (
            <ErrorBoundary>
              <div className="h-full">
                <PromptToRender />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'sunlight' && (
            <ErrorBoundary>
              <div className="h-full">
                <SunlightShadowEngine />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'template-market' && (
            <ErrorBoundary>
              <div className="h-full">
                <TemplateMarketplace />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'neighbourhood' && (
            <ErrorBoundary>
              <div className="h-full">
                <NeighbourhoodIntelligence />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'sustainability' && (
            <ErrorBoundary>
              <div className="h-full">
                <SustainabilityVisualiser />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'reports' && (
            <ErrorBoundary>
              <div className="h-full">
                <ReportGenerator />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'financial' && (
            <ErrorBoundary>
              <div className="h-full">
                <FinancialProjections />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'pitch-deck' && (
            <ErrorBoundary>
              <div className="h-full">
                <PitchDeckBuilder />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'marketing' && (
            <ErrorBoundary>
              <div className="h-full">
                <MarketingCommandCenter />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'algorithms' && (
            <ErrorBoundary>
              <div className="h-full">
                <AlgorithmPanel />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'live-data' && (
            <ErrorBoundary>
              <div className="h-full">
                <LiveDataIntelligence />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'environmental' && (
            <ErrorBoundary>
              <div className="h-full">
                <EnvironmentalImpact />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'infrastructure' && (
            <ErrorBoundary>
              <div className="h-full">
                <InfrastructureLayer />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'city-twin' && (
            <ErrorBoundary>
              <div className="h-full">
                <CityDigitalTwin />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'construction-phase' && (
            <ErrorBoundary>
              <div className="h-full">
                <ConstructionPhasing />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'annotations' && (
            <ErrorBoundary>
              <div className="h-full">
                <HotspotAnnotations />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'solar' && (
            <ErrorBoundary>
              <div className="h-full">
                <SolarOptimizer />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'pulse' && (
            <ErrorBoundary>
              <div className="h-full">
                <PulseDashboard />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'revenue-risk' && (
            <ErrorBoundary>
              <div className="h-full">
                <RevenueAtRisk />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'concierge' && (
            <ErrorBoundary>
              <div className="h-full">
                <AxisConcierge />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'hold' && (
            <ErrorBoundary>
              <div className="h-full">
                <HOLDSuite />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'org' && (
            <ErrorBoundary>
              <div className="h-full">
                <OrgManager />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'approval' && (
            <ErrorBoundary>
              <div className="h-full">
                <ApprovalWorkflow />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'versioning' && (
            <ErrorBoundary>
              <div className="h-full">
                <ModelVersioning />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'flywheel' && (
            <ErrorBoundary>
              <div className="h-full">
                <DataFlywheel />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'buyer-portal' && (
            <ErrorBoundary>
              <div className="h-full">
                <BuyerPortal />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'settlement-radar' && (
            <ErrorBoundary>
              <div className="h-full">
                <SettlementRadar />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'settings-hub' && (
            <ErrorBoundary>
              <div className="h-full">
                <SettingsHub />
              </div>
            </ErrorBoundary>
          )}

          {activeView === 'pricing' && (
            <ErrorBoundary><WhatIfSimulator /></ErrorBoundary>
          )}
          {activeView === 'scenario' && (
            <ErrorBoundary><AIOptioneer /></ErrorBoundary>
          )}
          {activeView === 'handoff' && (
            <ErrorBoundary><DigitalHandoffView /></ErrorBoundary>
          )}
          </Suspense>
        </main>
        
        {/* Room Detail Panel (for residential) */}
        <AnimatePresence>
          {selectedRoom && project?.type === 'residential' && activeView === 'rooms' && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 glass-panel border-l border-gray-700 h-full overflow-y-auto scrollbar-thin flex-shrink-0"
            >
              {(() => {
                const room = project?.rooms.find((r) => r.id === selectedRoom);
                if (!room) return null;
                return (
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                      <div>
                        <h3 className="text-white font-semibold">{room.name}</h3>
                        <p className="text-gray-500 text-xs capitalize">{room.type} • {room.floor === 0 ? 'Ground Floor' : `Floor ${room.floor}`}</p>
                      </div>
                      <button onClick={() => setSelectedRoom(null)} className="text-gray-500 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <div className="text-white font-semibold text-sm">{room.area}</div>
                        <div className="text-gray-500 text-[10px]">m² Area</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <div className="text-white font-semibold text-sm">{room.width}x{room.depth}m</div>
                        <div className="text-gray-500 text-[10px]">Dimensions</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <div className="text-white font-semibold text-sm">{room.height}m</div>
                        <div className="text-gray-500 text-[10px]">Height</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">Features</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {room.features.map((f) => (
                          <span key={f} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">Materials</h4>
                      <div className="space-y-1.5">
                        {Object.entries(room.materials).map(([key, val]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-500 capitalize">{key}</span>
                            <span className="text-gray-300">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-500">
                      <Eye className="w-4 h-4 mr-2" />
                      View 360° Panorama
                    </Button>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel - Unit Detail or Chat */}
        <AnimatePresence>
          {selectedUnitData && activeView !== 'pricing' && activeView !== 'scenario' && activeView !== 'handoff' && activeView !== 'rooms' && activeView !== 'lots' && activeView !== 'panorama' && activeView !== 'brochure' && activeView !== 'sitemap' && activeView !== 'true-view' && activeView !== 'comparison-cart' && activeView !== 'agent-copilot' && activeView !== 'prompt-render' && activeView !== 'sunlight' && activeView !== 'template-market' && activeView !== 'neighbourhood' && activeView !== 'sustainability' && activeView !== 'reports' && activeView !== 'financial' && activeView !== 'pitch-deck' && activeView !== 'marketing' && activeView !== 'algorithms' && activeView !== 'live-data' && activeView !== 'environmental' && activeView !== 'infrastructure' && activeView !== 'city-twin' && activeView !== 'construction-phase' && activeView !== 'annotations' && activeView !== 'solar' && activeView !== 'pulse' && activeView !== 'revenue-risk' && activeView !== 'concierge' && activeView !== 'hold' && activeView !== 'org' && activeView !== 'approval' && activeView !== 'versioning' && activeView !== 'flywheel' && (
            <UnitDetailPanel
              unit={selectedUnitData}
              onClose={() => setSelectedUnit(null)}
            />
          )}
        </AnimatePresence>

        {/* Brochure Panel */}
        <AnimatePresence>
          {showBrochure && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-96 glass-panel border-l border-gray-700 h-full overflow-y-auto scrollbar-thin flex-shrink-0"
            >
              <BrochureExport
                projectName={project?.name || 'Project'}
                projectType={project?.type || 'real-estate'}
                onClose={() => setShowBrochure(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Site Map Panel */}
        <AnimatePresence>
          {showSiteMap && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-96 glass-panel border-l border-gray-700 h-full overflow-y-auto scrollbar-thin flex-shrink-0"
            >
              <SiteMapPanel geoSite={project?.geoSite || null} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* AI Chat Panel */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex-shrink-0"
            >
              <AIChatPanel />
            </motion.div>
          )}

          {/* Widget Builder Panel */}
          {showWidget && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 480, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex-shrink-0"
            >
              <WidgetBuilder onClose={() => setShowWidget(false)} />
            </motion.div>
          )}

          {/* Upload Pipeline Panel */}
          {showUpload && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 480, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex-shrink-0"
            >
              <UploadPipeline onComplete={() => { setShowUpload(false); setActiveView('3d'); }} />
            </motion.div>
          )}

          {/* Proposal Generator Panel */}
          {showProposal && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 560, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="flex-shrink-0"
            >
              <ProposalGenerator onClose={() => setShowProposal(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
