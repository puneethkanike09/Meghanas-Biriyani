let googleMapsPromise: Promise<typeof google> | null = null;

/**
 * Loads Google Maps JavaScript API
 * Uses direct script injection for better compatibility
 */
export const loadGoogleMaps = async (): Promise<typeof google> => {
    if (googleMapsPromise) {
        return googleMapsPromise;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        throw new Error('Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file');
    }

    googleMapsPromise = new Promise((resolve, reject) => {
        // Check if already loaded
        if (typeof google !== 'undefined' && google.maps) {
            resolve(google);
            return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;

        // Set up callback
        (window as any).initGoogleMaps = () => {
            if (typeof google !== 'undefined' && google.maps) {
                resolve(google);
            } else {
                reject(new Error('Google Maps failed to load'));
            }
        };

        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.head.appendChild(script);
    });

    return googleMapsPromise;
};

/**
 * Get place predictions using Google Places Autocomplete
 * Restricted to India for better results
 */
export const getPlacePredictions = async (input: string): Promise<google.maps.places.AutocompletePrediction[]> => {
    const google = await loadGoogleMaps();
    const service = new google.maps.places.AutocompleteService();

    return new Promise((resolve, reject) => {
        service.getPlacePredictions(
            {
                input,
                componentRestrictions: { country: 'in' },
                types: ['geocode', 'establishment'],
            },
            (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                    resolve(predictions);
                } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                    resolve([]);
                } else {
                    reject(new Error(`Places API error: ${status}`));
                }
            }
        );
    });
};

/**
 * Get current location using browser's Geolocation API
 * Uses high accuracy mode for better precision
 */
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        // Request high accuracy location
        navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
                enableHighAccuracy: true,  // Use GPS if available
                timeout: 15000,             // Wait up to 15 seconds
                maximumAge: 0               // Don't use cached position
            }
        );
    });
};

/**
 * Reverse geocode coordinates to get formatted address
 * Uses result types and component restrictions for accurate results
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<{
    formatted_address: string;
    place_id: string;
    address_components: google.maps.GeocoderAddressComponent[];
}> => {
    const google = await loadGoogleMaps();
    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
        geocoder.geocode(
            {
                location: { lat, lng },
                // Prefer these result types for accurate addresses
                region: 'IN',  // Bias results to India
            },
            (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                    // Find the most specific result (usually the first one)
                    // Prefer results with street_address or premise
                    const preferredResult = results.find(result =>
                        result.types.includes('street_address') ||
                        result.types.includes('premise') ||
                        result.types.includes('sublocality')
                    ) || results[0];

                    resolve({
                        formatted_address: preferredResult.formatted_address,
                        place_id: preferredResult.place_id,
                        address_components: preferredResult.address_components
                    });
                } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                    reject(new Error('No address found for this location'));
                } else {
                    reject(new Error(`Geocoding error: ${status}`));
                }
            }
        );
    });
};

/**
 * Get place details from place ID
 * Useful for getting complete information about a selected place
 */
export const getPlaceDetails = async (placeId: string): Promise<google.maps.places.PlaceResult> => {
    const google = await loadGoogleMaps();

    return new Promise((resolve, reject) => {
        // Create a dummy div for the PlacesService (required by API)
        const div = document.createElement('div');
        const service = new google.maps.places.PlacesService(div);

        service.getDetails(
            {
                placeId,
                fields: ['formatted_address', 'geometry', 'name', 'place_id', 'address_components']
            },
            (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    resolve(place);
                } else {
                    reject(new Error(`Place details error: ${status}`));
                }
            }
        );
    });
};
