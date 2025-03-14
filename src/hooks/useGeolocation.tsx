
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
}

interface LocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface UseGeolocationResult {
  position: LocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
}

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<LocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not available on this device');
      setLoading(false);
      return;
    }

    // Success handler
    const handleSuccess = (position: GeolocationPosition) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
      setError(null);
      setLoading(false);
    };

    // Error handler
    const handleError = (error: GeolocationPositionError) => {
      setError(error);
      setLoading(false);
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          toast.error('Please allow access to your location to use this application');
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error('Location information is unavailable');
          break;
        case error.TIMEOUT:
          toast.error('Location request timed out');
          break;
        default:
          toast.error('An unknown error occurred while getting location');
          break;
      }
    };

    // Options for higher accuracy
    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    );

    // Set up watch position for real-time updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // Cleanup
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { position, error, loading };
}

export default useGeolocation;
