import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Layers, Zap, Eye, MessageSquare, GitCompare,
  ArrowRight, Check, Building2, Factory, Ship, HardHat,
  TrendingUp, Globe, Cpu, ChevronDown, Play,
  Sparkles, BarChart3, Users, Clock, FileCheck, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: {},
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function ParticleField() {
  const [particles] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
  );
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <circle cx="16" cy="16" r="15" stroke="url(#logoGrad)" strokeWidth="2" fill="none"/>
            <path d="M16 7L23 23H20.5L18.5 18.5H13.5L11.5 23H9L16 7ZM14.2 16.5H17.8L16 12.2L14.2 16.5Z" fill="url(#logoGrad)"/>
            <defs>
              <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA"/>
                <stop offset="1" stopColor="#22D3EE"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-semibold text-white tracking-tight">one axis</span>
            <span className="text-[9px] text-gray-500 tracking-[0.2em] uppercase">A Stedaxis Studio</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#industries" className="text-sm text-gray-300 hover:text-white transition-colors">Industries</a>
          <a href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</a>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={() => navigate('/dashboard')}>
            Sign In
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => navigate('/dashboard')}>
            Start Free
          </Button>
        </div>
        
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>
      </div>
      
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass-panel border-t border-gray-800"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            <a href="#industries" className="text-gray-300 hover:text-white">Industries</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white">How It Works</a>
            <a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a>
            <Button className="bg-blue-600 hover:bg-blue-500 w-full" onClick={() => navigate('/dashboard')}>
              Start Free
            </Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

function Hero() {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <ParticleField />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 px-4 py-1.5 text-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            The Project Experience Operating System
          </Badge>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-gray-400 text-lg md:text-xl tracking-[0.15em] uppercase mb-4 font-light"
        >
          From drawings to decisions
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-6"
        >
          Turn Project Chaos
          <br />
          Into <span className="gradient-text">Shared Reality</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10"
        >
          Upload your plans. OneAxis transforms them into living, interactive project realities 
          that sell faster, decide smarter, and align every stakeholder — in minutes, not weeks.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg rounded-xl oneaxis-glow"
            onClick={() => navigate('/dashboard')}
          >
            Launch Your First Project
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-6 text-lg rounded-xl"
          >
            <Play className="mr-2 w-5 h-5" />
            Watch Demo
          </Button>
        </motion.div>
        
        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl oneaxis-glow">
            <div className="bg-[#0a0e1a] p-4">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1 mx-4 px-4 py-1.5 rounded-lg bg-gray-800/50 text-xs text-gray-500 text-center">
                  app.oneaxis.live/project/azure-heights-tower
                </div>
              </div>
              
              {/* Mock interface */}
              <div className="grid grid-cols-12 gap-4 h-[400px]">
                {/* Sidebar */}
                <div className="col-span-3 bg-gray-900/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                    <Box className="w-4 h-4" /> OneAxis
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-gray-300 text-xs p-2 rounded-lg bg-blue-500/10">
                      <Eye className="w-3.5 h-3.5" /> 3D View
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs p-2">
                      <Layers className="w-3.5 h-3.5" /> Stack Plan
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs p-2">
                      <BarChart3 className="w-3.5 h-3.5" /> Pricing
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs p-2">
                      <MessageSquare className="w-3.5 h-3.5" /> AI Assistant
                    </div>
                  </div>
                </div>
                
                {/* Main viewport */}
                <div className="col-span-6 bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl relative overflow-hidden">
                  {/* 3D building mock */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Building floors */}
                      {Array.from({ length: 8 }, (_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                          className={`w-48 h-8 mb-1 rounded-sm ${
                            i < 3 ? 'bg-blue-500/30 border border-blue-400/40' :
                            i < 6 ? 'bg-emerald-500/30 border border-emerald-400/40' :
                            'bg-gray-700/30 border border-gray-600/40'
                          }`}
                          style={{ marginLeft: i * 4 }}
                        />
                      ))}
                      <div className="absolute -right-20 top-0 text-xs text-gray-500 space-y-6 mt-2">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Available</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" /> Reserved</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating labels */}
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur px-3 py-2 rounded-lg border border-gray-700 text-xs"
                  >
                    <div className="text-gray-400">Total Value</div>
                    <div className="text-white font-bold text-lg">$42.8M</div>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur px-3 py-2 rounded-lg border border-gray-700 text-xs"
                  >
                    <div className="text-gray-400">Units Sold</div>
                    <div className="text-emerald-400 font-bold text-lg">31/48</div>
                  </motion.div>
                </div>
                
                {/* Right panel */}
                <div className="col-span-3 space-y-3">
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-2">AI INSIGHTS</div>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                        <Zap className="w-3 h-3 inline mr-1" />
                        Price 8% below market avg
                      </div>
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        Kitchen upgrades = +68% sales
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-2">STAKEHOLDERS</div>
                    <div className="flex -space-x-2">
                      {['AR', 'SC', 'MJ', 'KL'].map((initials, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white border-2 border-gray-900">
                          {initials}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Universal Ingestion',
      description: 'Upload PDFs, CAD, BIM, Excel, or even text descriptions. Our AI processes everything into one intelligent project model in minutes.',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Living 3D Reality',
      description: 'Navigate projects in 3D, VR, or AR. Every stakeholder sees the same live model, updated in real-time as decisions are made.',
    },
    {
      icon: <GitCompare className="w-6 h-6" />,
      title: 'Instant "What-If"',
      description: 'Change a wall, swap a material, adjust the layout — see the cost and schedule impact instantly. No more waiting for estimates.',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Conversational AI',
      description: 'Ask your project anything in plain English. "Show me the cheapest 3-bed units with park views." OneAxis answers with data.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Optioneer',
      description: 'Set your constraints and let AI generate optimal configurations. 10 viable alternatives, fully priced, in under an hour.',
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Digital Handoff',
      description: 'Sales to design to construction to operations — one continuous thread. No rebuilding. No data loss. One living model.',
    },
  ];
  
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">SIX PILLARS</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything Projects Need to <span className="gradient-text">Move Fast</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Six capabilities. One platform. From raw files to stakeholder alignment in minutes.
          </p>
        </motion.div>
        
        <motion.div 
          {...staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              {...staggerItem}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-panel rounded-2xl p-6 hover:bg-gray-800/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Industries() {
  const industries = [
    { icon: <Building2 className="w-6 h-6" />, name: 'Real Estate', useCase: 'Sell off-plan units with interactive configurators. Investors explore before committing.' },
    { icon: <HardHat className="w-6 h-6" />, name: 'Construction', useCase: 'Win bids with interactive 3D proposals. Visualize phasing and manage changes.' },
    { icon: <Factory className="w-6 h-6" />, name: 'Manufacturing', useCase: 'Configure products visually with live pricing. Direct-to-production output.' },
    { icon: <Cpu className="w-6 h-6" />, name: 'Industrial Ops', useCase: 'Digital twins for facilities. Maintenance planning and safety training in 3D.' },
    { icon: <Ship className="w-6 h-6" />, name: 'Oil & Gas', useCase: 'Unified subsurface + surface visualization. Asset integrity and stakeholder communication.' },
    { icon: <Globe className="w-6 h-6" />, name: 'Infrastructure', useCase: 'Engage citizens and regulators with interactive project visualizations.' },
  ];
  
  return (
    <section id="industries" className="py-24 bg-gradient-to-b from-transparent to-gray-950/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">INDUSTRIES</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            One Platform. <span className="gradient-text">Every Industry</span> That Builds.
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From apartments to oil rigs, OneAxis adapts to the language and workflow of your industry.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-6 border-t-2 border-t-blue-500/30 hover:border-t-blue-400 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  {industry.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{industry.name}</h3>
              </div>
              <p className="text-gray-400 text-sm">{industry.useCase}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Upload', desc: 'Drag plans, pricing sheets, and documents. Any format. Any industry.', icon: <Box className="w-5 h-5" /> },
    { num: '02', title: 'Process', desc: 'AI ingests, structures, and builds an interactive 3D project model.', icon: <Cpu className="w-5 h-5" /> },
    { num: '03', title: 'Experience', desc: 'Navigate, configure, and collaborate in a live project reality.', icon: <Eye className="w-5 h-5" /> },
    { num: '04', title: 'Decide', desc: 'Stakeholders align, approve, and move forward — in one session.', icon: <Check className="w-5 h-5" /> },
  ];
  
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">THE WORKFLOW</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            From Files to <span className="gradient-text">Reality</span> in Minutes
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            No manual modeling. No weeks of setup. Upload. Process. Experience. Decide.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 -translate-y-1/2" />
          
          {steps.map((step, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative glass-panel rounded-2xl p-6 text-center"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold z-10">
                {step.num}
              </div>
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 mt-2">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { label: 'Projects Processed', value: '2,400+', icon: <Box className="w-5 h-5" /> },
    { label: 'Time Saved Avg', value: '85%', icon: <Clock className="w-5 h-5" /> },
    { label: 'Stakeholder Alignment', value: '10x', icon: <Users className="w-5 h-5" /> },
    { label: 'Industries Served', value: '6', icon: <Globe className="w-5 h-5" /> },
  ];
  
  return (
    <section className="py-16 bg-gradient-to-r from-blue-950/30 to-cyan-950/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
                {stat.icon}
                <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const navigate = useNavigate();
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/unit + $500 setup',
      description: 'For small developments and first-time users. Pay per unit, not per project.',
      features: ['Interactive 3D Viewer (all modes)', 'Stack Plan & Unit Selector', 'AI Chat (50 queries/mo)', 'What-If Simulator', 'Basic Brochure Export', '1 Embed Widget', '3 Team Members', '30-day archive'],
      cta: 'Calculate Your Cost',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$2,499',
      period: '/month',
      description: 'For active developers running multiple concurrent projects.',
      features: ['Unlimited Units & Projects', 'Full AI Optioneer', 'Digital Handoff Workflow', 'Branded Brochure Export', 'Unlimited Widgets', 'Proposal Generator', 'CRM Integration (SF/HubSpot/Pipedrive)', 'WhatsApp (5 templates)', 'Portal Sync (2 portals)', 'API Access', 'Priority Support'],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Studio',
      price: '$4,999',
      period: '/month',
      description: 'For agencies and brokerages managing projects for multiple clients.',
      features: ['Everything in Professional', 'White-Label Branding', 'Client Management Portal', 'AI Content Generator (EN + AR)', 'All 6 Property Portals', 'Unlimited WhatsApp Templates', 'Developer Portal & Webhooks', 'Unlimited Team Members', 'Dedicated Account Manager'],
      cta: 'Contact Sales',
      popular: false,
    },
  ];
  
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">PRICING</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invest in <span className="gradient-text">Clarity</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Replace $25,000-$50,000 in traditional rendering costs. Starting at $49 per unit.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-panel rounded-2xl p-6 relative ${
                plan.popular ? 'border-blue-500/50 oneaxis-glow' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white border-0">
                  MOST POPULAR
                </Badge>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                </div>
                {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
                onClick={() => navigate('/pricing')}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
        
        {/* Enterprise CTA */}
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto mt-10 glass-panel rounded-2xl p-8 text-center border border-gray-700"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
          <p className="text-gray-400 mb-4">For large developers with 15+ projects, custom integrations, and on-premise requirements. Annual contracts with SLA guarantees.</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-6">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> On-Premise Deployment</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> SSO / SAML</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Integrations</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 99.9% SLA</span>
          </div>
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8"
            onClick={() => navigate('/pricing')}
          >
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-cyan-950/50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to See Your Projects
            <br />
            <span className="gradient-text">Come Alive?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join the companies replacing static documents with living project realities. 
            Upload your first project today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg rounded-xl oneaxis-glow"
              onClick={() => navigate('/dashboard')}
            >
              <Zap className="mr-2 w-5 h-5" />
              Launch Your First Project
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-6 text-lg rounded-xl"
            >
              <MessageSquare className="mr-2 w-5 h-5" />
              Talk to Our Team
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <circle cx="16" cy="16" r="15" stroke="url(#logoGrad2)" strokeWidth="2" fill="none"/>
                <path d="M16 7L23 23H20.5L18.5 18.5H13.5L11.5 23H9L16 7ZM14.2 16.5H17.8L16 12.2L14.2 16.5Z" fill="url(#logoGrad2)"/>
                <defs>
                  <linearGradient id="logoGrad2" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60A5FA"/>
                    <stop offset="1" stopColor="#22D3EE"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col leading-none">
                <span className="text-base font-semibold text-white tracking-tight">one axis</span>
                <span className="text-[8px] text-gray-600 tracking-[0.2em] uppercase">A Stedaxis Studio</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">
              The Project Experience Operating System. Turn project chaos into shared reality.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#features" className="hover:text-gray-300">Features</a></li>
              <li><a href="#pricing" className="hover:text-gray-300">Pricing</a></li>
              <li><a href="#" className="hover:text-gray-300">API</a></li>
              <li><a href="#" className="hover:text-gray-300">Security</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Industries</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-300">Real Estate</a></li>
              <li><a href="#" className="hover:text-gray-300">Construction</a></li>
              <li><a href="#" className="hover:text-gray-300">Manufacturing</a></li>
              <li><a href="#" className="hover:text-gray-300">Oil & Gas</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-gray-300">About</a></li>
              <li><a href="#" className="hover:text-gray-300">Careers</a></li>
              <li><a href="#" className="hover:text-gray-300">Contact</a></li>
              <li><a href="#" className="hover:text-gray-300">Blog</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">A Stedaxis Product. Sydney | Nagercoil</p>
          <p className="text-gray-700 text-xs mt-1"> 2026 Stedaxis Pty Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400">Privacy</a>
            <a href="#" className="hover:text-gray-400">Terms</a>
            <a href="#" className="hover:text-gray-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LiveDemo() {
  const [activeCategory, setActiveCategory] = useState<'commercial' | 'residential' | 'industrial'>('residential');
  const [activeSelector, setActiveSelector] = useState<'apartment' | 'lot' | 'twin'>('apartment');
  const navigate = useNavigate();

  const categories = [
    { key: 'commercial' as const, label: 'Commercial', icon: <Building2 className="w-4 h-4" /> },
    { key: 'residential' as const, label: 'Residential', icon: <HardHat className="w-4 h-4" /> },
    { key: 'industrial' as const, label: 'Industrial', icon: <Factory className="w-4 h-4" /> },
  ];

  const selectors = [
    { key: 'apartment' as const, label: 'Apartment Selector', desc: 'Interactive unit exploration with floor-by-floor navigation, pricing overlay, and real-time availability.' },
    { key: 'lot' as const, label: 'Lot Selector', desc: 'Land development navigator with lot comparison, terrain visualization, and reservation workflow.' },
    { key: 'twin' as const, label: 'Digital Twin', desc: 'Full project digital twin with construction phasing, before/after views, and stakeholder collaboration.' },
  ];

  const mockFrame = (
    <div className="relative rounded-xl overflow-hidden bg-[#080c18] border border-gray-800 h-[420px]">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 bg-[#0a0f1a]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 mx-4">
          <div className="max-w-xs mx-auto px-3 py-1 rounded-md bg-gray-800/40 text-[10px] text-gray-600 text-center font-mono">
            app.oneaxis.live/project/demo-{activeCategory}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Eye className="w-3.5 h-3.5" />
          <span className="text-[10px]">LIVE</span>
        </div>
      </div>

      {/* Content area */}
      <div className="grid grid-cols-12 h-[calc(100%-41px)]">
        {/* Left sidebar */}
        <div className="col-span-3 border-r border-gray-800 p-3 space-y-1">
          <div className="text-[9px] text-gray-600 uppercase tracking-wider mb-3 px-2">Services</div>
          {['3D Rendering', 'Virtual Tour', 'Floor Plans', 'Web XR'].map((s, i) => (
            <div key={s} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] ${i === 0 ? 'text-blue-400 bg-blue-500/10' : 'text-gray-500 hover:text-gray-300'}`}>
              <Layers className="w-3 h-3" />
              {s}
            </div>
          ))}
          <div className="text-[9px] text-gray-600 uppercase tracking-wider mt-4 mb-2 px-2">Project List</div>
          {['Azure Tower', 'Marina Villas', 'Highland Lots'].map((p, i) => (
            <div key={p} className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] ${i === 0 ? 'text-white bg-gray-700/30' : 'text-gray-500'}`}>
              <Box className="w-3 h-3" />
              {p}
            </div>
          ))}
        </div>

        {/* Main viewport */}
        <div className="col-span-9 relative bg-gradient-to-b from-[#0a0f1a] to-[#06080f]">
          {activeSelector === 'apartment' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {Array.from({ length: 10 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`w-56 h-7 mb-0.5 rounded-sm flex items-center px-2 text-[9px] font-mono ${
                      i < 4 ? 'bg-blue-500/20 border border-blue-400/30 text-blue-300' :
                      i < 7 ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300' :
                      'bg-gray-700/20 border border-gray-600/30 text-gray-500'
                    }`}
                    style={{ marginLeft: Math.abs(5 - i) * 6 }}
                  >
                    <span className="opacity-60">L{i + 1}</span>
                    <span className="ml-auto">{i < 4 ? 'RESERVED' : i < 7 ? 'AVAILABLE' : 'SOLD'}</span>
                  </motion.div>
                ))}
                <div className="absolute -right-28 top-0 text-[10px] space-y-3 mt-1">
                  <div className="flex items-center gap-1.5 text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Available</div>
                  <div className="flex items-center gap-1.5 text-blue-400"><div className="w-2 h-2 rounded-full bg-blue-400" /> Reserved</div>
                  <div className="flex items-center gap-1.5 text-gray-500"><div className="w-2 h-2 rounded-full bg-gray-500" /> Sold</div>
                </div>
              </div>
            </div>
          )}
          {activeSelector === 'lot' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 16 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`w-16 h-12 rounded-md border flex items-center justify-center text-[9px] font-mono ${
                      i < 6 ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400' :
                      i < 11 ? 'bg-amber-500/15 border-amber-400/30 text-amber-400' :
                      'bg-gray-700/15 border-gray-600/30 text-gray-600'
                    }`}
                  >
                    L{i + 1}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {activeSelector === 'twin' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <motion.div
                  animate={{ rotateY: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-48 h-64 relative"
                >
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-6 border border-cyan-400/30 bg-cyan-500/10 rounded-sm"
                      style={{ bottom: i * 28, transform: `scale(${1 - i * 0.04})` }}
                    />
                  ))}
                  <div className="absolute -right-24 top-4 text-[10px] text-cyan-400 space-y-2">
                    <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-md px-2 py-1">Phase 1: Foundation</div>
                    <div className="text-gray-500">Phase 2: Structure</div>
                    <div className="text-gray-600">Phase 3: Fit-out</div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Floating overlays */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50"
          >
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">Total Value</div>
            <div className="text-white font-bold text-sm">$42.8M</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50"
          >
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">Units</div>
            <div className="text-emerald-400 font-bold text-sm">31/48</div>
          </motion.div>

          {/* Click to explore overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              className="bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-600/50"
            >
              <span className="text-xs text-gray-300">Click anywhere to explore</span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">LIVE DEMO</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience OneAxis <span className="gradient-text">Interactively</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore 3D rendering, walkthroughs, selectors, and digital twin experiences in one interface.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          {...fadeInUp}
          className="flex items-center justify-center gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all ${
                activeCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Selector tabs */}
        <motion.div
          {...fadeInUp}
          className="flex items-center justify-center gap-2 mb-10"
        >
          {selectors.map((sel) => (
            <button
              key={sel.key}
              onClick={() => setActiveSelector(sel.key)}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all border ${
                activeSelector === sel.key
                  ? 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                  : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              {sel.label}
            </button>
          ))}
        </motion.div>

        {/* Demo frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {mockFrame}

          {/* Selector description */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-4">
              {selectors.find(s => s.key === activeSelector)?.desc}
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white px-6"
              onClick={() => navigate('/dashboard')}
            >
              Launch Interactive Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Mascot() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40 cursor-pointer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      style={{
        transform: `translateY(${Math.sin(scrollY * 0.01) * 5}px)`,
      }}
    >
      <div className="relative">
        {/* Speech bubble on hover */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
          <div className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg text-xs text-gray-300">
            Need help? I am watching!
          </div>
        </div>

        {/* The eye character */}
        <div className="w-12 h-12 rounded-full bg-white shadow-lg shadow-white/10 flex items-center justify-center relative overflow-hidden">
          {/* Eyes that follow scroll */}
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-3.5 h-3.5 rounded-full bg-gray-900 relative"
              animate={{
                x: Math.sin(scrollY * 0.005) * 2,
                y: Math.cos(scrollY * 0.003) * 1.5,
              }}
            >
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white" />
            </motion.div>
            <motion.div
              className="w-3.5 h-3.5 rounded-full bg-gray-900 relative"
              animate={{
                x: Math.sin(scrollY * 0.005) * 2,
                y: Math.cos(scrollY * 0.003) * 1.5,
              }}
            >
              <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-white" />
            </motion.div>
          </div>
        </div>

        {/* Subtle glow */}
        <div className="absolute inset-0 rounded-full bg-white/20 blur-md -z-10" />
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#06080f] text-white">
      <Nav />
      <Hero />
      <Features />
      <LiveDemo />
      <Industries />
      <HowItWorks />
      <Stats />
      <Pricing />
      <CTA />
      <Footer />
      <Mascot />
    </div>
  );
}
