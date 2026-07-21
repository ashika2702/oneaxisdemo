import { useState } from 'react';
import { Shield, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KYCVerification() {
  const [step, setStep] = useState(1);
  const [doc1, setDoc1] = useState(false);
  const [doc2, setDoc2] = useState(false);
  const [amlCheck, setAmlCheck] = useState<'idle' | 'pass' | 'flag'>('idle');

  const runAML = () => {
    setStep(3);
    setTimeout(() => setAmlCheck('pass'), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-purple-400" />KYC / AML Verification</h2>
        <p className="text-gray-500 text-sm mt-0.5">Identity and funds verification required for deposits over $10,000</p>
      </div>
      <div className="flex-1 p-6 max-w-xl mx-auto w-full space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-2">
          {['Upload ID', 'Proof of Funds', 'AML Check'].map((s, i) => (
            <div key={s} className={`flex-1 text-center py-2 rounded-lg text-xs font-medium ${step > i ? 'bg-emerald-500/10 text-emerald-400' : step === i + 1 ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-800 text-gray-600'}`}>{s}</div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${doc1 ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-700 hover:border-blue-500'}`} onClick={() => setDoc1(true)}>
              {doc1 ? <><CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" /><div className="text-emerald-400 text-sm font-medium">Passport Uploaded</div></> : <><Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" /><div className="text-white text-sm">Click to upload Passport or Emirates ID</div><div className="text-gray-500 text-xs mt-1">JPG, PNG, PDF</div></>}
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-500" disabled={!doc1} onClick={() => setStep(2)}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${doc2 ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-700 hover:border-blue-500'}`} onClick={() => setDoc2(true)}>
              {doc2 ? <><CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" /><div className="text-emerald-400 text-sm font-medium">Bank Statement Uploaded</div></> : <><Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" /><div className="text-white text-sm">Upload Bank Statement (last 3 months)</div><div className="text-gray-500 text-xs mt-1">PDF preferred</div></>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-gray-700 text-gray-400" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-500" disabled={!doc2} onClick={runAML}>Run AML Check</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 py-8">
            {amlCheck === 'idle' ? (
              <><div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-gray-400">Scanning sanctions, PEP, and adverse media databases...</p></>
            ) : amlCheck === 'pass' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>
                <h3 className="text-xl font-bold text-white">KYC / AML Cleared</h3>
                <p className="text-gray-400 text-sm">All checks passed. Deposit can proceed.</p>
                <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4 text-left text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-gray-500">ID Verification</span><span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passed</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Funds Source</span><span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Sanctions Check</span><span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Clear</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">PEP Screening</span><span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Not Listed</span></div>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto"><AlertTriangle className="w-8 h-8 text-amber-400" /></div>
                <h3 className="text-xl font-bold text-white">Manual Review Required</h3>
                <p className="text-gray-400 text-sm">A flag was raised. Our compliance team will contact you within 24 hours.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
