
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
      toast.error('La geolocalización no está disponible en este dispositivo');
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
          toast.error('Por favor permita el acceso a su ubicación para usar esta aplicación');
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error('La información de ubicación no está disponible');
          break;
        case error.TIMEOUT:
          toast.error('Se agotó el tiempo de espera al obtener la ubicación');
          break;
        default:
          toast.error('Ocurrió un error desconocido al obtener la ubicación');
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
