"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { loadGoogleMaps, getCurrentLocation, reverseGeocode, getPlacePredictions, getPlaceDetails } from "@/lib/google-maps";
import { LocationService } from "@/services/location.service";
import { PermissionService } from "@/services/permission.service";
import { toast } from "sonner";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";

interface LocationMapProps {
    onLocationChange: (location: {
        lat: number;
        lng: number;
        address?: {
            formatted_address: string;
            street?: string;
            city?: string;
            state?: string;
            pincode?: string;
            country?: string;
        };
        isWithin5km?: boolean;
        branchCode?: string;
    }) => void;
    initialLocation?: { lat: number; lng: number };
    height?: string;
}

const LOCATION_PERMISSION_DISMISSED_KEY = 'location_permission_dismissed';

export default function LocationMap({
    onLocationChange,
    initialLocation,
    height = "400px",
}: LocationMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(
        initialLocation || null
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [predictions, setPredictions] = useState<{ description: string; place_id: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mapType, setMapType] = useState<string>("roadmap");
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isUpdatingRef = useRef(false);
    const toastShownRef = useRef(false);

    // Update address from coordinates
    const updateAddressFromCoordinates = useCallback(async (lat: number, lng: number) => {
        // Prevent concurrent calls
        if (isUpdatingRef.current) {
            return;
        }

        isUpdatingRef.current = true;
        try {
            const locationData = await reverseGeocode(lat, lng);

            // Extract address components
            const components = locationData.address_components;
            let streetNumber = "";
            let route = "";
            let street = "";
            let city = "";
            let state = "";
            let pincode = "";
            let country = "";

            // First pass: Extract city with priority (locality > sublocality_level_1 > administrative_area_level_3)
            // Always prioritize locality first, then fall back to sublocality_level_1 if locality not found
            for (const component of components) {
                const types = component.types;
                if (types.includes("locality")) {
                    // Prefer "locality" as it's the most specific city name (e.g., "Bengaluru", "Thiruvail")
                    city = component.long_name;
                    break; // Found the city, stop looking
                }
            }

            // If locality not found, try sublocality_level_1 (e.g., "Vamanjoor")
            if (!city) {
                for (const component of components) {
                    const types = component.types;
                    if (types.includes("sublocality_level_1") && !types.includes("sublocality_level_2") && !types.includes("sublocality_level_3")) {
                        city = component.long_name;
                        break;
                    }
                }
            }

            // If still not found, try administrative_area_level_3
            if (!city) {
                for (const component of components) {
                    const types = component.types;
                    if (types.includes("administrative_area_level_3")) {
                        city = component.long_name;
                        break;
                    }
                }
            }

            // Second pass: Extract other components
            components.forEach((component) => {
                const types = component.types;
                if (types.includes("street_number")) {
                    streetNumber = component.long_name;
                } else if (types.includes("route")) {
                    route = component.long_name;
                } else if (types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                } else if (types.includes("postal_code")) {
                    pincode = component.long_name;
                } else if (types.includes("country")) {
                    country = component.long_name;
                }
            });

            // Combine street number and route
            street = [streetNumber, route].filter(Boolean).join(" ") || locationData.formatted_address;

            // If city still not found, try to extract from formatted_address
            // This is a fallback for cases where Google Maps doesn't return city in components
            // Format examples:
            // "851, 8th - Cross Rd, Koramangala 8th Block, Koramangala, Bengaluru, Karnataka 560095, India"
            // "Bengaluru, Karnataka, India"
            if (!city && locationData.formatted_address) {
                const addressParts = locationData.formatted_address.split(',').map(p => p.trim());
                // Look for the city - it's usually before the state
                // State typically contains "Karnataka", "Maharashtra", etc. or state codes like "KA", "MH"
                for (let i = 0; i < addressParts.length; i++) {
                    const part = addressParts[i];
                    // Check if this part contains state name or code
                    if (part && /(Karnataka|Maharashtra|Delhi|Tamil Nadu|KA|MH|DL|TN)/i.test(part)) {
                        // City is likely the previous part
                        if (i > 0) {
                            city = addressParts[i - 1];
                            // Remove pincode if it's in the same part (e.g., "Karnataka 560095")
                            const statePart = part.split(/\s+/);
                            if (statePart.length > 1 && /^\d+$/.test(statePart[statePart.length - 1])) {
                                // Pincode is in state part, city is correct
                            }
                        }
                        break;
                    }
                }
                // If still not found, try second-to-last part (before country)
                if (!city && addressParts.length >= 2) {
                    city = addressParts[addressParts.length - 2];
                }
            }

            // Check nearest branch and delivery availability
            let isWithin5km = true;
            let branchCode = "HO";
            try {
                const branchInfo = await LocationService.findNearestBranch(lat, lng);
                isWithin5km = branchInfo.isWithin5km;
                branchCode = branchInfo.branchCode;
            } catch (error) {
                console.error("Failed to check nearest branch:", error);
                // Default to false if API fails to be safe
                isWithin5km = false;
            }

            onLocationChange({
                lat,
                lng,
                address: {
                    formatted_address: locationData.formatted_address,
                    street: street || locationData.formatted_address,
                    city,
                    state,
                    pincode,
                    country,
                },
                isWithin5km,
                branchCode,
            });
        } catch (error) {
            console.error("Reverse geocode error:", error);
            // Still update location even if reverse geocode fails, but check branch
            let isWithin5km = false;
            let branchCode = "HO";
            try {
                const branchInfo = await LocationService.findNearestBranch(lat, lng);
                isWithin5km = branchInfo.isWithin5km;
                branchCode = branchInfo.branchCode;
            } catch (branchError) {
                console.error("Failed to check nearest branch:", branchError);
            }
            onLocationChange({ lat, lng, isWithin5km, branchCode });
        } finally {
            isUpdatingRef.current = false;
        }
    }, [onLocationChange]);

    // Handle search input
    const handleSearch = useCallback(async (value: string) => {
        setSearchQuery(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (value.trim().length < 3) {
            setIsSearching(false);
            setPredictions([]);
            return;
        }

        setIsSearching(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const results = await getPlacePredictions(value);
                setPredictions(results.map(r => ({
                    description: r.description,
                    place_id: r.place_id
                })));
            } catch (error: any) {
                console.error("Places API error:", error);
                if (error.message?.includes('API key')) {
                    toast.error("Google Maps not configured", {
                        description: "Please contact support"
                    });
                } else {
                    toast.error("Failed to search locations");
                }
                setPredictions([]);
            } finally {
                setIsSearching(false);
            }
        }, 500); // Debounce 500ms
    }, []);

    // Handle location selection from search
    const handleSelectLocation = useCallback(async (placeId: string, description: string) => {
        try {
            const place = await getPlaceDetails(placeId);
            const location = place.geometry?.location;

            if (location && mapInstanceRef.current && markerRef.current) {
                const lat = location.lat();
                const lng = location.lng();

                // Update map center and marker
                mapInstanceRef.current.setCenter({ lat, lng });
                mapInstanceRef.current.setZoom(15);
                markerRef.current.setPosition({ lat, lng });
                setCurrentLocation({ lat, lng });

                // Clear search
                setSearchQuery("");
                setPredictions([]);

                // Update address from coordinates
                await updateAddressFromCoordinates(lat, lng);

                toast.success("Location selected", {
                    description: description.substring(0, 50) + (description.length > 50 ? "..." : "")
                });
            } else {
                toast.error("Could not fetch location details");
            }
        } catch (error) {
            console.error("Failed to select location:", error);
            toast.error("Failed to process location selection");
        }
    }, [updateAddressFromCoordinates]);

    // Request location permission with Sonner toast
    const requestLocationPermission = useCallback(async (): Promise<GeolocationPosition | null> => {
        // Prevent duplicate toasts in the same render cycle
        if (toastShownRef.current) {
            return null;
        }

        // Check permission state using PermissionService (doesn't trigger browser prompt)
        const permissionState = await PermissionService.getLocationPermissionState();

        // If permission is already granted, get location silently (no prompt)
        if (permissionState === 'granted') {
            toastShownRef.current = true;
            try {
                const position = await getCurrentLocation();
                setHasLocationPermission(true);
                return position;
            } catch {
                // If getting location fails even with permission, don't show toast
                return null;
            }
        }

        // If permission is denied, don't show toast
        if (permissionState === 'denied') {
            toastShownRef.current = true;
            return null;
        }

        // Check if toast was previously dismissed
        const wasDismissed = localStorage.getItem(LOCATION_PERMISSION_DISMISSED_KEY);
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        let dismissedTimestamp = 0;

        if (wasDismissed) {
            try {
                const parsed = JSON.parse(wasDismissed);
                dismissedTimestamp = parsed.timestamp || 0;
            } catch {
                // Legacy format
            }
        }

        const canShowAgain = !wasDismissed || dismissedTimestamp < sevenDaysAgo;

        // If dismissed recently, don't try to get location (would trigger prompt)
        // Just return null - user can manually set location on map
        if (!canShowAgain) {
            toastShownRef.current = true;
            return null;
        }

        // Show toast FIRST (don't trigger browser prompt yet)
        toastShownRef.current = true;
        return new Promise((resolve) => {
            // Show toast quickly (500ms delay)
            setTimeout(() => {
                toast('Enable Location Access', {
                    id: 'location-permission-prompt',
                    description: 'We need your location to show your position on the map and help you set your delivery address accurately.',
                    duration: Infinity,
                    action: {
                        label: 'Allow',
                        onClick: async () => {
                            // Only NOW trigger the browser's permission prompt when user clicks "Allow"
                            // Use getCurrentLocation directly - it will trigger the browser prompt
                            try {
                                const position = await getCurrentLocation();
                                setHasLocationPermission(true);
                                resolve(position);
                            } catch (error: any) {
                                if (error.code === 1) {
                                    // PERMISSION_DENIED
                                    localStorage.setItem(LOCATION_PERMISSION_DISMISSED_KEY, JSON.stringify({
                                        dismissed: true,
                                        timestamp: Date.now()
                                    }));
                                    toast.error("Location permission denied", {
                                        description: "Please enable location access in your browser settings.",
                                    });
                                } else {
                                    toast.error("Failed to get location", {
                                        description: error.message || "Please try again.",
                                    });
                                }
                                resolve(null);
                            }
                        },
                    },
                    cancel: {
                        label: 'Maybe Later',
                        onClick: () => {
                            localStorage.setItem(LOCATION_PERMISSION_DISMISSED_KEY, JSON.stringify({
                                dismissed: true,
                                timestamp: Date.now()
                            }));
                            resolve(null);
                        },
                    },
                });
            }, 500); // Show toast after 500ms
        });
    }, []);

    // Initialize map
    useEffect(() => {
        let isMounted = true;
        let mapListeners: google.maps.MapsEventListener[] = [];

        const initMap = async () => {
            if (!mapRef.current || !isMounted) return;

            try {
                const google = await loadGoogleMaps();
                if (!isMounted || !mapRef.current) return;

                // Default center (Bengaluru, India)
                const defaultCenter = { lat: 12.9716, lng: 77.5946 };
                let center = initialLocation || defaultCenter;

                // Create map
                const map = new google.maps.Map(mapRef.current, {
                    center,
                    zoom: 15,
                    mapTypeId: mapType as google.maps.MapTypeId,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                });

                if (!isMounted) return;

                mapInstanceRef.current = map;

                // Update map type when it changes
                const mapTypeChangedListener = map.addListener("maptypeid_changed", () => {
                    if (map.getMapTypeId()) {
                        setMapType(map.getMapTypeId() as string);
                    }
                });
                mapListeners.push(mapTypeChangedListener);

                // Create marker (pin) at center with pin pointer icon
                const pinPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
                const marker = new google.maps.Marker({
                    position: center,
                    map,
                    draggable: false, // Pin stays fixed, map moves
                    animation: google.maps.Animation.DROP,
                    icon: {
                        path: pinPath,
                        fillColor: "#F97316", // Tango color
                        fillOpacity: 1,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2,
                        scale: 1.2,
                        anchor: new google.maps.Point(12, 22), // Anchor at bottom center of pin
                    },
                });

                markerRef.current = marker;

                // Update marker position when map is dragged (don't call API here, wait for idle)
                const dragendListener = map.addListener("dragend", () => {
                    if (!isMounted) return;
                    const newCenter = map.getCenter();
                    if (newCenter && marker) {
                        const lat = newCenter.lat();
                        const lng = newCenter.lng();
                        marker.setPosition({ lat, lng });
                        setCurrentLocation({ lat, lng });
                        // Don't call updateAddressFromCoordinates here - let idle event handle it
                    }
                });
                mapListeners.push(dragendListener);

                // Update marker position when map is moved (center changed)
                const centerChangedListener = map.addListener("center_changed", () => {
                    if (!isMounted) return;
                    const newCenter = map.getCenter();
                    if (newCenter && marker) {
                        const lat = newCenter.lat();
                        const lng = newCenter.lng();
                        marker.setPosition({ lat, lng });
                        setCurrentLocation({ lat, lng });
                    }
                });
                mapListeners.push(centerChangedListener);

                // Update address when map is idle (after dragging stops) - debounced
                const idleListener = map.addListener("idle", () => {
                    if (!isMounted) return;
                    const center = map.getCenter();
                    if (center) {
                        // Clear any pending update
                        if (updateTimeoutRef.current) {
                            clearTimeout(updateTimeoutRef.current);
                        }
                        // Debounce the API call
                        updateTimeoutRef.current = setTimeout(() => {
                            if (isMounted && center) {
                                updateAddressFromCoordinates(center.lat(), center.lng());
                            }
                        }, 300); // 300ms debounce
                    }
                });
                mapListeners.push(idleListener);

                setIsLoading(false);

                // Try to get user's current location first (non-blocking)
                // If permission is granted, use user's location; otherwise use default/initial center
                requestLocationPermission().then(async (position) => {
                    if (position && isMounted && mapInstanceRef.current) {
                        const newCenter = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        setCurrentLocation(newCenter);
                        mapInstanceRef.current.setCenter(newCenter);
                        if (markerRef.current) {
                            markerRef.current.setPosition(newCenter);
                        }
                        // Small delay to ensure map and form are fully ready before updating address
                        // This prevents race conditions on page refresh
                        await new Promise(resolve => setTimeout(resolve, 100));
                        if (isMounted) {
                            await updateAddressFromCoordinates(newCenter.lat, newCenter.lng);
                        }
                    } else {
                        // No permission or failed to get location - use default/initial center
                        if (center && isMounted) {
                            await new Promise(resolve => setTimeout(resolve, 100));
                            if (isMounted) {
                                await updateAddressFromCoordinates(center.lat, center.lng);
                            }
                        }
                    }
                }).catch(async () => {
                    // Failed to get location - use default/initial center
                    if (center && isMounted) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        if (isMounted) {
                            await updateAddressFromCoordinates(center.lat, center.lng);
                        }
                    }
                });
            } catch (error: any) {
                if (!isMounted) return;
                console.error("Map initialization error:", error);
                toast.error("Failed to load map", {
                    description: error.message || "Please refresh the page.",
                });
                setIsLoading(false);
            }
        };

        initMap();

        return () => {
            isMounted = false;
            toastShownRef.current = false; // Reset toast ref on unmount

            // Clear update timeout
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            // Clean up map listeners first
            mapListeners.forEach(listener => {
                try {
                    if (typeof google !== 'undefined' && google.maps && google.maps.event) {
                        google.maps.event.removeListener(listener);
                    }
                } catch (e) {
                    // Ignore cleanup errors - component may have already unmounted
                }
            });
            mapListeners = [];

            // Clear marker
            if (markerRef.current) {
                try {
                    markerRef.current.setMap(null);
                } catch (e) {
                    // Ignore cleanup errors
                }
            }

            // Clear map instance
            if (mapInstanceRef.current) {
                try {
                    // Clear the map container to prevent React from trying to remove Google Maps' DOM nodes
                    if (mapRef.current) {
                        mapRef.current.innerHTML = '';
                    }
                } catch (e) {
                    // Ignore cleanup errors
                }
            }

            // Clear refs
            markerRef.current = null;
            mapInstanceRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLocation]); // Only re-run if initialLocation changes - callbacks are stable

    return (
        <div className="w-full">
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">
                    Set your location on the map
                </label>
                <p className="text-xs text-gray-500 mt-1">
                    Search for a location or drag the map to adjust your exact location. The pin shows your selected position.
                </p>
            </div>

            {/* Search Input */}
            <div className="mb-4 relative">
                <Image
                    src="/assets/navbar/icons/Search.svg"
                    alt="Search icon"
                    width={20}
                    height={20}
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-10"
                />
                <input
                    type="text"
                    placeholder="Search for area, street name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-base text-midnight placeholder:text-gray-500 focus:border-tango focus:outline-none focus:ring-2 focus:ring-tango/20"
                />

                {/* Search Results Dropdown */}
                {predictions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {predictions.map((prediction) => (
                            <div
                                key={prediction.place_id}
                                className="flex w-full cursor-pointer items-start gap-2 rounded-lg p-3 transition-colors hover:bg-gray-50"
                                onClick={() => handleSelectLocation(prediction.place_id, prediction.description)}
                            >
                                <Image
                                    src="/assets/profile/icons/Location.svg"
                                    alt="Location"
                                    width={20}
                                    height={20}
                                    className="mt-0.5 h-5 w-5 shrink-0"
                                />
                                <div className="flex flex-1 flex-col items-start gap-1">
                                    <p className="w-full text-sm font-medium text-midnight tracking-normal">
                                        {prediction.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="relative w-full rounded-lg border border-gray-300 overflow-hidden" style={{ height }}>
                <div
                    ref={mapRef}
                    style={{ height: '100%', width: '100%' }}
                    suppressHydrationWarning
                />
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <Loader message="Loading map..." />
                    </div>
                )}

                {/* Map Type Toggle Button */}
                {!isLoading && mapInstanceRef.current && (
                    <div className="absolute top-4 right-4 z-20">
                        <Button
                            type="button"
                            variant="neutral"
                            onClick={() => {
                                if (mapInstanceRef.current) {
                                    const newMapType = mapType === "roadmap"
                                        ? "satellite"
                                        : "roadmap";
                                    mapInstanceRef.current.setMapTypeId(newMapType as google.maps.MapTypeId);
                                    setMapType(newMapType);
                                }
                            }}
                            icon={
                                <Image
                                    src="/assets/profile/icons/Location.svg"
                                    alt={mapType === "satellite" ? "Map" : "Satellite"}
                                    width={18}
                                    height={18}
                                    className="h-[18px] w-[18px]"
                                />
                            }
                            iconPosition="left"
                        >
                            {mapType === "satellite" ? "Map" : "Satellite"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

