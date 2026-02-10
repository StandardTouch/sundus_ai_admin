import { useEffect, useState, useCallback } from "react";
import { Plus, MapPin, Trash2, Search, Loader2, Edit2, Filter, Check } from "lucide-react";
import AddLocationModal from "../components/AddLocationModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { fetchLocations, deleteLocation, updateLocation, type Location } from "@/lib/api/locations";
import { showSuccess, showError } from "@/lib/utils/toast";

type ActiveFilter = "all" | "active" | "inactive";

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const loadLocations = useCallback(async (search?: string, filter?: ActiveFilter) => {
        setIsLoading(true);
        try {
            const params: { search?: string; isActive?: boolean } = {};
            if (search) params.search = search;
            if (filter === "active") params.isActive = true;
            if (filter === "inactive") params.isActive = false;

            const res = await fetchLocations(params);

            let data: Location[] = [];
            if (Array.isArray(res)) {
                data = res;
            } else if (res && Array.isArray(res.data)) {
                data = res.data;
            }

            setLocations(data);
        } catch (err: any) {
            showError("Failed to fetch locations");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load and filter change load
    useEffect(() => {
        loadLocations(searchQuery, activeFilter);
    }, [activeFilter, loadLocations]);

    // Handle debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadLocations(searchQuery, activeFilter);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, loadLocations]);


    const handleDelete = async () => {
        if (!locationToDelete) return;

        setIsDeleting(true);
        try {
            const id = locationToDelete._id || locationToDelete.id!;
            await deleteLocation(id);
            setLocations(locations.filter((loc) => (loc._id || loc.id) !== id));
            showSuccess("Location deleted successfully");
            setIsDeleteModalOpen(false);
            setLocationToDelete(null);
        } catch (err: any) {
            showError("Failed to delete location");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        setIsUpdatingStatus(true);
        try {
            await updateLocation(id, { isActive: !currentStatus });
            setLocations(prev => prev.map(loc =>
                loc._id === id ? { ...loc, isActive: !currentStatus } : loc
            ));
            showSuccess(`Location ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (err: any) {
            showError("Failed to update status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const filterOptions: { id: ActiveFilter; label: string }[] = [
        { id: "all", label: "All Locations" },
        { id: "active", label: "Active" },
        { id: "inactive", label: "Inactive" },
    ];

    return (
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
            <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--admin-text)]">
                            Locations Management
                        </h2>
                        <p className="text-sm text-[var(--admin-text-muted)]">
                            Manage and view your business locations on the map
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Location</span>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--admin-text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search locations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)]"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`px-4 py-2.5 border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] transition-colors flex items-center gap-2 hover:bg-[var(--admin-bg)] min-w-[140px] justify-between ${activeFilter !== 'all' ? 'border-[var(--admin-primary)] text-[var(--admin-primary)]' : ''}`}
                        >
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {filterOptions.find(o => o.id === activeFilter)?.label}
                                </span>
                            </div>
                        </button>

                        {isFilterOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsFilterOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setActiveFilter(option.id);
                                                setIsFilterOpen(false);
                                            }}
                                            className="w-full px-4 py-2.5 text-sm text-left flex items-center justify-between hover:bg-[var(--admin-bg)] transition-colors text-[var(--admin-text)]"
                                        >
                                            <span>{option.label}</span>
                                            {activeFilter === option.id && (
                                                <Check className="w-4 h-4 text-[var(--admin-primary)]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--admin-primary)]" />
                            <p className="text-sm text-[var(--admin-text-muted)]">Fetching locations...</p>
                        </div>
                    ) : (
                        <>
                            {locations.map((location) => (
                                <div
                                    key={location._id || location.id}
                                    className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg p-5 flex flex-col gap-4 hover:border-[var(--admin-primary)] transition-colors group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${location.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <button
                                                onClick={() => handleToggleActive(location._id || location.id!, location.isActive)}
                                                disabled={isUpdatingStatus}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${location.isActive ? 'bg-[var(--admin-primary)]' : 'bg-gray-300 dark:bg-gray-600'} ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <span
                                                    className={`${location.isActive ? 'translate-x-6' : 'translate-x-1'
                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    setSelectedLocation(location);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] transition-colors p-1"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setLocationToDelete(location);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="text-[var(--admin-text-muted)] hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-[var(--admin-text)] mb-1">
                                            {location.location_title || "Untitled Location"}
                                        </h3>
                                        <p className="text-sm text-[var(--admin-text-muted)] line-clamp-2">
                                            {location.location_address || "No address provided"}
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-[var(--admin-border)] flex items-center justify-between">
                                        <span className="text-xs text-[var(--admin-text-dim)]">
                                            {location.created_at ? new Date(location.created_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                        <span className="text-xs font-mono text-[var(--admin-text-dim)]">
                                            {location.location_latitude ? parseFloat(location.location_latitude).toFixed(4) : '0.0000'}, {location.location_longitude ? parseFloat(location.location_longitude).toFixed(4) : '0.0000'}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {locations.length === 0 && (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-[var(--admin-text-muted)]">No locations found.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Global Loader Overlay for Status Toggling */}
            {isUpdatingStatus && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/5 bg-opacity-50 backdrop-blur-[1px]">
                    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-6 shadow-2xl flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--admin-primary)]" />
                        <p className="text-sm font-medium text-[var(--admin-text)]">Updating status...</p>
                    </div>
                </div>
            )}

            <AddLocationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedLocation(null);
                }}
                initialData={selectedLocation}
                onSuccess={() => {
                    loadLocations();
                    setIsModalOpen(false);
                    setSelectedLocation(null);
                }}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setLocationToDelete(null);
                }}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Delete Location"
                confirmLabel="Delete Location"
                description={
                    <p>
                        Are you sure you want to delete the location{" "}
                        <span className="font-semibold text-[var(--admin-text)]">
                            {locationToDelete?.location_title}
                        </span>
                        ? This action cannot be undone and all location data will be permanently deleted.
                    </p>
                }
            />
        </main>
    );
}
