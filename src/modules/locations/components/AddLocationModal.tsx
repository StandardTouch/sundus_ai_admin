import { X, Loader2, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import LocationMap from "./LocationMap";
import { createLocation, updateLocation, type Location, type StoreTiming } from "@/lib/api/locations";
import { showSuccess, showError } from "@/lib/utils/toast";
import { Country, State, City } from 'country-state-city';

interface SelectOption { value: string; label: string; }

function CustomSelect({ value, onChange, options, placeholder, disabled }: {
    value: string;
    onChange: (val: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selectedLabel = options.find(o => o.value === value)?.label;

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={ref} className={`relative w-full ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)] flex items-center justify-between text-left"
            >
                <span className={selectedLabel ? '' : 'text-[var(--admin-text-muted)]'}>
                    {selectedLabel || placeholder || 'Select...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-[var(--admin-text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-[200] left-0 right-0 top-full mt-1 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg shadow-xl max-h-48 overflow-y-auto">
                    <div
                        className="px-4 py-2.5 text-sm text-[var(--admin-text-muted)] hover:bg-[var(--admin-border)] cursor-pointer"
                        onClick={() => { onChange(''); setOpen(false); }}
                    >
                        {placeholder || 'Select...'}
                    </div>
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-[var(--admin-border)] ${opt.value === value ? 'text-[var(--admin-primary)] font-semibold' : 'text-[var(--admin-text)]'
                                }`}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_TIMINGS: StoreTiming[] = DAYS.map(day => ({
    day,
    shifts: [{ open: "09:00", close: "18:00" }],
    isClosed: false
}));

interface AddLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Location | null;
}

export default function AddLocationModal({ isOpen, onClose, onSuccess, initialData }: AddLocationModalProps) {
    const [name, setName] = useState("");
    const [nameAra, setNameAra] = useState("");
    const [address, setAddress] = useState("");
    const [addressAra, setAddressAra] = useState("");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [managerName, setManagerName] = useState("");
    const [managerContact, setManagerContact] = useState("");
    const [storeContact, setStoreContact] = useState("");
    const [timings, setTimings] = useState<StoreTiming[]>(DEFAULT_TIMINGS);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.location_title);
            setNameAra(initialData.location_title_ara || "");
            setAddress(initialData.location_address);
            setAddressAra(initialData.location_address_ara || "");
            setCoords({
                lat: parseFloat(initialData.location_latitude),
                lng: parseFloat(initialData.location_longitude)
            });
            setSelectedCountry(initialData.country || "");
            setSelectedState(initialData.state || "");
            setSelectedCity(initialData.city || "");
            setManagerName(initialData.store_manager_name || "");
            setManagerContact(initialData.store_manager_phone || "");
            setStoreContact(initialData.store_contact_phone || "");
            setTimings(initialData.timings || DEFAULT_TIMINGS);
        } else {
            setName("");
            setNameAra("");
            setAddress("");
            setAddressAra("");
            setCoords(null);
            setSelectedCountry("");
            setSelectedState("");
            setSelectedCity("");
            setManagerName("");
            setManagerContact("");
            setTimings(DEFAULT_TIMINGS);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !address || !coords || !selectedCountry || !selectedState || !selectedCity) return;

        setIsSubmitting(true);
        try {
            const payload = {
                location_title: name,
                location_title_ara: nameAra,
                location_address: address,
                location_address_ara: addressAra,
                location_latitude: coords.lat.toString(),
                location_longitude: coords.lng.toString(),
                country: selectedCountry,
                state: selectedState,
                city: selectedCity,
                store_manager_name: managerName,
                store_manager_phone: managerContact,
                store_contact_phone: storeContact,
                timings: timings,
                location_animation: "DROP",
                isActive: true
            };

            if (initialData) {
                await updateLocation(initialData._id, payload);
                showSuccess("Location updated successfully");
            } else {
                await createLocation(payload);
                showSuccess("Location added successfully");
            }
            onSuccess();
            setName("");
            setNameAra("");
            setAddress("");
            setAddressAra("");
            setCoords(null);
            setSelectedCountry("");
            setSelectedState("");
            setSelectedCity("");
            setManagerName("");
            setManagerContact("");
            setStoreContact("");
            setTimings(DEFAULT_TIMINGS);
        } catch (err: any) {
            showError("Failed to add location");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-[var(--admin-border)] flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[var(--admin-text)]">
                        {initialData ? "Edit Location" : "Add New Location"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[var(--admin-border)] rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-[var(--admin-text-muted)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    Location Name (EN)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Headquarters"
                                    className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    Location Name (AR)
                                </label>
                                <input
                                    type="text"
                                    value={nameAra}
                                    onChange={(e) => setNameAra(e.target.value)}
                                    placeholder="اسم الموقع"
                                    dir="rtl"
                                    className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    Full Address (EN)
                                </label>
                                <textarea
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter complete address"
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)] resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    Full Address (AR)
                                </label>
                                <textarea
                                    value={addressAra}
                                    onChange={(e) => setAddressAra(e.target.value)}
                                    placeholder="العنوان الكامل"
                                    rows={2}
                                    dir="rtl"
                                    className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)] resize-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    Store Contact Phone
                                </label>
                                <input
                                    type="text"
                                    value={storeContact}
                                    onChange={(e) => setStoreContact(e.target.value)}
                                    placeholder="Enter store phone"
                                    className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    Store Manager Name
                                </label>
                                <input
                                    type="text"
                                    value={managerName}
                                    onChange={(e) => setManagerName(e.target.value)}
                                    placeholder="Enter manager name"
                                    className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    Store Manager Phone
                                </label>
                                <input
                                    type="text"
                                    value={managerContact}
                                    onChange={(e) => setManagerContact(e.target.value)}
                                    placeholder="Enter manager phone"
                                    className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)]"
                                />
                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    Country
                                </label>
                                <CustomSelect
                                    value={selectedCountry}
                                    onChange={(val) => { setSelectedCountry(val); setSelectedState(""); setSelectedCity(""); }}
                                    placeholder="Select Country"
                                    options={Country.getAllCountries()
                                        .filter(c => ['SA', 'AE'].includes(c.isoCode))
                                        .map(c => ({ value: c.isoCode, label: c.name }))}
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    State
                                </label>
                                <CustomSelect
                                    value={selectedState}
                                    onChange={(val) => { setSelectedState(val); setSelectedCity(""); }}
                                    placeholder="Select State"
                                    disabled={!selectedCountry}
                                    options={selectedCountry ? State.getStatesOfCountry(selectedCountry).map(s => ({ value: s.isoCode, label: s.name })) : []}
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1.5">
                                    City
                                </label>
                                <CustomSelect
                                    value={selectedCity}
                                    onChange={setSelectedCity}
                                    placeholder="Select City"
                                    disabled={!selectedState}
                                    options={selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry, selectedState).map(c => ({ value: c.name, label: c.name })) : []}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-2">
                                Pin Location on Map
                            </label>
                            <div className="rounded-lg overflow-hidden border border-[var(--admin-border)]">
                                <LocationMap
                                    onLocationSelect={(lat, lng, addr, metadata) => {
                                        setCoords({ lat, lng });
                                        if (addr) setAddress(addr);
                                        if (metadata) {
                                            if (metadata.countryCode) {
                                                const isAllowed = ['SA', 'AE'].includes(metadata.countryCode);
                                                if (isAllowed) {
                                                    setSelectedCountry(metadata.countryCode);

                                                    // Try to find matching state
                                                    if (metadata.stateCode || metadata.stateName) {
                                                        const states = State.getStatesOfCountry(metadata.countryCode);
                                                        const matchedState = states.find(s =>
                                                            s.isoCode === metadata.stateCode ||
                                                            s.name.toLowerCase() === metadata.stateName?.toLowerCase() ||
                                                            s.name.toLowerCase().includes(metadata.stateName?.toLowerCase() || "")
                                                        );

                                                        if (matchedState) {
                                                            setSelectedState(matchedState.isoCode);

                                                            // Try to find matching city
                                                            if (metadata.cityName) {
                                                                const cities = City.getCitiesOfState(metadata.countryCode, matchedState.isoCode);
                                                                const matchedCity = cities.find(c =>
                                                                    c.name.toLowerCase() === metadata.cityName?.toLowerCase() ||
                                                                    c.name.toLowerCase().includes(metadata.cityName?.toLowerCase() || "")
                                                                );
                                                                if (matchedCity) {
                                                                    setSelectedCity(matchedCity.name);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                    selectedLocation={coords}
                                    countryCode={selectedCountry}
                                    stateCode={selectedState}
                                    cityName={selectedCity}
                                />
                            </div>
                            {coords && (
                                <p className="mt-2 text-xs text-[var(--admin-text-dim)]">
                                    Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-[var(--admin-text)] border-b border-[var(--admin-border)] pb-2 flex justify-between items-center">
                                Store Timings
                                <span className="text-xs font-normal text-[var(--admin-text-muted)]">Multiple shifts supported</span>
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {timings.map((dayTiming, dayIndex) => (
                                    <div key={dayTiming.day} className="flex flex-col gap-3 p-4 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="font-bold text-sm text-[var(--admin-primary)]">
                                                {dayTiming.day}
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer bg-[var(--admin-bg-secondary)] px-3 py-1 rounded-full border border-[var(--admin-border)]">
                                                <input
                                                    type="checkbox"
                                                    checked={dayTiming.isClosed}
                                                    onChange={(e) => {
                                                        const newTimings = [...timings];
                                                        newTimings[dayIndex].isClosed = e.target.checked;
                                                        setTimings(newTimings);
                                                    }}
                                                    className="w-4 h-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)] bg-[var(--admin-bg)]"
                                                />
                                                <span className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Closed</span>
                                            </label>
                                        </div>

                                        {!dayTiming.isClosed && (
                                            <div className="space-y-3">
                                                {dayTiming.shifts.map((shift, shiftIndex) => (
                                                    <div key={shiftIndex} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <div className="relative flex-1">
                                                                <input
                                                                    type="time"
                                                                    value={shift.open}
                                                                    onChange={(e) => {
                                                                        const newTimings = [...timings];
                                                                        newTimings[dayIndex].shifts[shiftIndex].open = e.target.value;
                                                                        setTimings(newTimings);
                                                                    }}
                                                                    className="w-full px-3 py-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg text-sm text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
                                                                />
                                                                <span className="absolute -top-2 left-2 bg-[var(--admin-bg)] px-1 text-[10px] text-[var(--admin-text-muted)] uppercase">Open</span>
                                                            </div>
                                                            <span className="text-[var(--admin-text-muted)] text-sm font-medium">to</span>
                                                            <div className="relative flex-1">
                                                                <input
                                                                    type="time"
                                                                    value={shift.close}
                                                                    onChange={(e) => {
                                                                        const newTimings = [...timings];
                                                                        newTimings[dayIndex].shifts[shiftIndex].close = e.target.value;
                                                                        setTimings(newTimings);
                                                                    }}
                                                                    className="w-full px-3 py-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg text-sm text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
                                                                />
                                                                <span className="absolute -top-2 left-2 bg-[var(--admin-bg)] px-1 text-[10px] text-[var(--admin-text-muted)] uppercase">Close</span>
                                                            </div>
                                                        </div>

                                                        {dayTiming.shifts.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newTimings = [...timings];
                                                                    newTimings[dayIndex].shifts.splice(shiftIndex, 1);
                                                                    setTimings(newTimings);
                                                                }}
                                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Remove Shift"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newTimings = [...timings];
                                                        newTimings[dayIndex].shifts.push({ open: "09:00", close: "18:00" });
                                                        setTimings(newTimings);
                                                    }}
                                                    className="w-full py-2 border-2 border-dashed border-[var(--admin-border)] rounded-lg text-xs font-semibold text-[var(--admin-text-muted)] hover:border-[var(--admin-primary)] hover:text-[var(--admin-primary)] transition-all flex items-center justify-center gap-2"
                                                >
                                                    + Add Shift
                                                </button>
                                            </div>
                                        )}

                                        {dayTiming.isClosed && (
                                            <div className="py-2 text-center text-xs text-red-400 font-medium italic">
                                                This location will be marked as closed on {dayTiming.day}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-[var(--admin-border)] text-[var(--admin-text)] rounded-lg hover:bg-[var(--admin-border)] transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name || !address || !coords || !selectedCountry || !selectedState || !selectedCity || isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{initialData ? "Updating..." : "Saving..."}</span>
                                </>
                            ) : (
                                initialData ? "Update Location" : "Save Location"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
