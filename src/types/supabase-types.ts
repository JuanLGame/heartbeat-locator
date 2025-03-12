
import { Database } from '../integrations/supabase/types';

// This file serves as a bridge between our application types and the Supabase database types
// We define our own interfaces that map to the database schema without modifying the generated types

// Define the mapped types from our application to the database
export interface DatabaseUser {
  id: string;
  name: string | null;
  username: string | null;
  profile_picture: string | null;
  visible_mode: boolean;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  vibrate_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUserLocation {
  user_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

export interface DatabaseNotification {
  id: string;
  type: string;
  message: string;
  from_user_id: string | null;
  to_user_id: string;
  read: boolean;
  created_at: string;
}

export interface DatabaseAlarmTrigger {
  id: string;
  from_user_id: string;
  to_user_id: string;
  triggered_at: string;
}

// Type guards to ensure database responses match our expected types
export function isDbUser(obj: any): obj is DatabaseUser {
  return obj && typeof obj.id === 'string';
}

export function isDbNotification(obj: any): obj is DatabaseNotification {
  return obj && typeof obj.id === 'string' && typeof obj.message === 'string';
}
