import { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Shield, ArrowRight, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ReservationDeposit() {
  const [step, setStep] = useState(1);
  const [unit] = useState({ number: '1204', floor: 12, price: 2850000, area: 145, view: 'Marina' });
  const [form, setForm] = useState({ name: '', email: '', phone: '', deposit: 5000 });
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep(4); }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-emerald-400" />Reserve Unit {unit.number}</h2>
        <p className="text-gray-500 text-sm mt-0.5">Secure with deposit — refundable within 10 business days</p>
      </div>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {['Unit Details', 'Your Details', 'Payment', 'Confirmed'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] ${step >= i + 1 ? 'text-gray-300' : 'text-gray-600'}`}>{s}</span>
              {i < 3 && <div className={`flex-1 h-px ${step > i + 1 ? 'bg-emerald-500' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Unit */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5">
              <div className="flex justify-between items-start mb-3">
                <div><div className="text-white font-bold text-lg">Unit {unit.number}</div><div className="text-gray-500 text-sm">Floor {unit.floor} | {unit.area}m² | {unit.view} View</div></div>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Available</Badge>
              </div>
              <div className="text-3xl font-bold text-white">${(unit.price / 1000000).toFixed(3)}M</div>
              <div className="text-gray-500 text-sm mt-1">${(unit.price / unit.area).toLocaleString()}/m²</div>
            </div>
            <div className="bg-emerald-500/5 rounded-xl border border-emerald-500/20 p-4">
              <div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium text-emerald-400">Deposit Protection</span></div>
              <p className="text-xs text-gray-400">Your ${form.deposit.toLocaleString()} deposit is held in trust. Fully refundable within 10 business days if you choose not to proceed.</p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={() => setStep(2)}>Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-3">
            <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-gray-900 border-gray-700 text-white" />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-gray-900 border-gray-700 text-white" />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-gray-900 border-gray-700 text-white" />
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" className="flex-1 border-gray-700 text-gray-400" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500" disabled={!form.name || !form.email} onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 mb-3">
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">Reservation Deposit</span><span className="text-white font-bold">${form.deposit.toLocaleString()}.00</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Processing Fee</span><span className="text-gray-400">$0.00</span></div>
              <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between"><span className="text-white font-medium">Total</span><span className="text-emerald-400 font-bold">${form.deposit.toLocaleString()}.00</span></div>
            </div>
            <Input placeholder="Card Number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className="bg-gray-900 border-gray-700 text-white" />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} className="bg-gray-900 border-gray-700 text-white" />
              <Input placeholder="CVV" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} className="bg-gray-900 border-gray-700 text-white" />
            </div>
            <Input placeholder="Name on Card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className="bg-gray-900 border-gray-700 text-white" />
            <div className="flex items-center gap-2 text-[10px] text-gray-500"><Lock className="w-3 h-3" />256-bit SSL encryption. PCI compliant.</div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 border-gray-700 text-gray-400" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500" disabled={processing || !card.number} onClick={handlePay}>
                {processing ? 'Processing...' : `Pay $${form.deposit.toLocaleString()}`}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmed */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>
            <h3 className="text-xl font-bold text-white">Reservation Confirmed</h3>
            <p className="text-gray-400 text-sm">Unit {unit.number} is now held for you. Receipt sent to {form.email}.</p>
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-left text-sm space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Unit</span><span className="text-white">{unit.number}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Deposit</span><span className="text-emerald-400">${form.deposit.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Held Until</span><span className="text-amber-400">{new Date(Date.now() + 10 * 86400000).toLocaleDateString()}</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-gray-700 text-gray-400 text-xs"><FileText className="w-3.5 h-3.5 mr-1" />View Contract</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-xs"><DollarSign className="w-3.5 h-3.5 mr-1" />Pay Balance</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
