
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { Notification } from '../types/types';
import { playSound } from '../utils/sound';
import { useAuth } from './useAuth';

// Helper type for database notifications
type DatabaseNotification = {
  id: string;
  type: string;
  message: string;
  from_user_id?: string;
  to_user_id: string;
  read: boolean;
  created_at: string;
};

// Helper function to check if an object is a DatabaseNotification
export const isDbNotification = (obj: any): obj is DatabaseNotification => {
  return obj 
    && typeof obj.id === 'string'
    && typeof obj.type === 'string'
    && typeof obj.message === 'string'
    && typeof obj.to_user_id === 'string'
    && typeof obj.read === 'boolean'
    && typeof obj.created_at === 'string';
};

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
      
      try {
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
      } catch (err) {
        console.error('Error in fetchNotifications:', err);
        toast.error('Error al cargar notificaciones');
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
    try {
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
    } catch (err) {
      console.error('Error in markAsRead:', err);
      return false;
    }
  };
  
  const markAllAsRead = async () => {
    if (!user) return false;
    
    try {
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
    } catch (err) {
      console.error('Error in markAllAsRead:', err);
      return false;
    }
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
