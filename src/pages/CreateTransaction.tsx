
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { storageService, Transaction } from '../services/storageService';

const CreateTransaction: React.FC = () => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [txId, setTxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyerFullName: '',
    buyerEmail: '',
    buyerPhone: '',
    itemName: '',
    itemDescription: '',
    quantity: 1,
    itemPrice: '',
    currency: 'USD',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const id = storageService.generateTransactionId();
    const transaction: Transaction = {
      id,
      status: 'Waiting for Seller',
      buyer: {
        fullName: formData.buyerFullName,
        email: formData.buyerEmail,
        phone: formData.buyerPhone,
      },
      item: {
        name: formData.itemName,
        description: formData.itemDescription,
        quantity: Number(formData.quantity),
        price: Number(formData.itemPrice),
        currency: formData.currency,
        notes: formData.notes,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await storageService.saveTransaction(transaction);
    setTxId(id);
    setStep('success');
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper>
      <div className="bg-black text-white min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {step === 'form' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 p-8 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="w-6 h-6 text-white" />
                <h1 className="text-2xl font-bold">Create Escrow Transaction</h1>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Buyer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Full Name</label>
                      <input 
                        required
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-all"
                        value={formData.buyerFullName}
                        onChange={e => setFormData({...formData, buyerFullName: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Email Address</label>
                      <input 
                        required
                        type="email"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-all"
                        value={formData.buyerEmail}
                        onChange={e => setFormData({...formData, buyerEmail: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-gray-400">Phone Number</label>
                      <input 
                        required
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-all"
                        value={formData.buyerPhone}
                        onChange={e => setFormData({...formData, buyerPhone: e.target.value})}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Transaction Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-gray-400">Item Name</label>
                      <input 
                        required
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-all"
                        value={formData.itemName}
                        onChange={e => setFormData({...formData, itemName: e.target.value})}
                        placeholder="e.g. Domain Name, Freelance Project"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-gray-400">Item Description</label>
                      <textarea 
                        required
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-all h-24"
                        value={formData.itemDescription}
                        onChange={e => setFormData({...formData, itemDescription: e.target.value})}
                        placeholder="Describe the item or service in detail..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Quantity</label>
                      <input 
                        required
                        type="number"
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-all"
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-400">Item Price</label>
                      <div className="flex gap-2">
                        <input 
                          required
                          type="number"
                          className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-all"
                          value={formData.itemPrice}
                          onChange={e => setFormData({...formData, itemPrice: e.target.value})}
                          placeholder="0.00"
                        />
                        <select 
                          className="bg-black border border-white/10 rounded-xl px-2 py-3 focus:border-white outline-none transition-all text-sm"
                          value={formData.currency}
                          onChange={e => setFormData({...formData, currency: e.target.value})}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-medium text-gray-400">Optional Notes</label>
                      <input 
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-all"
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                        placeholder="Any additional details..."
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Create Transaction'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-zinc-900 border border-white/10 p-12 rounded-3xl"
            >
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Transaction Created!</h1>
              <p className="text-gray-400 mb-8">Your transaction has been created successfully. Please share the Transaction ID below with the seller to proceed.</p>
              
              <div className="bg-black border border-white/10 p-6 rounded-2xl flex items-center justify-between gap-4 mb-8">
                <span className="text-2xl font-mono font-bold tracking-wider">{txId}</span>
                <button 
                  onClick={copyToClipboard}
                  className="p-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-all"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <div className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                Instruct the seller to visit Vercel Escrow and click "Accept Payment" using this ID to secure the funds.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default CreateTransaction;
