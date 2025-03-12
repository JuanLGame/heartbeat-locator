
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { Notification } from '../types/types';
import { DatabaseNotification, isDbNotification } from '../types/supabase-types';
import { playSound } from '../utils/sound';
import { useAuth } from './useAuth';

export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    
    // Fetch existing notifications
    const fetchNotifications = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('to_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Error al cargar notificaciones');
      } else if (data) {
        // Map database notifications to application notifications
        const appNotifications: Notification[] = data.map((dbNotification: DatabaseNotification) => ({
          id: dbNotification.id,
          type: dbNotification.type as 'alarm' | 'match' | 'system',
          message: dbNotification.message,
          fromUserId: dbNotification.from_user_id || undefined,
          read: dbNotification.read,
          createdAt: new Date(dbNotification.created_at)
        }));
        
        setNotifications(appNotifications);
      }
      
      setLoading(false);
    };
    
    fetchNotifications();
    
    // Subscribe to real-time notifications
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `to_user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new && isDbNotification(payload.new)) {
            const dbNotification = payload.new as DatabaseNotification;
            
            // Convert to application notification type
            const newNotification: Notification = {
              id: dbNotification.id,
              type: dbNotification.type as 'alarm' | 'match' | 'system',
              message: dbNotification.message,
              fromUserId: dbNotification.from_user_id || undefined,
              read: dbNotification.read,
              createdAt: new Date(dbNotification.created_at)
            };
            
            // Update state
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show toast and play sound based on notification type
            switch (newNotification.type) {
              case 'match':
                toast.success('¡Tienes un match!');
                playSound('MATCH');
                break;
              case 'alarm':
                toast.info('Alguien ha activado tu alarma');
                playSound('ALARM');
                break;
              default:
                toast.info(newNotification.message);
                playSound('NOTIFICATION');
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    // Update local state
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    
    return true;
  };
  
  const markAllAsRead = async () => {
    if (!user) return false;
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('to_user_id', user.id)
      .eq('read', false);
    
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    
    // Update local state
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    return true;
  };
  
  return { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead,
    unreadCount: notifications.filter(n => !n.read).length
  };
};

export default useRealTimeNotifications;
