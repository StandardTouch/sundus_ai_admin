import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useCallback, useState } from "react";

const LIBRARIES: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

const containerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
    lat: 24.7136,
    lng: 46.6753, // Riyadh
};

interface LocationMapProps {
    onLocationSelect: (lat: number, lng: number, address?: string) => void;
    selectedLocation: { lat: number; lng: number } | null;
}

export default function LocationMap({ onLocationSelect, selectedLocation }: LocationMapProps) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(_map: google.maps.Map) {
        setMap(null);
    }, []);

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                if (map) {
                    map.panTo({ lat, lng });
                    map.setZoom(15);
                }
                onLocationSelect(lat, lng, place.formatted_address);
            }
        }
    };

    const onClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            // Perform reverse geocoding
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    onLocationSelect(lat, lng, results[0].formatted_address);
                } else {
                    onLocationSelect(lat, lng);
                }
            });
        }
    };

    if (!isLoaded) return <div className="h-[400px] w-full bg-[var(--admin-border)] animate-pulse rounded-lg flex items-center justify-center text-[var(--admin-text-muted)]">Loading Map...</div>;

    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="h-[400px] w-full bg-red-50 border border-red-200 rounded-lg flex items-center justify-center p-6 text-center">
                <p className="text-red-600 text-sm">
                    Google Maps API Key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[400px]">
            <Autocomplete
                onLoad={(auto) => setAutocomplete(auto)}
                onPlaceChanged={onPlaceChanged}
            >
                <div className="absolute left-4 top-4 z-20 w-[calc(100%-32px)] sm:w-80">
                    <input
                        type="text"
                        placeholder="Search for a place..."
                        className="w-full px-4 py-3 bg-white border-0 rounded-xl shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-black text-sm font-medium placeholder:text-gray-400"
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    />
                </div>
            </Autocomplete>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={selectedLocation || center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={onClick}
                options={{
                    styles: [
                        {
                            featureType: "all",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#000000" }],
                        },
                        // You can add more styles for a dark theme map if needed
                    ],
                    disableDefaultUI: false,
                    zoomControl: true,
                }}
            >
                {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>
            <style dangerouslySetInnerHTML={{
                __html: `
                .pac-container { 
                    z-index: 9999 !important; 
                    border-radius: 12px;
                    border: none;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                    margin-top: 8px;
                    font-family: inherit;
                }
                .pac-item {
                    padding: 8px 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .pac-item:hover {
                    background-color: #f3f4f6;
                }
                .pac-item-query {
                    font-size: 14px;
                    color: #111827;
                }
            `}} />
        </div>
    );
}
