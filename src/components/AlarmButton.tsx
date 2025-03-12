
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface AlarmButtonProps {
  active: boolean;
  onPress: () => void;
}

export const AlarmButton: React.FC<AlarmButtonProps> = ({ active, onPress }) => {
  const [isPressing, setIsPressing] = useState(false);
  
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="pulse-button"
        whileTap={{ scale: 0.95 }}
        onTapStart={() => setIsPressing(true)}
        onTap={() => {
          setIsPressing(false);
          onPress();
        }}
        onTapCancel={() => setIsPressing(false)}
      >
        <AnimatePresence>
          {active && (
            <motion.div
              className="absolute inset-0 bg-alarm/20 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.5, 0.7] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            />
          )}
        </AnimatePresence>
        
        <motion.button
          className={`
            size-32 rounded-full flex items-center justify-center shadow-lg
            ${active 
              ? 'bg-alarm text-white' 
              : 'bg-white text-alarm border-2 border-alarm'
            }
          `}
          animate={{
            boxShadow: active 
              ? [
                  '0 0 0 0 rgba(239, 68, 68, 0)',
                  '0 0 0 20px rgba(239, 68, 68, 0.2)',
                  '0 0 0 0 rgba(239, 68, 68, 0)'
                ]
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
          transition={{
            boxShadow: {
              repeat: active ? Infinity : 0,
              duration: 2
            }
          }}
        >
          <Heart
            className={`size-16 transition-transform duration-300 ${isPressing ? 'scale-90' : 'scale-100'}`}
            fill={active ? 'white' : 'transparent'}
            strokeWidth={active ? 0 : 2}
          />
        </motion.button>
      </motion.div>
      
      <motion.p 
        className="mt-6 text-xl font-medium"
        animate={{ 
          color: active ? 'hsl(var(--alarm))' : 'hsl(var(--foreground))'
        }}
      >
        {active ? 'Alarma Activada' : 'Pulse para Activar'}
      </motion.p>
    </div>
  );
};

export default AlarmButton;
