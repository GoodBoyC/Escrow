
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, CheckCircle2, HelpCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';

const Home: React.FC = () => {
  return (
    <PageWrapper>
      <div className="bg-black text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black -z-10 opacity-50"></div>
          <div className="max-w-7xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Secure Escrow Payments <br /> 
                <span className="text-gray-500">For Digital Assets</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                The most trusted way to trade items and services online. We hold the funds securely until both parties are satisfied.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/create" 
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
                >
                  Create Transaction <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/accept" 
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Accept Payment
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-400">A simple, 3-step process to ensure secure transactions.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: "01",
                  title: "Create Transaction",
                  desc: "The buyer sets up the escrow details and specifies the item and price.",
                  icon: <ShieldCheck className="w-8 h-8" />
                },
                {
                  step: "02",
                  title: "Secure Payment",
                  desc: "The seller accepts the transaction and the payment is held in secure escrow.",
                  icon: <Lock className="w-8 h-8" />
                },
                {
                  step: "03",
                  title: "Release Funds",
                  desc: "Once the buyer confirms receipt of the item, funds are released to the seller.",
                  icon: <CheckCircle2 className="w-8 h-8" />
                }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-black border border-white/5 hover:border-white/20 transition-all group">
                  <div className="text-gray-600 text-sm font-bold mb-4">{item.step}</div>
                  <div className="text-white mb-4 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-24 px-4 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Bank-Grade Security <br />For Every Trade</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  We employ industry-standard encryption and strict verification processes to ensure that your funds are safe and that transactions are legitimate.
                </p>
                <ul className="space-y-4">
                  {[
                    "SSL 256-bit Encryption",
                    "Secure Payment Gateway Integration",
                    "Identity Verification Process",
                    "Anti-Fraud Monitoring"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-white" /> {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-black p-1 rounded-3xl">
                <div className="bg-black rounded-[22px] p-8 border border-white/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold">Secure Vault</div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest">Active Protection</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-3/4"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Encryption Level</span>
                      <span>AES-256</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-4 bg-zinc-950">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400">Everything you need to know about using Vercel Escrow.</p>
            </div>
            <div className="space-y-6">
              {[
                {
                  q: "What is Escrow?",
                  a: "Escrow is a legal arrangement where a third party holds funds until specific conditions are met, protecting both buyer and seller."
                },
                {
                  q: "How are the fees calculated?",
                  a: "Vercel Escrow charges a small percentage fee per transaction to ensure the security and maintenance of the platform."
                },
                {
                  q: "What happens if there is a dispute?",
                  a: "In case of a dispute, our mediation team reviews the transaction details and evidence from both parties to reach a fair resolution."
                }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-black border border-white/5">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-gray-500" /> {item.q}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-gray-400 mb-10">Have questions? Contact our 24/7 support team.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:support@vercelescrow.com" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Contact Support
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Home;
