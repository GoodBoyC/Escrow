
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { storageService, Transaction } from '../services/storageService';

const AcceptPayment: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'id' | 'details'>('id');
  const [txId, setTxId] = useState('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const tx = await storageService.getTransaction(txId);
    if (tx) {
      setTransaction(tx);
      setStep('details');
    } else {
      setError('Invalid Transaction ID. Please check and try again.');
    }
    setLoading(false);
  };

  return (
    <PageWrapper>
      <div className="bg-black text-white min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {step === 'id' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-3xl text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-8">
                <ShieldCheck className="w-6 h-6 text-white" />
                <h1 className="text-2xl font-bold">Accept Escrow Payment</h1>
              </div>
              <p className="text-gray-400 mb-8">Enter the Transaction ID provided by the buyer to begin the payment process.</p>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-medium text-gray-400 ml-1">Transaction ID</label>
                  <input 
                    required
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-all text-center text-xl font-mono tracking-widest"
                    value={txId}
                    onChange={e => setTxId(e.target.value.toUpperCase())}
                    placeholder="ESC-XXXXXXX"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm justify-center">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Continue'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="w-6 h-6 text-white" />
                <h1 className="text-2xl font-bold">Transaction Details</h1>
              </div>
              
              {transaction && (
                <div className="space-y-6">
                  <div className="bg-black border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-gray-500">Buyer</div>
                      <div className="text-right font-medium">{transaction.buyer.fullName}</div>
                      <div className="text-gray-500">Item</div>
                      <div className="text-right font-medium">{transaction.item.name}</div>
                      <div className="text-gray-500">Description</div>
                      <div className="text-right font-medium text-gray-400">{transaction.item.description}</div>
                      <div className="text-gray-500">Amount</div>
                      <div className="text-right font-bold text-lg">{transaction.item.price} {transaction.item.currency}</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm leading-relaxed text-center">
                    The buyer has created this escrow transaction and is requesting payment for the item above. Continue to complete the payment process.
                  </div>

                  <button 
                    onClick={() => navigate(`/payment/${transaction.id}`)}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AcceptPayment;
