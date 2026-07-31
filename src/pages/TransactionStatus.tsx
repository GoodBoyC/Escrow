
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, ShieldCheck, Clock, CheckCircle2, XCircle, Lock, ArrowLeft } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { storageService, Transaction } from '../services/storageService';

const TransactionStatus: React.FC = () => {
  const { txId: urlTxId } = useParams();
  const navigate = useNavigate();
  const [txId, setTxId] = useState(urlTxId || '');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStatus = async (id: string) => {
    setLoading(true);
    setError('');
    const tx = await storageService.getTransaction(id);
    if (tx) {
      setTransaction(tx);
    } else {
      setError('Transaction not found. Please check the ID.');
      setTransaction(null);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (urlTxId) {
      fetchStatus(urlTxId);
    }
  }, [urlTxId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (txId) {
      fetchStatus(txId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Waiting for Seller': return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'Payment Pending': return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'Payment Secured': return <Lock className="w-6 h-6 text-blue-500" />;
      case 'Waiting for Buyer Confirmation': return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'Completed': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-6 h-6 text-red-500" />;
      default: return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <PageWrapper>
      <div className="bg-black text-white min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-bold">Track Transaction</h1>
            </div>
            <Link to="/" className="text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
          </div>

          <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl mb-8">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input 
                  className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-white outline-none font-mono"
                  value={txId}
                  onChange={e => setTxId(e.target.value.toUpperCase())}
                  placeholder="Enter Transaction ID (e.g. ESC-XXXXXXX)"
                />
              </div>
              <button 
                disabled={loading}
                className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                {loading ? '...' : 'Search'}
              </button>
            </form>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center mb-8">
              {error}
            </div>
          )}

          {transaction && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                  <div className="text-center md:text-left">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Transaction ID</div>
                    <div className="text-xl font-mono font-bold">{transaction.id}</div>
                  </div>
                  <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-full border border-white/10">
                    {getStatusIcon(transaction.status)}
                    <span className="font-bold text-sm">{transaction.status}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Transaction Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-400">Item</span>
                        <span className="font-medium">{transaction.item.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-400">Price</span>
                        <span className="font-bold">{transaction.item.price} {transaction.item.currency}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-400">Quantity</span>
                        <span className="font-medium">{transaction.item.quantity}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Created</span>
                        <span className="font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Party Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-400">Buyer</span>
                        <span className="font-medium">{transaction.buyer.fullName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-gray-400">Seller</span>
                        <span className="font-medium">{transaction.seller ? `${transaction.seller.firstName} ${transaction.seller.lastName}` : 'Not yet assigned'}</span>
                      </div>
                      {transaction.seller && (
                        <div className="flex justify-between py-2 border-b border-white/5">
                          <span className="text-gray-400">Payment Method</span>
                          <span className="font-medium">{transaction.seller.cardBrand} (****{transaction.seller.cardLast4})</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Last Updated</span>
                        <span className="font-medium">{new Date(transaction.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default TransactionStatus;
