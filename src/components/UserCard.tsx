
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { User as UserType } from '../types/types';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

interface UserCardProps {
  user: UserType;
  distance: number;
  selected: boolean;
  onSelect: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  distance, 
  selected,
  onSelect
}) => {
  const { user: currentUser } = useAuth();
  
  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error("Debes iniciar sesión para expresar sentimientos");
      return;
    }
    
    try {
      // Call the trigger-alarm edge function
      const { data, error } = await supabase.functions.invoke('trigger-alarm', {
        body: {
          fromUserId: currentUser.id,
          toUserId: user.id
        }
      });
      
      if (error) {
        console.error("Error triggering alarm:", error);
        toast.error("Error al expresar sentimiento");
        return;
      }
      
      onSelect(user.id);
      
      if (data?.isMatch) {
        toast.success(`¡Match con ${user.name}!`, {
          duration: 5000,
          icon: "💕"
        });
      } else {
        toast.success(`Has expresado tu sentimiento hacia ${user.name}`, {
          icon: "❤️"
        });
      }
    } catch (err) {
      console.error("Failed to trigger alarm:", err);
      toast.error("Error al expresar sentimiento");
    }
  };
  
  return (
    <motion.div
      className={`
        glass-panel rounded-xl p-4 card-hover relative
        ${selected ? 'border-alarm border-2' : 'border border-white/20 dark:border-black/20'}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
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
        
        <motion.button
          className={`
            size-10 rounded-full flex items-center justify-center 
            ${selected ? 'bg-alarm text-white' : 'bg-secondary/50 text-muted-foreground'}
          `}
          whileTap={{ scale: 0.9 }}
          onClick={handleHeartClick}
        >
          <Heart 
            className="size-5" 
            fill={selected ? "currentColor" : "none"} 
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UserCard;
