import { useState } from 'react';
import { FileText, CheckCircle, Pen, Lock, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ContractESign() {
  const [step, setStep] = useState(1);
  const [signed, setSigned] = useState(false);
  const [initials, setInitials] = useState({ p1: false, p2: false, p3: false });

  const allInitialed = initials.p1 && initials.p2 && initials.p3;

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" />Reservation Contract</h2>
        <p className="text-gray-500 text-sm mt-0.5">Review, initial, and sign — legally binding e-signature</p>
      </div>
      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        {step === 1 ? (
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                <div><div className="text-white font-bold">Contract of Sale — Unit 1204</div><div className="text-gray-500 text-xs">Azure Heights Tower, Dubai Marina</div></div>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Draft</Badge>
              </div>
              {[
                { k: 'p1', title: '1. Parties & Property', text: 'The Vendor agrees to sell and the Purchaser agrees to purchase Unit 1204, being a residential apartment on Level 12 of Azure Heights Tower...' },
                { k: 'p2', title: '2. Purchase Price & Payment', text: 'The purchase price is AED 10,450,000 payable as: 10% on exchange, 40% during construction, 50% on completion...' },
                { k: 'p3', title: '3. Sunset Clause & Guarantees', text: 'The Vendor guarantees practical completion by 31 December 2028. Should completion not occur by the Sunset Date, the Purchaser may rescind...' },
              ].map((c) => (
                <div key={c.k} className="flex gap-3">
                  <button onClick={() => setInitials({ ...initials, [c.k]: !initials[c.k as keyof typeof initials] })}
                    className={`mt-0.5 w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${initials[c.k as keyof typeof initials] ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-gray-700 text-gray-600 hover:border-gray-500'}`}>
                    {initials[c.k as keyof typeof initials] ? <CheckCircle className="w-4 h-4" /> : <Pen className="w-3.5 h-3.5" />}
                  </button>
                  <div><div className="text-sm font-medium text-white mb-1">{c.title}</div><p className="text-xs text-gray-400 leading-relaxed">{c.text}</p></div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500"><Lock className="w-3 h-3" />Secured by DocuSign-compatible e-signature. Tamper-evident audit trail.</div>
            <Button className="w-full bg-blue-600 hover:bg-blue-500" disabled={!allInitialed} onClick={() => setStep(2)}>
              {allInitialed ? 'Proceed to Signature' : 'Initial all clauses to continue'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {!signed ? (
              <>
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center">
                  <div className="text-gray-500 text-sm mb-6">Sign below to execute this contract</div>
                  <button onClick={() => setSigned(true)}
                    className="w-full h-32 border-2 border-dashed border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all flex items-center justify-center">
                    <Pen className="w-8 h-8 text-gray-600" />
                  </button>
                </div>
                <Button variant="outline" className="w-full border-gray-700 text-gray-400" onClick={() => setStep(1)}>Back to Review</Button>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>
                <h3 className="text-xl font-bold text-white">Contract Executed</h3>
                <p className="text-gray-400 text-sm">Signed {new Date().toLocaleString()}</p>
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-left text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-gray-500">Contract</span><span className="text-white">Unit 1204 — Azure Heights</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Signed</span><span className="text-emerald-400">{new Date().toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Witness</span><span className="text-white">OneAxis Auto-Witness</span></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-gray-700 text-gray-400 text-xs"><Download className="w-3.5 h-3.5 mr-1" />Download PDF</Button>
                  <Button variant="outline" className="flex-1 border-gray-700 text-gray-400 text-xs"><Calendar className="w-3.5 h-3.5 mr-1" />Add to Calendar</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
