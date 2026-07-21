import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box, Building2, Factory, HardHat, Fuel, Home, ArrowRight,
  CheckCircle, BarChart3, Shield, Globe,
  Phone, Mail, MapPin, ChevronRight, Star, Play,
  FileText, Layers, Sparkles,
  Download, Eye, TrendingUp, Calendar, Cpu,
  Menu, X, Rocket, HeartHandshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/* ────────────────────────────────────────────────
   SALES LANDING PAGE
   Conversion-focused page for OneAxis.
   Lead capture, social proof, feature deep-dive,
   industry solutions, pricing CTA.
   ──────────────────────────────────────────── */

const industries = [
  { icon: <Building2 className="w-6 h-6" />, name: 'Real Estate', desc: 'Tower & apartment visualization with unit selectors, stack plans, and pricing engines.', color: 'from-blue-500 to-cyan-500' },
  { icon: <Home className="w-6 h-6" />, name: 'Residential', desc: 'Mansion & villa configurators with interior walkthroughs and lot selectors for land developments.', color: 'from-emerald-500 to-teal-500' },
  { icon: <HardHat className="w-6 h-6" />, name: 'Construction', desc: 'Site progress tracking, crane logistics, safety zones, and phased build visualization.', color: 'from-amber-500 to-orange-500' },
  { icon: <Factory className="w-6 h-6" />, name: 'Manufacturing', desc: 'Production line optimization, robotic cell visualization, and quality control dashboards.', color: 'from-purple-500 to-pink-500' },
  { icon: <Cpu className="w-6 h-6" />, name: 'Industrial', desc: 'Facility management with solar arrays, wind turbines, pipeline monitoring, and tank levels.', color: 'from-rose-500 to-red-500' },
  { icon: <Fuel className="w-6 h-6" />, name: 'Oil & Gas', desc: 'Offshore platform visualization, wellhead management, flare monitoring, and supply logistics.', color: 'from-indigo-500 to-blue-600' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'VP Sales', company: 'Azure Developments', quote: 'We closed 40% more pre-sales in the first month. Buyers can now visualize their unit before breaking ground.', avatar: 'SC' },
  { name: 'Marcus Johnson', role: 'Project Director', company: 'BuildCo International', quote: 'The digital handoff cut our approval cycles from 3 weeks to 3 days. Every stakeholder sees the same live model.', avatar: 'MJ' },
  { name: 'Dr. Li Wei', role: 'Plant Manager', company: 'Precision Manufacturing', quote: 'Our OEE improved 12% after visualizing bottlenecks in OneAxis. The AI recommendations were spot on.', avatar: 'LW' },
  { name: 'Ahmed Al-Rashid', role: 'CEO', company: 'Greenfield Industries', quote: 'We evaluated 6 platforms. OneAxis was the only one that handled both our solar farm and processing facility in one view.', avatar: 'AR' },
];

const stats = [
  { value: '500+', label: 'Projects Delivered', icon: <Building2 className="w-5 h-5" /> },
  { value: '$2.1B', label: 'Properties Sold', icon: <TrendingUp className="w-5 h-5" /> },
  { value: '98%', label: 'Client Retention', icon: <HeartHandshake className="w-5 h-5" /> },
  { value: '6', label: 'Industries', icon: <Globe className="w-5 h-5" /> },
];

const features = [
  { icon: <Box className="w-5 h-5" />, title: '3D Digital Twin', desc: 'Interactive models from BIM, CAD, or PDF in under 24 hours. Block, realistic, and photorealistic modes.' },
  { icon: <Eye className="w-5 h-5" />, title: '360° Walkthroughs', desc: 'Matterport-like panoramas for unbuilt properties. Navigate room-to-room with hotspot navigation.' },
  { icon: <Layers className="w-5 h-5" />, title: 'Unit & Lot Selectors', desc: 'Embeddable configurators for your website. Color-coded availability, comparison tools, and instant pricing.' },
  { icon: <Sparkles className="w-5 h-5" />, title: 'AI-Powered Insights', desc: 'GPT-4o analyzes your project data to recommend pricing, flag risks, and optimize unit mix automatically.' },
  { icon: <FileText className="w-5 h-5" />, title: 'Brochure Generator', desc: 'Export branded PDFs with interiors, exteriors, floor plans, and finishes. Generated in one click.' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'What-If Simulator', desc: 'Adjust pricing rules, materials, and premiums to see real-time impact on total project value.' },
  { icon: <Globe className="w-5 h-5" />, title: 'Geographic Analysis', desc: 'Sun path, wind rose, rainfall data, and satellite maps for informed site orientation decisions.' },
  { icon: <Shield className="w-5 h-5" />, title: 'Digital Handoff', desc: 'Structured workflow from sales to operations. Every decision tracked, every stakeholder aligned.' },
];

export default function SalesLandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '', industry: 'real-estate' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [, setActiveIndustry] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Box className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">OneAxis</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#industries" className="text-sm text-gray-400 hover:text-white transition-colors">Industries</a>
              <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">Customers</a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Demo
              </Button>
            </div>

            <button className="md:hidden text-gray-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0A0A0F] border-t border-gray-800 px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#industries" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Industries</a>
            <a href="#testimonials" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Customers</a>
            <Button size="sm" className="w-full bg-blue-600" onClick={() => { setMobileMenuOpen(false); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Get Demo
            </Button>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 mb-6 px-3 py-1">
              <Rocket className="w-3 h-3 mr-1" /> Now supporting 6 industries
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Turn Your Project Into a
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                Living Digital Experience
              </span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              OneAxis transforms blueprints into interactive 3D realities. Sell faster, approve quicker,
              and operate smarter — from real estate to offshore platforms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
          >
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 text-base"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request Live Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 h-12 text-base"
              onClick={() => navigate('/dashboard')}
            >
              <Play className="w-4 h-4 mr-2" />
              Try Interactive Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="text-blue-400 flex justify-center mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything You Need to Sell & Operate</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              One platform. Infinite project types. From first sketch to final handoff.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 hover:bg-gray-900 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                  <span className="text-blue-400">{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section id="industries" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Built for Your Industry</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Specialized 3D models, workflows, and AI insights for every project vertical.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-gray-900/50 border border-gray-800 rounded-xl p-5 overflow-hidden group hover:border-gray-700 transition-all cursor-pointer"
                onClick={() => setActiveIndustry(i)}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${ind.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${ind.color} flex items-center justify-center mb-4`}>
                  <span className="text-white">{ind.icon}</span>
                </div>
                <h3 className="font-semibold mb-1">{ind.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{ind.desc}</p>
                <div className="mt-3 flex items-center text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  View Solution <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">From Blueprint to Reality in 3 Steps</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Upload', desc: 'Send us your plans, CAD files, or BIM models. Our AI ingests and structures everything in hours, not weeks.', icon: <Download className="w-6 h-6" /> },
              { step: '02', title: 'Experience', desc: 'We build your interactive 3D model with unit selectors, walkthroughs, and pricing engines — all in your brand.', icon: <Box className="w-6 h-6" /> },
              { step: '03', title: 'Convert', desc: 'Embed on your website, share with stakeholders, and watch decisions happen faster with fewer meetings.', icon: <TrendingUp className="w-6 h-6" /> },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-400">{item.icon}</span>
                </div>
                <div className="text-blue-500 text-xs font-bold mb-2">STEP {item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                {i < 2 && <div className="hidden sm:block absolute right-0 top-1/2 text-gray-700"><ArrowRight className="w-6 h-6" /></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Trusted by Industry Leaders</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              See how teams across the world use OneAxis to accelerate their projects.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-5"
              >
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}, {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING CTA ─── */}
      <section id="pricing" className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 mb-8">Start with a pilot project. Scale when you are ready.</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { name: 'Project Pulse', price: '$1,500', desc: 'per project', features: ['1 Interactive 3D Model', 'Unit/Lot Selector', 'Mobile Responsive', 'Email Support'] },
              { name: 'Industry Engine', price: '$4,500', desc: 'per month', features: ['Unlimited Projects', '360° Walkthroughs', 'AI Insights', 'Brochure Generator', 'Widget Builder'], popular: true },
              { name: 'Enterprise Axis', price: 'Custom', desc: 'annual contract', features: ['Everything in Industry', 'Custom Integrations', 'On-Premise Option', 'Dedicated Success Manager', 'SLA Guarantee'] },
            ].map((plan) => (
              <div key={plan.name} className={`relative bg-gray-900 rounded-xl border p-5 ${plan.popular ? 'border-blue-500' : 'border-gray-800'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white border-0 text-[10px]">
                    MOST POPULAR
                  </Badge>
                )}
                <h3 className="font-semibold text-sm mb-1">{plan.name}</h3>
                <div className="text-2xl font-bold mb-1">{plan.price}</div>
                <div className="text-gray-500 text-xs mb-4">{plan.desc}</div>
                <div className="space-y-2 text-left">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-400">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button size="lg" className="bg-blue-600 hover:bg-blue-500 px-8" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
            Schedule a Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* ─── LEAD CAPTURE FORM ─── */}
      <section id="demo" className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-1">Request a Live Demo</h3>
              <p className="text-gray-500 text-sm">See your project type in action. No commitment required.</p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-lg mb-1">Request Received!</h4>
                <p className="text-gray-500 text-sm">Our team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Work Email"
                  required
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={leadForm.company}
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={leadForm.industry}
                  onChange={(e) => setLeadForm({ ...leadForm, industry: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="real-estate">Real Estate Development</option>
                  <option value="residential">Residential / Villas</option>
                  <option value="construction">Construction</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="industrial">Industrial / Energy</option>
                  <option value="oil-gas">Oil & Gas</option>
                </select>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 h-11 text-base">
                  Request Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Box className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold">OneAxis</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                The Project Experience Operating System. Transform how you sell, explain, approve, and operate.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Product</h4>
              <div className="space-y-2">
                {['3D Viewer', 'Unit Selector', 'AI Insights', 'Brochure Generator', 'API Access'].map((item) => (
                  <a key={item} href="#" className="block text-gray-500 text-xs hover:text-white transition-colors">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Company</h4>
              <div className="space-y-2">
                {['About', 'Careers', 'Blog', 'Contact'].map((item) => (
                  <a key={item} href="#" className="block text-gray-500 text-xs hover:text-white transition-colors">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Mail className="w-3 h-3" /> hello@oneaxis.live
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Phone className="w-3 h-3" /> +971 4 555 0199
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <MapPin className="w-3 h-3" /> Dubai, UAE
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-600 text-xs">A Stedaxis Product. Sydney | Nagercoil</p>
            <p className="text-gray-700 text-[10px] mt-1"> 2026 Stedaxis Pty Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              {['Privacy', 'Terms', 'Security'].map((item) => (
                <a key={item} href="#" className="text-gray-600 text-xs hover:text-gray-400 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
