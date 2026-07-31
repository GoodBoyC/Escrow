
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, CreditCard as CardIcon, CheckCircle2 } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { storageService, Transaction } from '../services/storageService';

const PaymentDetails: React.FC = () => {
  const { txId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    country: '',
    address1: '',
    address2: '',
    state: '',
    city: '',
    zip: '',
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (txId) {
      const tx = await storageService.getTransaction(txId);
      if (tx) {
        const updatedTx: Transaction = {
          ...tx,
          status: 'Payment Secured',
          seller: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            dob: formData.dob,
            billing: {
              country: formData.country,
              address1: formData.address1,
              address2: formData.address2,
              state: formData.state,
              city: formData.city,
              zip: formData.zip,
            },
            paymentMethod: 'card',
            cardBrand: getCardBrand(formData.cardNumber),
            cardLast4: formData.cardNumber.slice(-4),
          },
          updatedAt: new Date().toISOString(),
        };
        await storageService.saveTransaction(updatedTx);
      }
    }

    setLoading(false);
    navigate(`/payment-success/${txId}`);
  };

  const getCardBrand = (number: string) => {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    if (number.startsWith('6')) return 'Discover';
    return 'Unknown';
  };

  return (
    <PageWrapper>
      <div className="bg-black text-white min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold">Secure Payment Portal</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                    paymentMethod === 'card' 
                      ? 'bg-white text-black border-white' 
                      : 'bg-black text-white border-white/10 hover:border-white/30'
                  }`}
                >
                  <CardIcon className="w-6 h-6" />
                  <span className="font-bold text-sm">Card Deposit</span>
                </button>
                <button 
                  disabled
                  className="p-4 rounded-2xl border border-white/5 bg-white/5 text-gray-600 cursor-not-allowed flex flex-col items-center gap-3 opacity-50"
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">P</div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-sm">PayPal</span>
                    <span className="text-[10px] uppercase">Coming Soon</span>
                  </div>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">First Name</label>
                      <input required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Last Name</label>
                      <input required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Email</label>
                      <input required type="email" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Phone</label>
                      <input required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-gray-400">Date of Birth</label>
                      <input required type="date" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Billing Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-gray-400">Country</label>
                      <input required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-gray-400">Address Line 1</label>
                      <input required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.address1} onChange={e => setFormData({...formData, address1: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-gray-400">Address Line 2 (Optional)</label>
                      <input className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.address2} onChange={e => setFormData({...formData, address2: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">City</label>
                      <input required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">State / Province</label>
                      <input required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-gray-400">ZIP / Postal Code</label>
                      <input required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Card Information</h3>
                  <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Cardholder Name</label>
                      <input required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                        value={formData.cardholderName} onChange={e => setFormData({...formData, cardholderName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Card Number</label>
                      <div className="relative">
                        <input required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none pl-12" 
                          value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} 
                          placeholder="0000 0000 0000 0000" />
                        <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">Expiration Date</label>
                        <input required placeholder="MM/YY" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                          value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">CVV</label>
                        <input required placeholder="123" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none" 
                          value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 border border-white/10 rounded-xl text-xs text-gray-400 leading-relaxed">
                  "For security verification, a temporary authorization of $0.10 USD may appear on your card. This is not a charge and will automatically be reversed or refunded by your bank. This verification helps confirm your payment method and protects both parties."
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : 'Save Payment'} <Lock className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl">
                <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-gray-500">Secure Payment</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg text-[10px] font-bold opacity-50">VISA</div>
                  <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg text-[10px] font-bold opacity-50">MASTERCARD</div>
                  <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg text-[10px] font-bold opacity-50">AMEX</div>
                  <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg text-[10px] font-bold opacity-50">DISCOVER</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> PCI DSS Compliant
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> 256-bit SSL Encrypted
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Secure Socket Layer
                  </div>
                </div>
              </div>

              <div className="p-6 bg-zinc-900 border border-white/10 rounded-3xl">
                <h4 className="font-bold mb-2 text-sm">Need Help?</h4>
                <p className="text-xs text-gray-400 mb-4">Our support team is available 24/7 to assist you with your payment.</p>
                <button className="w-full py-2 text-xs font-bold border border-white/10 rounded-lg hover:bg-white/5 transition-all">
                  Chat with Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentDetails;
