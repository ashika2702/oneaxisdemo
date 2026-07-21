import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calculator, Briefcase, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function FinancePreQual() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [deposit, setDeposit] = useState('');
  const [showResult, setShowResult] = useState(false);

  const annualIncome = parseInt(income) || 0;
  const annualExpenses = parseInt(expenses) || 0;
  const depositAmount = parseInt(deposit) || 0;
  const netIncome = annualIncome - annualExpenses;
  const maxBorrowing = netIncome * 5;
  const totalBudget = maxBorrowing + depositAmount;
  const serviceability = annualIncome > 0 ? (netIncome / annualIncome) * 100 : 0;
  const status = totalBudget >= 2850000 ? 'qualified' : totalBudget >= 1500000 ? 'conditional' : 'review';

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><Calculator className="w-5 h-5 text-emerald-400" />Finance Pre-Qualification</h2>
        <p className="text-gray-500 text-sm mt-0.5">Check borrowing capacity in 60 seconds</p>
      </div>
      <div className="flex-1 p-6 max-w-xl mx-auto w-full space-y-4">
        {!showResult ? (
          <>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3"><Briefcase className="w-4 h-4 text-blue-400" /><span className="text-sm font-medium">Annual Household Income (AED)</span></div>
              <Input type="number" placeholder="e.g. 450,000" value={income} onChange={(e) => setIncome(e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3"><DollarSign className="w-4 h-4 text-red-400" /><span className="text-sm font-medium">Annual Expenses (AED)</span></div>
              <Input type="number" placeholder="e.g. 120,000" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3"><Home className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium">Available Deposit (AED)</span></div>
              <Input type="number" placeholder="e.g. 500,000" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-500" disabled={!income || !expenses} onClick={() => setShowResult(true)}>
              Calculate <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className={`rounded-xl border p-5 ${status === 'qualified' ? 'bg-emerald-500/5 border-emerald-500/20' : status === 'conditional' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={status === 'qualified' ? 'bg-emerald-500/10 text-emerald-400' : status === 'conditional' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}>
                  {status === 'qualified' ? 'Pre-Qualified' : status === 'conditional' ? 'Conditional' : 'Needs Review'}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-white">AED {totalBudget.toLocaleString()}</div>
              <div className="text-gray-500 text-sm">Total purchasing power</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4"><div className="text-xs text-gray-500 mb-1">Max Borrowing</div><div className="text-lg font-bold text-white">AED {maxBorrowing.toLocaleString()}</div></div>
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4"><div className="text-xs text-gray-500 mb-1">Serviceability</div><div className="text-lg font-bold text-white">{serviceability.toFixed(0)}%</div></div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 space-y-2">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Recommendation</div>
              {status === 'qualified' ? (
                <p className="text-sm text-emerald-400">Strong position. Your budget covers the target unit. We recommend locking in a rate with our broker panel.</p>
              ) : status === 'conditional' ? (
                <p className="text-sm text-amber-400">Conditional approval likely. Consider increasing deposit or selecting a lower-priced unit. Our brokers can help structure this.</p>
              ) : (
                <p className="text-sm text-red-400">Speak to our mortgage broker panel. Alternative structures or co-borrowing may be available.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-xs"><Briefcase className="w-3.5 h-3.5 mr-1" />Connect Broker</Button>
              <Button variant="outline" className="flex-1 border-gray-700 text-gray-400 text-xs" onClick={() => setShowResult(false)}>Recalculate</Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
