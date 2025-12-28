import { useState, useEffect, useCallback } from 'react';

const LOCATION_STORAGE_KEY = 'startup-kafe-location';

export function useLocation() {
  const [location, setLocation] = useState(() => {
    // Try to get cached location
    const cached = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Check if cache is less than 10 minutes old
        if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
          return {
            address: parsed.address,
            coords: parsed.coords,
            loading: false,
            error: null,
          };
        }
      } catch (e) {
        // Invalid cache
      }
    }
    return {
      address: null,
      coords: null,
      loading: false,
      error: null,
    };
  });

  // Reverse geocoding using free Nominatim API
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      // Build a readable address
      const address = data.address;
      let parts = [];
      
      if (address.road || address.pedestrian) {
        parts.push(address.road || address.pedestrian);
      }
      if (address.neighbourhood || address.suburb) {
        parts.push(address.neighbourhood || address.suburb);
      }
      if (address.city || address.town || address.village) {
        parts.push(address.city || address.town || address.village);
      }
      
      return parts.length > 0 ? parts.join(', ') : data.display_name;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const fetchLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Accept cached position up to 1 minute old
        });
      });

      const { latitude, longitude } = position.coords;
      const coords = { latitude, longitude };
      
      // Get address from coordinates
      const address = await reverseGeocode(latitude, longitude);
      
      const locationData = {
        address: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        coords,
        loading: false,
        error: null,
      };
      
      setLocation(locationData);
      
      // Cache the location
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
        ...locationData,
        timestamp: Date.now(),
      }));
      
    } catch (error) {
      let errorMessage = 'Unable to retrieve your location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. Please enable location access.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          break;
      }
      
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  // Auto-fetch location on mount if no cached location
  useEffect(() => {
    if (!location.address && !location.loading) {
      fetchLocation();
    }
  }, []);

  return {
    ...location,
    refresh: fetchLocation,
  };
}

export default useLocation;
