
import { useState, useEffect } from 'react';
import { User } from '../types/types';

// Haversine formula to calculate distance between two points
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'María',
    profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: {
      latitude: 0,
      longitude: 0
    }
  },
  {
    id: '2',
    name: 'Carlos',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: {
      latitude: 0,
      longitude: 0
    }
  },
  {
    id: '3',
    name: 'Ana',
    profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg',
    location: {
      latitude: 0,
      longitude: 0
    }
  },
  {
    id: '4',
    name: 'Jorge',
    location: {
      latitude: 0,
      longitude: 0
    }
  },
  {
    id: '5',
    name: 'Lucía',
    profilePicture: 'https://randomuser.me/api/portraits/women/65.jpg',
    location: {
      latitude: 0,
      longitude: 0
    }
  }
];

interface UseNearbyUsersParams {
  latitude: number | null;
  longitude: number | null;
}

interface UseNearbyUsersResult {
  users: User[];
  distances: Record<string, number>;
  loading: boolean;
}

export function useNearbyUsers({ 
  latitude, 
  longitude 
}: UseNearbyUsersParams): UseNearbyUsersResult {
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (latitude === null || longitude === null) {
      return;
    }
    
    // In a real app, this would fetch users from Supabase with PostGIS
    // For demo, we'll simulate random movements of the mock users
    const timer = setInterval(() => {
      // Update mock user locations to simulate movement
      const updatedDistances: Record<string, number> = {};
      
      mockUsers.forEach(user => {
        if (!user.location) return;
        
        // Randomly update user location (small changes to simulate movement)
        const latOffset = (Math.random() - 0.5) * 0.0001; // Small random change
        const lonOffset = (Math.random() - 0.5) * 0.0001;
        
        user.location.latitude = latitude + latOffset * 20;
        user.location.longitude = longitude + lonOffset * 20;
        
        // Calculate distance
        const distance = calculateDistance(
          latitude,
          longitude,
          user.location.latitude,
          user.location.longitude
        );
        
        updatedDistances[user.id] = distance;
      });
      
      setDistances(updatedDistances);
      setLoading(false);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [latitude, longitude]);
  
  // Filter users by distance for UI display is done in the component
  return { users: mockUsers, distances, loading };
}

export default useNearbyUsers;
