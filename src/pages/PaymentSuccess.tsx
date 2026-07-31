
import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Lock, ArrowLeft } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const PaymentSuccess: React.FC = () => {
  const { txId } = useParams();

  const steps = [
    { title: "Transaction Created", status: "done" },
    { title: "Payment Secured", status: "done" },
    { title: "Waiting for Buyer Confirmation", status: "pending" },
    { title: "Funds Held in Escrow", status: "locked" },
  ];

  return (
    <PageWrapper>
      <div className="bg-black text-white min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 p-12 rounded-3xl"
          >
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Payment Secured</h1>
            <p className="text-gray-400 mb-12">
              Your payment has been securely placed into escrow. The seller will receive the funds only after the buyer confirms that the item or service has been received and accepted.
            </p>

            <div className="max-w-md mx-auto text-left space-y-6 mb-12">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1">
                    {step.status === 'done' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {step.status === 'pending' && <Clock className="w-5 h-5 text-yellow-500" />}
                    {step.status === 'locked' && <Lock className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${step.status === 'pending' ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                    {step.status === 'pending' && (
                      <div className="text-xs text-gray-500">Current Step</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={`/status/${txId}`}
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                Track Transaction
              </Link>
              <Link 
                to="/"
                className="px-8 py-4 bg-transparent border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentSuccess;
