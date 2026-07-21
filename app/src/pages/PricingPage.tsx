import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Check, ArrowRight, Sparkles, Zap, Shield, Users,
  MessageSquare, FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function PricingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const plans = [
    {
      name: 'Project Pulse',
      icon: <Zap className="w-5 h-5" />,
      price: billingCycle === 'monthly' ? 500 : 400,
      period: 'per project',
      description: 'For one-off projects and small teams getting started with interactive project experiences.',
      features: [
        'AI Document Ingestion (PDF, CAD, Images)',
        'Interactive 3D Viewer',
        'Basic Stack Plan / Lot Selector',
        '5 Team Members',
        '7-day Project Archive',
        'Community Support',
        'Basic Analytics',
      ],
      notIncluded: [
        'AI Conversational Assistant',
        'What-If Simulator',
        'AI Optioneer',
        'Digital Handoff Workflows',
        'API Access',
      ],
      cta: 'Start a Project',
      popular: false,
    },
    {
      name: 'Industry Engine',
      icon: <Sparkles className="w-5 h-5" />,
      price: billingCycle === 'monthly' ? 3000 : 2400,
      period: '/ month',
      description: 'For professional teams running multiple projects monthly across any industry.',
      features: [
        'Everything in Project Pulse',
        'Unlimited Active Projects',
        'AI Conversational Assistant',
        'What-If Simulator',
        'Full AI Optioneer',
        'Digital Handoff Workflows',
        'Priority Support (24h)',
        'API Access',
        'Custom Branding & White-label',
        'Advanced Analytics & Reports',
        'Stakeholder Collaboration',
        'Material Marketplace Access',
      ],
      notIncluded: [
        'Dedicated AI Training',
        'On-premise Deployment',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise Axis',
      icon: <Shield className="w-5 h-5" />,
      price: null,
      period: 'Custom pricing',
      description: 'For organizations running projects at scale across divisions and geographies.',
      features: [
        'Everything in Industry Engine',
        'Unlimited Everything',
        'Dedicated AI Model Training',
        'SSO & Advanced Security (SOC 2)',
        'Custom Integrations (ERP, CRM, BIM)',
        'On-premise Deployment Option',
        'Dedicated Success Manager',
        'SLA Guarantee (99.9% uptime)',
        'Custom AI Agent Development',
        'Executive Dashboard & Reporting',
        'Multi-organization Management',
        'Training & Certification Program',
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ];
  
  const faqs = [
    {
      q: 'Can I switch plans at any time?',
      a: 'Yes. You can upgrade or downgrade your plan at any time. Prorated charges or credits will apply to your account.',
    },
    {
      q: 'What happens to my projects if I cancel?',
      a: 'Your projects remain accessible in read-only mode for 30 days. After that, you can export all data or reactivate your account.',
    },
    {
      q: 'Is there a limit on file sizes?',
      a: 'Project Pulse supports files up to 100MB each. Industry Engine and Enterprise support files up to 2GB each, including full BIM models.',
    },
    {
      q: 'Do you offer discounts for non-profits or education?',
      a: 'Yes. We offer 40% discounts for verified non-profits, educational institutions, and government organizations.',
    },
    {
      q: 'Can I use OneAxis for client presentations?',
      a: 'Absolutely. Every plan includes presentation mode. Industry and Enterprise plans add white-label capability so your brand is front and center.',
    },
    {
      q: 'How does the AI Assistant work?',
      a: 'The AI ingests your project data and becomes an expert on your specific project. Ask it anything in natural language — pricing, comparisons, recommendations, risk analysis.',
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#06080f] text-white">
      {/* Nav */}
      <nav className="h-16 border-b border-gray-800 glass-panel flex items-center px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">OneAxis</span>
        </div>
        <div className="flex-1" />
        <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </nav>
      
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">PRICING</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invest in <span className="gradient-text">Project Clarity</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Start with a single project. Scale to enterprise-wide deployment. 
            Pay for outcomes, not seats.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-800/50 rounded-xl p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'annual' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Annual
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">Save 20%</Badge>
            </button>
          </div>
        </motion.div>
        
        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-panel rounded-2xl p-6 relative flex flex-col ${
                plan.popular ? 'border-blue-500/50 oneaxis-glow' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white border-0">
                  MOST POPULAR
                </Badge>
              )}
              
              <div className="mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                {plan.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price.toLocaleString()}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-white">Custom Pricing</div>
                )}
              </div>
              
              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
                {plan.notIncluded.map((feature, j) => (
                  <div key={`no-${j}`} className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {feature}
                  </div>
                ))}
              </div>
              
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                    : plan.name === 'Enterprise Axis'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
                onClick={() => navigate('/dashboard')}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
        
        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-8 md:p-12 text-center mb-20 bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/20"
        >
          <div className="max-w-2xl mx-auto">
            <Users className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need a Custom Deployment?
            </h2>
            <p className="text-gray-400 mb-6">
              For organizations with 50+ projects, multi-division rollouts, or specific compliance requirements. 
              We will design a deployment plan tailored to your operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-500 text-white px-8"
                onClick={() => navigate('/dashboard')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Talk to Our Team
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Download Enterprise Brief
              </Button>
            </div>
          </div>
        </motion.div>
        
        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Feature Comparison</h2>
          <div className="glass-panel rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Feature</th>
                  <th className="text-center p-4 text-gray-400 font-medium text-sm w-32">Pulse</th>
                  <th className="text-center p-4 text-blue-400 font-medium text-sm w-32">Engine</th>
                  <th className="text-center p-4 text-gray-400 font-medium text-sm w-32">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ['AI Document Ingestion', true, true, true],
                  ['Interactive 3D Viewer', true, true, true],
                  ['Stack Plan / Lot Selector', true, true, true],
                  ['Team Members', '5', 'Unlimited', 'Unlimited'],
                  ['AI Conversational Assistant', false, true, true],
                  ['What-If Simulator', false, true, true],
                  ['AI Optioneer', false, true, true],
                  ['Digital Handoff Workflows', false, true, true],
                  ['API Access', false, true, true],
                  ['Custom Branding', false, true, true],
                  ['White-label Selectors', false, false, true],
                  ['On-premise Option', false, false, true],
                  ['SSO / SAML', false, false, true],
                  ['Dedicated Success Manager', false, false, true],
                  ['Custom AI Training', false, false, true],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    <td className="p-4 text-gray-300">{row[0]}</td>
                    <td className="p-4 text-center">
                      {typeof row[1] === 'boolean' ? (
                        row[1] ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-gray-700">—</span>
                      ) : (
                        <span className="text-gray-400">{row[1]}</span>
                      )}
                    </td>
                    <td className="p-4 text-center bg-blue-500/5">
                      {typeof row[2] === 'boolean' ? (
                        row[2] ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-gray-700">—</span>
                      ) : (
                        <span className="text-gray-400">{row[2]}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row[3] === 'boolean' ? (
                        row[3] ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-gray-700">—</span>
                      ) : (
                        <span className="text-gray-400">{row[3]}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel rounded-xl p-5">
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-600 text-sm">
        <p> 2025 OneAxis Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
