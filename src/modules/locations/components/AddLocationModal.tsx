import { X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import LocationMap from "./LocationMap";
import { createLocation, updateLocation, type Location } from "@/lib/api/locations";
import { showSuccess, showError } from "@/lib/utils/toast";

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
        } else {
            setName("");
            setNameAra("");
            setAddress("");
            setAddressAra("");
            setCoords(null);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !address || !coords) return;

        setIsSubmitting(true);
        try {
            const payload = {
                location_title: name,
                location_title_ara: nameAra,
                location_address: address,
                location_address_ara: addressAra,
                location_latitude: coords.lat.toString(),
                location_longitude: coords.lng.toString(),
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

                        <div>
                            <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-2">
                                Pin Location on Map
                            </label>
                            <div className="rounded-lg overflow-hidden border border-[var(--admin-border)]">
                                <LocationMap
                                    onLocationSelect={(lat, lng, addr) => {
                                        setCoords({ lat, lng });
                                        if (addr) setAddress(addr);
                                    }}
                                    selectedLocation={coords}
                                />
                            </div>
                            {coords && (
                                <p className="mt-2 text-xs text-[var(--admin-text-dim)]">
                                    Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                                </p>
                            )}
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
                            disabled={!name || !address || !coords || isSubmitting}
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
