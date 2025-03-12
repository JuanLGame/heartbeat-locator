import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Layout from '../components/Layout';
import AlarmButton from '../components/AlarmButton';
import ModeToggle from '../components/ModeToggle';
import NearbyUsers from '../components/NearbyUsers';
import useGeolocation from '../hooks/useGeolocation';
import useNearbyUsers from '../hooks/useNearbyUsers';
import { notifyAlarmTriggered, requestNotificationPermission } from '../utils/notifications';

const Index = () => {
  // State
  const [alarmActive, setAlarmActive] = useState(false);
  const [visibleMode, setVisibleMode] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<string[]>([]);
  
  // Hooks
  const { position, loading: locationLoading } = useGeolocation();
  const { users, distances, loading: usersLoading } = useNearbyUsers({
    latitude: position?.latitude || null,
    longitude: position?.longitude || null,
  });
  
  // Request notification permission on first load
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  
  // Handle alarm toggle
  const handleAlarmToggle = () => {
    // Toggle alarm state
    setAlarmActive(!alarmActive);
    
    if (!alarmActive) {
      toast.success('Love Alarm activada');
    } else {
      toast.info('Love Alarm desactivada');
      // Clear selected users when turning off alarm
      setSelectedUsers([]);
    }
  };
  
  // Handle mode toggle
  const handleModeToggle = () => {
    setVisibleMode(!visibleMode);
    toast.info(`Modo ${!visibleMode ? 'visible' : 'oculto'} activado`);
  };
  
  // Handle user selection
  const handleUserSelect = (userId: string) => {
    if (!alarmActive) {
      toast.error('Activa tu Love Alarm primero');
      return;
    }
    
    setSelectedUsers(prev => {
      // If user is already selected, remove them
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }
      // Otherwise add them
      return [...prev, userId];
    });
    
    // Simulate the other user also selecting current user (50% chance)
    const otherUserSelectsBack = Math.random() > 0.5;
    
    if (otherUserSelectsBack) {
      // Add to matched users with a delay to simulate processing
      setTimeout(() => {
        const selectedUser = users.find(u => u.id === userId);
        if (selectedUser) {
          setMatchedUsers(prev => [...prev, userId]);
          notifyAlarmTriggered(selectedUser.name, true);
        }
      }, 1500);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-10">
        <motion.div 
          className="flex flex-col items-center justify-center py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AlarmButton active={alarmActive} onPress={handleAlarmToggle} />
        </motion.div>
        
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ModeToggle visibleMode={visibleMode} onToggle={handleModeToggle} />
        </motion.div>
        
        <AnimatePresence>
          {locationLoading || usersLoading ? (
            <motion.div 
              className="flex justify-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                <div className="h-4 w-4 bg-primary rounded-full animate-pulse"></div>
                <p>Buscando personas cerca...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <NearbyUsers 
                users={users}
                distances={distances}
                onUserSelect={handleUserSelect}
                selectedUsers={selectedUsers}
                visibleMode={visibleMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Index;
