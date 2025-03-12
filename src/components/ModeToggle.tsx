
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface ModeToggleProps {
  visibleMode: boolean;
  onToggle: () => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ visibleMode, onToggle }) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <span className="text-sm text-muted-foreground font-medium">
        Modo {visibleMode ? 'Visible' : 'Oculto'}
      </span>
      
      <motion.button
        className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 transition-all"
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
      >
        <motion.div
          initial={false}
          animate={{ x: visibleMode ? 0 : 32 }}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Eye className={`size-5 transition-opacity ${visibleMode ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <EyeOff className={`size-5 transition-opacity ${!visibleMode ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          <div className="size-5 opacity-0">
            <Eye />
          </div>
        </motion.div>
        <span>{visibleMode ? 'Visible' : 'Oculto'}</span>
      </motion.button>
    </div>
  );
};

export default ModeToggle;
