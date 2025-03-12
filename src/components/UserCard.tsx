
import React from 'react';
import { motion } from 'framer-motion';
import { User as UserType } from '../types/types';

interface UserCardProps {
  user: UserType;
  distance: number;
  onSelect: (userId: string) => void;
  selected: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  distance, 
  onSelect,
  selected
}) => {
  return (
    <motion.div
      className={`
        glass-panel rounded-xl p-4 card-hover
        ${selected ? 'border-alarm border-2' : 'border border-white/20 dark:border-black/20'}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(user.id)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`size-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden ${selected ? 'ring-2 ring-alarm' : ''}`}>
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {user.name.charAt(0)}
              </span>
            )}
          </div>
          {selected && (
            <motion.div
              className="absolute -top-1 -right-1 size-4 bg-alarm rounded-full border-2 border-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{user.name}</h3>
          <p className="text-xs text-muted-foreground">
            a {distance < 1 ? '<1m' : `${Math.round(distance)}m`}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
