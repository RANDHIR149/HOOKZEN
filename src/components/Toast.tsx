import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ show, message, type = 'success' }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-zinc-950/95 border border-zinc-700 rounded-xl shadow-2xl backdrop-blur-xl text-xs font-semibold text-white ring-1 ring-white/10"
        >
          {type === 'success' && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
          {type === 'error' && <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />}
          {type === 'info' && <Info className="w-4 h-4 text-white shrink-0" />}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
