
export interface User {
  id: string;
  name: string;
  profilePicture?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  lastUpdated?: Date;
}

export interface Notification {
  id: string;
  type: 'alarm' | 'match' | 'system';
  message: string;
  fromUserId?: string;
  read: boolean;
  createdAt: Date;
}

export interface UserPreferences {
  visibleMode: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
}
