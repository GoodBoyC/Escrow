
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <ShieldCheck className="w-6 h-6" />
            <span>VERCEL ESCROW</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="hover:text-gray-400 transition-colors">Home</Link>
            <Link to="/create" className="hover:text-gray-400 transition-colors">Create Transaction</Link>
            <Link to="/accept" className="hover:text-gray-400 transition-colors">Accept Payment</Link>
            <Link to="/status" className="hover:text-gray-400 transition-colors">Track Status</Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10 px-4 py-4 flex flex-col gap-4 text-center">
          <Link to="/" onClick={() => setIsOpen(false)} className="py-2 hover:text-gray-400">Home</Link>
          <Link to="/create" onClick={() => setIsOpen(false)} className="py-2 hover:text-gray-400">Create Transaction</Link>
          <Link to="/accept" onClick={() => setIsOpen(false)} className="py-2 hover:text-gray-400">Accept Payment</Link>
          <Link to="/status" onClick={() => setIsOpen(false)} className="py-2 hover:text-gray-400">Track Status</Link>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter mb-4">
              <ShieldCheck className="w-6 h-6" />
              <span>VERCEL ESCROW</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The gold standard in secure digital transactions. Ensuring trust and security for every exchange.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Company</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Support</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Vercel Escrow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export { Navbar, Footer };
