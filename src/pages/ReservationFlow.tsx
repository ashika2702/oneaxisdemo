import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, CreditCard, FileText, CheckCircle2, ArrowRight,
  ChevronLeft, ChevronRight, Shield, Clock, User,
  Building2, DollarSign, Hash, CalendarDays, AlertTriangle,
  CheckCheck, X, Printer, Download, Send, Phone, Mail
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
type Step = "select" | "hold" | "details" | "payment" | "contract" | "confirmed";
type PaymentMethod = "card" | "bank" | "bpay";

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */
const UNITS = [
  { id: "A1203", number: "A1203", floor: 12, type: "2 Bed + Study", area: 95, price: 1650000, facing: "North East", view: "Harbour + City", status: "available" as const },
  { id: "A1204", number: "A1204", floor: 12, type: "2 Bed", area: 88, price: 1520000, facing: "East", view: "Harbour", status: "available" as const },
  { id: "A1401", number: "A1401", floor: 14, type: "3 Bed", area: 125, price: 2450000, facing: "North", view: "City + Harbour", status: "available" as const },
  { id: "A1402", number: "A1402", floor: 14, type: "2 Bed + Study", area: 98, price: 1820000, facing: "North East", view: "Harbour", status: "available" as const },
  { id: "A1501", number: "A1501", floor: 15, type: "3 Bed", area: 128, price: 2680000, facing: "North", view: "City + Harbour", status: "available" as const },
  { id: "A1002", number: "A1002", floor: 10, type: "2 Bed", area: 85, price: 1380000, facing: "South East", view: "Park", status: "available" as const },
];

const STEPS: { id: Step; label: string; icon: any }[] = [
  { id: "select", label: "Select", icon: Building2 },
  { id: "hold", label: "Hold", icon: Lock },
  { id: "details", label: "Details", icon: User },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "contract", label: "Contract", icon: FileText },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle2 },
];

const fmtPrice = (n: number) => `$${(n / 1000000).toFixed(2)}M`;

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function ReservationFlow() {
  const [step, setStep] = useState<Step>("select");
  const [selectedUnit, setSelectedUnit] = useState<typeof UNITS[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", idNumber: "" });
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reservationId, setReservationId] = useState("");
  const [unitStatuses, setUnitStatuses] = useState<Record<string, string>>({});

  const stepIndex = STEPS.findIndex(s => s.id === step);

  const selectUnit = (unit: typeof UNITS[0]) => {
    setSelectedUnit(unit);
    setStep("hold");
  };

  const processPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("contract");
    }, 2000);
  };

  const confirmReservation = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const rid = `RA-${Date.now().toString(36).toUpperCase()}`;
      setReservationId(rid);
      if (selectedUnit) {
        setUnitStatuses(prev => ({ ...prev, [selectedUnit.id]: "reserved" }));
      }
      setStep("confirmed");
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 h-[52px] border-b border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold text-white/90">Reserve Unit</h1>
              <p className="text-[10px] text-white/25">CONVERT layer — live reservation flow</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all ${
                  i <= stepIndex ? "bg-emerald-500/10 text-emerald-400" : "text-white/15"
                }`}>
                  <s.icon className="w-3 h-3" />
                  <span className="hidden lg:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-white/10 mx-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-8">
          <div className="w-full max-w-[680px]">
            <AnimatePresence mode="wait">
              {/* STEP 1: SELECT UNIT */}
              {step === "select" && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-[18px] font-semibold text-white/90 mb-1">Select a Unit</h2>
                  <p className="text-[12px] text-white/30 mb-6">Choose from available units in Azure Heights</p>

                  <div className="space-y-2">
                    {UNITS.map((unit, i) => {
                      const isReserved = unitStatuses[unit.id] === "reserved";
                      return (
                        <motion.button
                          key={unit.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => !isReserved && selectUnit(unit)}
                          disabled={isReserved}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            isReserved
                              ? "bg-red-500/5 border-red-500/10 opacity-50 cursor-not-allowed"
                              : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08]"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-white/20" />
                            </div>
                            <div className="text-left">
                              <p className="text-[13px] font-medium text-white/80">{unit.number}</p>
                              <p className="text-[10px] text-white/25">{unit.type} · {unit.area}m² · Floor {unit.floor}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[14px] font-semibold text-white/70">{fmtPrice(unit.price)}</p>
                            <p className="text-[10px] text-white/20">{unit.facing} · {unit.view}</p>
                          </div>
                          {isReserved && (
                            <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 text-[9px] font-semibold uppercase">Reserved</span>
                          )}
                          {!isReserved && <ArrowRight className="w-4 h-4 text-white/15" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: HOLD */}
              {step === "hold" && selectedUnit && (
                <motion.div
                  key="hold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-[18px] font-semibold text-white/90 mb-1">Reserve & Hold</h2>
                  <p className="text-[12px] text-white/30 mb-6">A $5,000 holding deposit secures this unit for 5 business days</p>

                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/[0.04]">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white/20" />
                      </div>
                      <div>
                        <p className="text-[16px] font-bold text-white/90">Unit {selectedUnit.number}</p>
                        <p className="text-[11px] text-white/30">{selectedUnit.type} · {selectedUnit.area}m² · Floor {selectedUnit.floor}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[18px] font-bold text-white/90">{fmtPrice(selectedUnit.price)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { label: "Unit Price", value: fmtPrice(selectedUnit.price) },
                        { label: "Holding Deposit", value: "$5,000.00", highlight: true },
                        { label: "Hold Period", value: "5 Business Days" },
                        { label: "Balance Due", value: fmtPrice(selectedUnit.price - 5000) },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between py-1.5">
                          <span className="text-[11px] text-white/30">{row.label}</span>
                          <span className={`text-[12px] font-medium ${row.highlight ? "text-emerald-400" : "text-white/60"}`}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/10 mb-6">
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      This unit will be held exclusively for you. If the contract is not signed within 5 business days,
                      the hold will expire and the unit will return to available inventory.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep("select")} className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-white/40 text-[12px] hover:bg-white/[0.08] transition-colors">
                      Back
                    </button>
                    <button
                      onClick={() => setStep("details")}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-[12px] font-medium hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      Proceed to Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: BUYER DETAILS */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-[18px] font-semibold text-white/90 mb-1">Buyer Details</h2>
                  <p className="text-[12px] text-white/30 mb-6">Enter the primary purchaser's information</p>

                  <div className="space-y-4 mb-6">
                    {[
                      { label: "Full Name", key: "name" as const, icon: User, placeholder: "James Chen", type: "text" },
                      { label: "Email Address", key: "email" as const, icon: Mail, placeholder: "james@email.com", type: "email" },
                      { label: "Phone Number", key: "phone" as const, icon: Phone, placeholder: "+61 412 345 678", type: "tel" },
                      { label: "ID / Passport Number", key: "idNumber" as const, icon: Hash, placeholder: "PA1234567", type: "text" },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-[10px] text-white/25 uppercase tracking-wider mb-1.5 block">{field.label}</label>
                        <div className="relative">
                          <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                          <input
                            type={field.type}
                            value={formData[field.key]}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-[12px] text-white/70 placeholder:text-white/15 outline-none focus:border-white/15 transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep("hold")} className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-white/40 text-[12px] hover:bg-white/[0.08] transition-colors">
                      Back
                    </button>
                    <button
                      onClick={() => setStep("payment")}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-[12px] font-medium hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      Continue to Payment <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: PAYMENT */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-[18px] font-semibold text-white/90 mb-1">Holding Deposit</h2>
                  <p className="text-[12px] text-white/30 mb-6">$5,000 to secure your unit for 5 business days</p>

                  {/* Payment methods */}
                  <div className="flex gap-2 mb-6">
                    {([
                      { id: "card" as PaymentMethod, label: "Credit Card", icon: CreditCard },
                      { id: "bank" as PaymentMethod, label: "Bank Transfer", icon: Building2 },
                      { id: "bpay" as PaymentMethod, label: "BPAY", icon: DollarSign },
                    ]).map(pm => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-[11px] font-medium transition-all ${
                          paymentMethod === pm.id
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-white/[0.02] border-white/[0.04] text-white/30 hover:border-white/[0.08]"
                        }`}
                      >
                        <pm.icon className="w-4 h-4" />
                        {pm.label}
                      </button>
                    ))}
                  </div>

                  {/* Card form */}
                  {paymentMethod === "card" && (
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 space-y-4 mb-6">
                      <div>
                        <label className="text-[10px] text-white/25 uppercase tracking-wider mb-1.5 block">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-[12px] text-white/70 placeholder:text-white/15 outline-none focus:border-white/15"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-white/25 uppercase tracking-wider mb-1.5 block">Expiry</label>
                          <input type="text" placeholder="MM/YY" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[12px] text-white/70 placeholder:text-white/15 outline-none focus:border-white/15" />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/25 uppercase tracking-wider mb-1.5 block">CVC</label>
                          <input type="text" placeholder="123" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[12px] text-white/70 placeholder:text-white/15 outline-none focus:border-white/15" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-white/25 uppercase tracking-wider mb-1.5 block">Name on Card</label>
                        <input type="text" placeholder="James Chen" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[12px] text-white/70 placeholder:text-white/15 outline-none focus:border-white/15" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank" && (
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 mb-6">
                      <p className="text-[11px] text-white/40 mb-3">Transfer $5,000.00 to:</p>
                      <div className="space-y-2">
                        {[
                          { label: "Account Name", value: "Stedaxis Pty Ltd Trust" },
                          { label: "BSB", value: "062-000" },
                          { label: "Account Number", value: "1234 5678" },
                          { label: "Reference", value: `HOLD-${selectedUnit?.number || "UNIT"}` },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.03]">
                            <span className="text-[10px] text-white/25">{row.label}</span>
                            <span className="text-[11px] text-white/60 font-medium">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bpay" && (
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 mb-6 text-center">
                      <p className="text-[11px] text-white/40 mb-3">Pay via BPAY</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/[0.03] rounded-lg p-3">
                          <p className="text-[9px] text-white/20 mb-1">Biller Code</p>
                          <p className="text-[16px] font-bold text-white/70">123456</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg p-3">
                          <p className="text-[9px] text-white/20 mb-1">Ref Number</p>
                          <p className="text-[16px] font-bold text-white/70">{selectedUnit?.number || "UNIT"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2 mb-6">
                    <Shield className="w-4 h-4 text-emerald-400/40 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-white/20 leading-relaxed">
                      Your payment is secured by Stripe. The holding deposit is fully refundable if you decide not to proceed.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep("details")} className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-white/40 text-[12px] hover:bg-white/[0.08] transition-colors">
                      Back
                    </button>
                    <button
                      onClick={processPayment}
                      disabled={processing}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-[12px] font-medium hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {processing ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <Clock className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <>Pay $5,000.00 <ArrowRight className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: CONTRACT */}
              {step === "contract" && (
                <motion.div
                  key="contract"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-[18px] font-semibold text-white/90 mb-1">Sales Contract</h2>
                  <p className="text-[12px] text-white/30 mb-6">Review and agree to the contract of sale</p>

                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 mb-6 max-h-[300px] overflow-auto">
                    <h3 className="text-[13px] font-semibold text-white/70 mb-3">Contract of Sale — Residential Property</h3>
                    <div className="space-y-3 text-[10px] text-white/30 leading-relaxed">
                      <p><strong className="text-white/50">1. PARTIES</strong><br />
                      Vendor: Stedaxis Developments Pty Ltd<br />
                      Purchaser: {formData.name || "[Buyer Name]"}</p>

                      <p><strong className="text-white/50">2. PROPERTY</strong><br />
                      Unit {selectedUnit?.number}, Azure Heights, 45 Park Avenue, Sydney NSW 2000<br />
                      Area: {selectedUnit?.area}m² · Type: {selectedUnit?.type}</p>

                      <p><strong className="text-white/50">3. PURCHASE PRICE</strong><br />
                      Total: {selectedUnit ? fmtPrice(selectedUnit.price) : "$0"}<br />
                      Holding Deposit (paid): $5,000.00<br />
                      Balance: {selectedUnit ? fmtPrice(selectedUnit.price - 5000) : "$0"}</p>

                      <p><strong className="text-white/50">4. SETTLEMENT</strong><br />
                      Settlement period: 42 days from exchange<br />
                      Estimated settlement: {new Date(Date.now() + 42 * 86400000).toLocaleDateString("en-AU")}</p>

                      <p><strong className="text-white/50">5. SPECIAL CONDITIONS</strong><br />
                      Subject to finance approval within 14 days<br />
                      Subject to satisfactory building inspection<br />
                      Cooling off period: 5 business days (NSW)</p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      agreed ? "bg-emerald-500/20 border-emerald-500/40" : "border-white/[0.1]"
                    }`}>
                      {agreed && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="hidden" />
                    <span className="text-[11px] text-white/30 leading-relaxed">
                      I have read and agree to the Contract of Sale. I understand that a $5,000 holding deposit has been paid
                      and the balance is due at settlement within 42 days.
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button onClick={() => setStep("payment")} className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-white/40 text-[12px] hover:bg-white/[0.08] transition-colors">
                      Back
                    </button>
                    <button
                      onClick={confirmReservation}
                      disabled={!agreed || processing}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-[12px] font-medium hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
                    >
                      {processing ? "Processing..." : <>Sign & Confirm <CheckCircle2 className="w-3.5 h-3.5" /></>}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: CONFIRMED */}
              {step === "confirmed" && (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </motion.div>

                  <h2 className="text-[22px] font-bold text-white/90 mb-1">Reservation Confirmed</h2>
                  <p className="text-[12px] text-white/30 mb-6">Unit {selectedUnit?.number} is now held exclusively for you</p>

                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 max-w-[400px] mx-auto mb-6">
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/[0.04]">
                      <span className="text-[10px] text-white/20">Reservation ID</span>
                      <span className="text-[12px] font-mono text-white/60">{reservationId}</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: "Unit", value: selectedUnit?.number },
                        { label: "Purchaser", value: formData.name || "James Chen" },
                        { label: "Deposit Paid", value: "$5,000.00" },
                        { label: "Hold Expires", value: new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-AU") },
                        { label: "Status", value: "Active Hold", color: "text-emerald-400" },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between">
                          <span className="text-[10px] text-white/20">{row.label}</span>
                          <span className={`text-[11px] font-medium ${(row as any).color || "text-white/60"}`}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 mb-8">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] text-white/50 text-[11px] hover:bg-white/[0.1] transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download Contract
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] text-white/50 text-[11px] hover:bg-white/[0.1] transition-colors">
                      <Send className="w-3.5 h-3.5" /> Email Receipt
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] text-white/50 text-[11px] hover:bg-white/[0.1] transition-colors">
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                  </div>

                  {/* Timeline */}
                  <div className="max-w-[400px] mx-auto">
                    <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Next Steps</p>
                    <div className="space-y-0">
                      {[
                        { label: "Holding Deposit", desc: "$5,000 paid — confirmed", done: true },
                        { label: "Contract Exchange", desc: "Within 5 business days", done: false },
                        { label: "Cooling Off Period", desc: "5 business days (NSW)", done: false },
                        { label: "Settlement", desc: "42 days from exchange", done: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 pb-3 relative">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.done ? "bg-emerald-500/20" : "bg-white/[0.04]"
                          }`}>
                            {item.done ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/15" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-[11px] ${item.done ? "text-white/60 font-medium" : "text-white/30"}`}>{item.label}</p>
                            <p className="text-[9px] text-white/15">{item.desc}</p>
                          </div>
                          {i < 3 && <div className="absolute left-[9px] top-5 w-px h-4 bg-white/[0.04]" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
