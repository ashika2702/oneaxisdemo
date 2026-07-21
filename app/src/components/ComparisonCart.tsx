import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, X, Plus, Minus, Check, Calendar, Clock,
  User, Phone, Mail, MapPin, Star, ArrowRight, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Unit {
  id: string;
  unitNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  view: string;
  viewQuality: number;
  features: string[];
  pricePerSqm: number;
}

const DEMO_UNITS: Unit[] = [
  { id: 'u1', unitNumber: '1204', floor: 12, bedrooms: 3, bathrooms: 2, area: 145, price: 2850000, status: 'available', view: 'Marina', viewQuality: 9, features: ['Corner', 'Balcony', 'Maid Room'], pricePerSqm: 19655 },
  { id: 'u2', unitNumber: '1205', floor: 12, bedrooms: 3, bathrooms: 2, area: 142, price: 2780000, status: 'available', view: 'Marina', viewQuality: 8, features: ['Balcony', 'Storage'], pricePerSqm: 19577 },
  { id: 'u3', unitNumber: '1501', floor: 15, bedrooms: 4, bathrooms: 3, area: 210, price: 5200000, status: 'available', view: 'Ocean', viewQuality: 10, features: ['Penthouse', 'Terrace', 'Private Pool'], pricePerSqm: 24762 },
  { id: 'u4', unitNumber: '805', floor: 8, bedrooms: 2, bathrooms: 2, area: 98, price: 1650000, status: 'available', view: 'Park', viewQuality: 7, features: ['Balcony'], pricePerSqm: 16837 },
  { id: 'u5', unitNumber: '906', floor: 9, bedrooms: 2, bathrooms: 2, area: 105, price: 1820000, status: 'available', view: 'City', viewQuality: 6, features: ['Corner', 'Study Nook'], pricePerSqm: 17333 },
  { id: 'u6', unitNumber: '1102', floor: 11, bedrooms: 3, bathrooms: 2, area: 155, price: 3100000, status: 'available', view: 'Marina', viewQuality: 9, features: ['Corner', 'Balcony', 'Ensuite'], pricePerSqm: 20000 },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

export default function ComparisonCart() {
  const [cart, setCart] = useState<string[]>(['u1', 'u3']);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });

  const cartUnits = DEMO_UNITS.filter((u) => cart.includes(u.id));

  const toggleCart = (id: string) => {
    setCart((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  const handleBooking = () => {
    if (bookingStep === 1 && selectedDate && selectedTime) setBookingStep(2);
    else if (bookingStep === 2 && formData.name && formData.phone) setBookingStep(3);
  };

  const maxPrice = Math.max(...cartUnits.map((u) => u.price));
  const minPrice = Math.min(...cartUnits.map((u) => u.price));
  const maxArea = Math.max(...cartUnits.map((u) => u.area));


  return (
    <div className="flex flex-col h-full bg-[#06080f] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            Comparison Cart
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Shortlist units, compare side-by-side, book a viewing</p>
        </div>
        {cart.length > 0 && (
          <Button className="bg-blue-600 hover:bg-blue-500" onClick={() => setShowBooking(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Book Viewing ({cart.length})
          </Button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Available units */}
        <div className="w-72 border-r border-gray-800 overflow-y-auto p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Available Units</div>
          <div className="space-y-2">
            {DEMO_UNITS.map((unit) => {
              const inCart = cart.includes(unit.id);
              return (
                <div key={unit.id}
                  className={`p-3 rounded-xl border transition-all ${
                    inCart ? 'border-blue-500 bg-blue-500/10' : 'border-gray-800 bg-gray-900/30 hover:border-gray-700'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">Unit {unit.unitNumber}</span>
                    <span className="text-gray-500 text-xs">Floor {unit.floor}</span>
                  </div>
                  <div className="text-emerald-400 text-xs font-medium">${(unit.price / 1000000).toFixed(2)}M</div>
                  <div className="text-gray-500 text-[10px] mt-0.5">{unit.bedrooms}BR | {unit.area}m² | {unit.view}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`w-full mt-2 text-xs ${inCart ? 'text-red-400 hover:text-red-300' : 'text-blue-400 hover:text-blue-300'}`}
                    onClick={() => toggleCart(unit.id)}
                  >
                    {inCart ? <><Minus className="w-3 h-3 mr-1" /> Remove</> : <><Plus className="w-3 h-3 mr-1" /> Add to Compare</>}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison table */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartUnits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Add units from the left to start comparing</p>
            </div>
          ) : (
            <>
              {/* Comparison grid */}
              <div className={`grid gap-4 ${cartUnits.length === 1 ? 'grid-cols-1' : cartUnits.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {cartUnits.map((unit) => (
                  <div key={unit.id} className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                    {/* Unit header */}
                    <div className="p-4 border-b border-gray-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg font-bold text-white">Unit {unit.unitNumber}</span>
                        <button onClick={() => toggleCart(unit.id)} className="text-gray-500 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{unit.status}</Badge>
                    </div>

                    {/* Price */}
                    <div className="p-4 border-b border-gray-800">
                      <div className={`text-2xl font-bold ${unit.price === minPrice ? 'text-emerald-400' : unit.price === maxPrice ? 'text-amber-400' : 'text-white'}`}>
                        ${(unit.price / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-gray-500 text-xs mt-1">${unit.pricePerSqm.toLocaleString()}/m²</div>
                    </div>

                    {/* Specs */}
                    <div className="p-4 space-y-3">
                      {[
                        { label: 'Floor', value: `${unit.floor}` },
                        { label: 'Bedrooms', value: `${unit.bedrooms}` },
                        { label: 'Bathrooms', value: `${unit.bathrooms}` },
                        { label: 'Area', value: `${unit.area} m²`, highlight: unit.area === maxArea },
                        { label: 'View', value: unit.view },
                        { label: 'View Quality', value: `${unit.viewQuality}/10`, stars: true },
                      ].map((spec) => (
                        <div key={spec.label} className="flex justify-between text-sm">
                          <span className="text-gray-500">{spec.label}</span>
                          <span className={`font-medium ${spec.highlight ? 'text-emerald-400' : 'text-white'}`}>
                            {spec.stars ? (
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                {spec.value}
                              </span>
                            ) : spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="px-4 pb-4">
                      <div className="flex flex-wrap gap-1">
                        {unit.features.map((f) => (
                          <span key={f} className="px-2 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison highlights */}
              {cartUnits.length >= 2 && (
                <div className="mt-6 bg-gray-900/30 rounded-xl border border-gray-800 p-4">
                  <div className="text-sm font-medium text-white mb-3">Quick Comparison</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold text-lg">${(minPrice / 1000000).toFixed(2)}M</div>
                      <div className="text-gray-500 text-xs">Best Price</div>
                      <div className="text-gray-600 text-[10px]">
                        Unit {cartUnits.find((u) => u.price === minPrice)?.unitNumber}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold text-lg">{maxArea} m²</div>
                      <div className="text-gray-500 text-xs">Largest</div>
                      <div className="text-gray-600 text-[10px]">
                        Unit {cartUnits.find((u) => u.area === maxArea)?.unitNumber}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-amber-400 font-bold text-lg flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400" />
                        {Math.max(...cartUnits.map((u) => u.viewQuality))}/10
                      </div>
                      <div className="text-gray-500 text-xs">Best View</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => { setShowBooking(false); setBookingStep(1); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0c111f] border border-gray-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Book Private Viewing
                </h3>
                <button onClick={() => { setShowBooking(false); setBookingStep(1); }} className="text-gray-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selected units */}
              <div className="p-5 border-b border-gray-800">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Viewing {cartUnits.length} unit{cartUnits.length > 1 ? 's' : ''}</div>
                <div className="flex flex-wrap gap-2">
                  {cartUnits.map((u) => (
                    <Badge key={u.id} className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      Unit {u.unitNumber} — {u.bedrooms}BR {u.view}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Step 1: Date & Time */}
              {bookingStep === 1 && (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Select Date
                    </label>
                    <Input type="date" value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((t) => (
                        <button key={t} onClick={() => setSelectedTime(t)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedTime === t ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                          }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500" disabled={!selectedDate || !selectedTime} onClick={handleBooking}>
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {bookingStep === 2 && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <User className="w-4 h-4" /> Full Name
                  </div>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name" className="bg-gray-900 border-gray-700 text-white" />
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <Phone className="w-4 h-4" /> Phone Number
                  </div>
                  <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+61 400 000 000" className="bg-gray-900 border-gray-700 text-white" />
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <Mail className="w-4 h-4" /> Email
                  </div>
                  <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com" className="bg-gray-900 border-gray-700 text-white" />
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <MapPin className="w-4 h-4" /> Notes (optional)
                  </div>
                  <Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any specific requests..." className="bg-gray-900 border-gray-700 text-white" />
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-gray-700 text-gray-400" onClick={() => setBookingStep(1)}>Back</Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-500" disabled={!formData.name || !formData.phone} onClick={handleBooking}>
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {bookingStep === 3 && (
                <div className="p-5 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Viewing Confirmed</h4>
                  <p className="text-gray-400 text-sm">
                    Private viewing for {cartUnits.length} unit{cartUnits.length > 1 ? 's' : ''} on <span className="text-white font-medium">{selectedDate}</span> at <span className="text-white font-medium">{selectedTime}</span>
                  </p>
                  <div className="bg-gray-900/50 rounded-lg p-3 text-left text-sm space-y-1">
                    <div className="text-gray-500">Name: <span className="text-white">{formData.name}</span></div>
                    <div className="text-gray-500">Phone: <span className="text-white">{formData.phone}</span></div>
                    {formData.email && <div className="text-gray-500">Email: <span className="text-white">{formData.email}</span></div>}
                  </div>
                  <p className="text-gray-600 text-xs">A confirmation has been sent to your phone. Our sales team will contact you shortly.</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={() => { setShowBooking(false); setBookingStep(1); }}>
                    Done
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
