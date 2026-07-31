
import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC<{ duration?: number }> = ({ duration = 5000 }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-20 h-20">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="absolute inset-0 border-4 border-gray-800 border-t-white rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold tracking-widest uppercase">Vercel</span>
          </div>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-sm font-light tracking-widest uppercase text-gray-400"
        >
          Securing Connection
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
