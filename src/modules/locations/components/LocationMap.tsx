import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useState, useRef } from "react";
import { Search, Navigation, MapPin, AlertCircle, Loader2 } from "lucide-react";

const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

const containerStyle = {
    width: "100%",
    height: "400px",
    minHeight: "400px",
};

const defaultCenter = {
    lat: 24.7136,
    lng: 46.6753, // Riyadh
};

interface SuggestionItem {
    id: string;
    mainText: string;
    secondaryText: string;
    fullText: string;
    placePrediction?: any;
    placeId?: string;
    location?: { lat: number; lng: number };
}

interface LocationMapProps {
    onLocationSelect: (lat: number, lng: number, address?: string, metadata?: { countryCode?: string, stateCode?: string, stateName?: string, cityName?: string }) => void;
    selectedLocation: { lat: number; lng: number } | null;
    countryCode?: string;
    stateCode?: string;
    cityName?: string;
}

export default function LocationMap({ onLocationSelect, selectedLocation, countryCode, stateCode, cityName }: LocationMapProps) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [searchError, setSearchError] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Track internal updates so dropdown changes outside don't override clicked pin
    const isInternalUpdate = useRef(false);
    const prevLocationFilter = useRef("");

    // Synchronize map center when selectedLocation updates
    useEffect(() => {
        if (map && selectedLocation) {
            map.panTo(selectedLocation);
        }
    }, [map, selectedLocation?.lat, selectedLocation?.lng]);

    // Pan map when country/state/city is manually selected from the dropdowns outside the map
    useEffect(() => {
        const currentFilter = `${countryCode || ""}_${stateCode || ""}_${cityName || ""}`;
        
        if (prevLocationFilter.current !== currentFilter) {
            prevLocationFilter.current = currentFilter;

            if (isInternalUpdate.current) {
                isInternalUpdate.current = false;
                return;
            }

            if (isLoaded && map && (countryCode || stateCode || cityName)) {
                const geocoder = new google.maps.Geocoder();
                const address = [cityName, stateCode, countryCode].filter(Boolean).join(", ");

                geocoder.geocode({ address }, (results, status) => {
                    if (status === "OK" && results && results[0]) {
                        const { lat, lng } = results[0].geometry.location.toJSON();
                        map.panTo({ lat, lng });
                        map.setZoom(12);
                    }
                });
            }
        }
    }, [isLoaded, map, countryCode, stateCode, cityName]);

    // Close suggestions dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const extractMetadata = (components: google.maps.GeocoderAddressComponent[] | any[]) => {
        let extractedCountryCode = "";
        let extractedStateCode = "";
        let extractedStateName = "";
        let extractedCityName = "";

        components.forEach(component => {
            const types: string[] = component.types || [];
            if (types.includes("country")) {
                extractedCountryCode = component.short_name || component.shortText || "";
            }
            if (types.includes("administrative_area_level_1")) {
                extractedStateCode = component.short_name || component.shortText || "";
                extractedStateName = component.long_name || component.longText || "";
            }
            if (types.includes("locality") || types.includes("sublocality") || types.includes("city")) {
                extractedCityName = component.long_name || component.longText || "";
            }
        });

        return {
            countryCode: extractedCountryCode,
            stateCode: extractedStateCode,
            stateName: extractedStateName,
            cityName: extractedCityName
        };
    };

    const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
        setMap(mapInstance);
        setTimeout(() => {
            google.maps.event.trigger(mapInstance, "resize");
            if (selectedLocation) {
                mapInstance.panTo(selectedLocation);
            }
        }, 150);
    }, [selectedLocation]);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    const fallbackGeocodeSearch = (query: string) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: query }, (results, status) => {
            setIsSearching(false);
            if (status === "OK" && results && results.length > 0) {
                const items: SuggestionItem[] = results.slice(0, 5).map((r, i) => {
                    const parts = r.formatted_address.split(",");
                    const mainText = parts[0]?.trim() || r.formatted_address;
                    const secondaryText = parts.slice(1).join(",").trim();
                    return {
                        id: r.place_id || `geo_${i}`,
                        mainText,
                        secondaryText,
                        fullText: r.formatted_address,
                        location: {
                            lat: r.geometry.location.lat(),
                            lng: r.geometry.location.lng(),
                        },
                    };
                });
                setSuggestions(items);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        });
    };

    // Live search predictions (Places API New AutocompleteSuggestion with Geocoder fallback)
    const fetchPredictions = async (query: string) => {
        if (!query.trim() || !window.google?.maps) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsSearching(true);
        const fullQuery = countryCode && !query.toLowerCase().includes(countryCode.toLowerCase())
            ? `${query}, ${countryCode}`
            : query;

        // 1. Try modern Places API (New) AutocompleteSuggestion
        const placesLib = (window.google.maps as any).places;
        if (placesLib?.AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
            try {
                const request: any = {
                    input: query,
                    ...(countryCode ? { includedRegionCodes: [countryCode.toLowerCase()] } : {}),
                };
                const response = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
                const rawSuggestions = response?.suggestions || [];

                if (rawSuggestions.length > 0) {
                    setIsSearching(false);
                    const items: SuggestionItem[] = rawSuggestions.map((s: any, idx: number) => {
                        const pred = s.placePrediction;
                        const fullText = pred?.text?.toString() || pred?.description || "";
                        const mainText = pred?.mainText?.toString() || fullText.split(",")[0] || "";
                        const secondaryText = pred?.secondaryText?.toString() || fullText.split(",").slice(1).join(",") || "";
                        return {
                            id: pred?.placeId || `pred_${idx}`,
                            mainText,
                            secondaryText,
                            fullText,
                            placePrediction: pred,
                            placeId: pred?.placeId,
                        };
                    });
                    setSuggestions(items);
                    setShowSuggestions(true);
                    return;
                }
            } catch {
                // If modern places API is disabled on the key, fallback to Geocoder
            }
        }

        // 2. Geocoder fallback
        fallbackGeocodeSearch(fullQuery);
    };

    // Handle typing with debounced suggestions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchInput(val);
        setSearchError("");

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!val.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchPredictions(val);
        }, 250);
    };

    // Handle selecting a place suggestion from dropdown
    const handleSelectSuggestion = async (item: SuggestionItem) => {
        isInternalUpdate.current = true;
        setSearchInput(item.fullText);
        setShowSuggestions(false);

        // If modern Place object is available via PlacePrediction.toPlace()
        if (item.placePrediction?.toPlace) {
            try {
                const place = item.placePrediction.toPlace();
                await place.fetchFields({
                    fields: ["displayName", "formattedAddress", "location", "addressComponents"],
                });

                if (place.location) {
                    const lat = typeof place.location.lat === "function" ? place.location.lat() : place.location.lat;
                    const lng = typeof place.location.lng === "function" ? place.location.lng() : place.location.lng;

                    if (map) {
                        map.panTo({ lat, lng });
                        map.setZoom(16);
                    }

                    const address = place.formattedAddress || item.fullText;
                    const metadata = place.addressComponents ? extractMetadata(place.addressComponents) : undefined;
                    onLocationSelect(lat, lng, address, metadata);
                    return;
                }
            } catch {
                // Fallback to Geocoding if Place.fetchFields fails
            }
        }

        // Standard Geocoding fallback
        const geocoder = new google.maps.Geocoder();
        const request = item.placeId ? { placeId: item.placeId } : { address: item.fullText };

        geocoder.geocode(request, (results, status) => {
            if (status === "OK" && results && results[0]) {
                const { lat, lng } = results[0].geometry.location.toJSON();
                if (map) {
                    map.panTo({ lat, lng });
                    map.setZoom(16);
                }
                const metadata = results[0].address_components ? extractMetadata(results[0].address_components) : undefined;
                onLocationSelect(lat, lng, results[0].formatted_address, metadata);
            } else if (item.location) {
                if (map) {
                    map.panTo(item.location);
                    map.setZoom(16);
                }
                onLocationSelect(item.location.lat, item.location.lng, item.fullText);
            }
        });
    };

    const handleManualSearch = (queryText?: string) => {
        const query = queryText || searchInput;
        if (!query.trim() || !window.google?.maps) return;

        isInternalUpdate.current = true;
        setShowSuggestions(false);
        setSearchError("");
        setIsSearching(true);
        const geocoder = new google.maps.Geocoder();
        const fullQuery = countryCode && !query.toLowerCase().includes(countryCode.toLowerCase())
            ? `${query}, ${countryCode}`
            : query;

        geocoder.geocode({ address: fullQuery }, (results, status) => {
            setIsSearching(false);
            if (status === "OK" && results && results[0]) {
                const { lat, lng } = results[0].geometry.location.toJSON();
                if (map) {
                    map.panTo({ lat, lng });
                    map.setZoom(15);
                }
                setSearchInput(results[0].formatted_address);
                const metadata = results[0].address_components ? extractMetadata(results[0].address_components) : undefined;
                onLocationSelect(lat, lng, results[0].formatted_address, metadata);
            } else {
                setSearchError("Location not found. Try another search or click on the map.");
            }
        });
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) return;
        isInternalUpdate.current = true;
        setIsLocating(true);
        setShowSuggestions(false);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setIsLocating(false);
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                if (map) {
                    map.panTo({ lat, lng });
                    map.setZoom(16);
                }
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === "OK" && results && results[0]) {
                        const metadata = results[0].address_components ? extractMetadata(results[0].address_components) : undefined;
                        if (results[0].formatted_address) {
                            setSearchInput(results[0].formatted_address);
                        }
                        onLocationSelect(lat, lng, results[0].formatted_address, metadata);
                    } else {
                        onLocationSelect(lat, lng);
                    }
                });
            },
            () => {
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const onClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            isInternalUpdate.current = true;
            setShowSuggestions(false);
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            if (map) {
                map.panTo({ lat, lng });
            }

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    const metadata = results[0].address_components ? extractMetadata(results[0].address_components) : undefined;
                    if (results[0].formatted_address) {
                        setSearchInput(results[0].formatted_address);
                    }
                    onLocationSelect(lat, lng, results[0].formatted_address, metadata);
                } else {
                    onLocationSelect(lat, lng);
                }
            });
        }
    };

    if (!apiKey) {
        return (
            <div className="h-[400px] w-full bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                <h4 className="text-sm font-semibold text-[var(--admin-text)]">Google Maps API Key Missing</h4>
                <p className="text-xs text-[var(--admin-text-muted)] mt-1 max-w-sm">
                    Please configure <code className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono">VITE_GOOGLE_MAPS_API_KEY</code> in your <code className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono">.env</code> file.
                </p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="h-[400px] w-full bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <h4 className="text-sm font-semibold text-red-500">Google Maps Error</h4>
                <p className="text-xs text-[var(--admin-text-muted)] mt-1 max-w-md">
                    {loadError.message || "Failed to load Google Maps script. Please check your API key restrictions and billing settings in Google Cloud Console."}
                </p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="h-[400px] w-full bg-[var(--admin-card-bg)] border border-[var(--admin-border)] rounded-xl flex flex-col items-center justify-center gap-3 text-[var(--admin-text-muted)]">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--admin-primary)]" />
                <span className="text-sm font-medium">Loading Google Maps...</span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-inner border border-[var(--admin-border)]">
            {/* Search and Action Bar */}
            <div className="absolute left-3 right-3 top-3 z-30 flex flex-col gap-1 max-w-md">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchInput}
                            onChange={handleInputChange}
                            onFocus={() => {
                                if (suggestions.length > 0) setShowSuggestions(true);
                            }}
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            placeholder="Search city, address, or landmark..."
                            className="w-full pl-10 pr-16 py-2.5 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/15 rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-slate-900 dark:text-white text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleManualSearch();
                                } else if (e.key === 'Escape') {
                                    setShowSuggestions(false);
                                }
                            }}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <button
                            type="button"
                            onClick={() => handleManualSearch()}
                            disabled={isSearching || !searchInput.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[var(--admin-primary)] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-40 flex items-center gap-1 shadow-sm"
                        >
                            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Search"}
                        </button>
                    </div>

                    {/* Locate Me button */}
                    <button
                        type="button"
                        title="Find My Location"
                        onClick={handleGetCurrentLocation}
                        disabled={isLocating}
                        className="p-2.5 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/15 rounded-xl shadow-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition active:scale-95 disabled:opacity-50"
                    >
                        {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-[var(--admin-primary)]" /> : <Navigation className="w-4 h-4 text-[var(--admin-primary)]" />}
                    </button>
                </div>

                {/* Live Place Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="bg-white dark:bg-slate-900 border border-black/10 dark:border-white/15 rounded-xl shadow-2xl overflow-hidden mt-1 divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
                    >
                        {suggestions.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectSuggestion(item)}
                                className="w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                                <MapPin className="w-4 h-4 text-[var(--admin-primary)] shrink-0 mt-0.5" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                                        {item.mainText}
                                    </span>
                                    {item.secondaryText && (
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                            {item.secondaryText}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {searchError && (
                    <div className="bg-amber-500/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-sm">
                        {searchError}
                    </div>
                )}
            </div>

            {/* Click to pin hint badge */}
            <div className="absolute left-3 bottom-3 z-10 pointer-events-none bg-black/70 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-[var(--admin-primary)]" />
                <span>Click anywhere on the map to pin location</span>
            </div>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={selectedLocation || defaultCenter}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={onClick}
                options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                }}
            >
                {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>
        </div>
    );
}
