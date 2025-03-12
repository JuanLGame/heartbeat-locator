
import { useState, useEffect } from 'react';
import { User } from '../types/types';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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

interface UseNearbyUsersParams {
  latitude: number | null;
  longitude: number | null;
}

interface UseNearbyUsersResult {
  users: User[];
  distances: Record<string, number>;
  loading: boolean;
  error: Error | null;
  updateUserLocation: (lat: number, lng: number) => Promise<void>;
}

export function useNearbyUsers({ 
  latitude, 
  longitude 
}: UseNearbyUsersParams): UseNearbyUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  // Update user's location in the database
  const updateUserLocation = async (lat: number, lng: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.functions.invoke(
        'update-location',
        {
          body: {
            userId: user.id,
            latitude: lat,
            longitude: lng
          }
        }
      );
      
      if (error) {
        console.error('Error updating location:', error);
        throw new Error('Failed to update location');
      }
    } catch (err) {
      console.error('Failed to invoke function:', err);
      toast.error('Error al actualizar ubicación');
    }
  };
  
  // Fetch nearby users
  useEffect(() => {
    if (!user || latitude === null || longitude === null) {
      setLoading(false);
      return;
    }
    
    const fetchNearbyUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First update user's location
        await updateUserLocation(latitude, longitude);
        
        // Then fetch nearby users
        const { data, error } = await supabase.functions.invoke(
          'get-nearby-users',
          {
            body: {
              userId: user.id,
              latitude,
              longitude,
              maxDistance: 10 // 10 meters
            }
          }
        );
        
        if (error) {
          console.error('Error fetching nearby users:', error);
          setError(new Error('Failed to fetch nearby users'));
          return;
        }
        
        // Process users and calculate distances
        if (data && Array.isArray(data)) {
          setUsers(data as User[]);
          
          // Calculate distances
          const newDistances: Record<string, number> = {};
          data.forEach((nearbyUser: any) => {
            if (nearbyUser.location && nearbyUser.location.latitude && nearbyUser.location.longitude) {
              newDistances[nearbyUser.id] = calculateDistance(
                latitude,
                longitude,
                nearbyUser.location.latitude,
                nearbyUser.location.longitude
              );
            }
          });
          
          setDistances(newDistances);
        }
      } catch (err) {
        console.error('Error in nearby users hook:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchNearbyUsers();
    
    // Set up an interval to periodically update
    const intervalId = setInterval(() => {
      fetchNearbyUsers();
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [user, latitude, longitude]);
  
  return { users, distances, loading, error, updateUserLocation };
}

export default useNearbyUsers;
