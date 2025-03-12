
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserType } from '../types/types';
import { UserCard } from './UserCard';

interface NearbyUsersProps {
  users: UserType[];
  distances: Record<string, number>;
  onUserSelect: (userId: string) => void;
  selectedUsers: string[];
  visibleMode: boolean;
}

export const NearbyUsers: React.FC<NearbyUsersProps> = ({
  users,
  distances,
  onUserSelect,
  selectedUsers,
  visibleMode
}) => {
  // Only show users who are within 10 meters
  const nearbyUsers = users.filter(user => (distances[user.id] || Infinity) <= 10);
  
  if (nearbyUsers.length === 0) {
    return (
      <motion.div
        className="text-center py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-muted-foreground">No hay nadie cerca</p>
        <p className="text-sm text-muted-foreground mt-2">
          Muévese para encontrar personas
        </p>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-4 mt-4">
      <motion.h2 
        className="text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {nearbyUsers.length} {nearbyUsers.length === 1 ? 'persona' : 'personas'} cerca
      </motion.h2>
      
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence>
          {nearbyUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              distance={distances[user.id] || 0}
              onSelect={onUserSelect}
              selected={selectedUsers.includes(user.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NearbyUsers;
