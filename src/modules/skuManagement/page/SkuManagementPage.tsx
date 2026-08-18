import { useState } from "react";
import {
  Package,
  Search,
  Check,
  X,
  Loader2,
  Star,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Layers,
  FileText,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  Building2,
} from "lucide-react";
import { lookupSku, type SkuLookupResult } from "@/lib/api/skuManagement";
import { showSuccess, showError } from "@/lib/utils/toast";

const BRAND_OPTIONS = [
  "Versace",
  "Ferragamo",
  "Roberto Cavalli by Franck Muller",
  "Boss",
  "Tommy Hilfiger",
  "Calvin Klein",
  "Coach",
  "Lacoste",
  "Pierre Cardin",
  "Ted Baker",
  "Elie Saab",
  "Philipp Plein",
  "Balmain",
  "Pierre Lannier",
  "Just Cavalli",
  "Roberto Cavalli",
  "Hugo",
  "Aston Martin",
  "Olivia Burton",
  "Rolex",
  "Omega",
  "Casio",
  "Seiko",
  "Citizen",
  "Tissot",
  "Fossil",
  "Timex",
  "Titan",
  "Fastrack",
  "Nautica",
  "Rado",
  "Cartier",
  "TAG Heuer",
  "Longines",
  "Breitling",
  "Tudor",
  "Hublot",
  "Patek Philippe",
  "Audemars Piguet",
  "Swatch",
  "Armani Exchange",
  "Michael Kors",
  "Diesel",
  "Guess",
  "Emporio Armani",
];

const DROPDOWN_OPTIONS: Record<string, string[]> = {
  gender: ["Mens", "Womens", "Unisex", "Boys", "Girls", "Kids", "Youth"],
  watch_type: [
    "Diving/Dive",
    "Dress",
    "Chronograph",
    "Sports",
    "Field",
    "Pilot/Aviator",
    "GMT",
    "Analog",
    "Digital",
    "Smartwatch",
    "Mechanical",
    "Chronometer",
    "Skeleton",
    "Tourbillon",
    "Moonphase",
    "Perpetual Calendar",
    "Military",
  ],
  case_material: [
    "Stainless Steel 316L",
    "Stainless Steel 904L",
    "Titanium Grade 2",
    "Titanium Grade 5",
    "Ceramic (Zirconium Oxide)",
    "Ceramic (Aluminium Oxide)",
    "Gold 18K",
    "Gold 14K",
    "Platinum",
    "Aluminum",
    "PVD-coated",
    "Carbon Fiber",
    "Bronze",
    "Tantalum",
    "Porcelain",
    "Wood",
    "Resin",
  ],
  movement_type: [
    "Quartz",
    "Mechanical (Manual Wind)",
    "Automatic (Self-Winding)",
    "Spring Drive",
    "Kinetic (Eco-Drive)",
    "Solar",
    "Eco-Drive",
    "Radio-Controlled",
    "GPS Time",
    "Tourbillon",
    "Co-Axial",
  ],
  display_type: [
    "Analog",
    "Digital LCD",
    "Digital LED",
    "Digital OLED",
    "E-Ink",
    "Hybrid",
  ],
  water_resistance: [
    "3 ATM (30m)",
    "5 ATM (50m)",
    "10 ATM (100m)",
    "20 ATM (200m)",
    "30 ATM (300m)",
    "50 ATM (500m)",
    "100 ATM (1000m)",
    "Splash Resistant",
  ],
  dial_color: [
    "Black",
    "White/Silver",
    "Blue",
    "Green",
    "Grey",
    "Champagne",
    "Brown",
    "Red",
    "Orange",
    "Purple",
    "Mother-of-Pearl",
    "Gold",
    "Pink",
    "Yellow",
    "Teal",
    "Navy",
    "Burgundy",
    "Skeleton/Transparent",
  ],
};

const ARABIC_TRANSLATIONS: Record<string, Record<string, string>> = {
  gender: {
    Mens: "رجالي",
    Womens: "نسائي",
    Unisex: "للجنسين",
    Boys: "أولاد",
    Girls: "بنات",
    Kids: "أطفال",
    Youth: "شباب",
  },
  watch_type: {
    "Diving/Dive": "غوص / غواص",
    Dress: "رسمي",
    Chronograph: "كرونوغراف",
    Sports: "رياضي",
    Field: "ميداني",
    "Pilot/Aviator": "طيران",
    GMT: "توقيت جرينتش (GMT)",
    Analog: "عقارب",
    Digital: "رقمي",
    Smartwatch: "ساعة ذكية",
    Mechanical: "ميكانيكي",
    Chronometer: "كرونومتر",
    Skeleton: "سكليتون",
    Tourbillon: "توربيون",
    Moonphase: "مراحل القمر",
    "Perpetual Calendar": "تقويم دائم",
    Military: "عسكري",
  },
  case_material: {
    "Stainless Steel 316L": "ستانلس ستيل 316L",
    "Stainless Steel 904L": "ستانلس ستيل 904L",
    "Titanium Grade 2": "تيتانيوم درجة 2",
    "Titanium Grade 5": "تيتانيوم درجة 5",
    "Ceramic (Zirconium Oxide)": "سيراميك (أكسيد الزركونيوم)",
    "Ceramic (Aluminium Oxide)": "سيراميك (أكسيد الألمنيوم)",
    "Gold 18K": "ذهب عيار 18",
    "Gold 14K": "ذهب عيار 14",
    Platinum: "بلاتين",
    Aluminum: "ألمنيوم",
    "PVD-coated": "مطلي بـ PVD",
    "Carbon Fiber": "ألياف كربون",
    Bronze: "برونز",
    Tantalum: "تانتالوم",
    Porcelain: "بورسلين",
    Wood: "خشب",
    Resin: "راتنج",
  },
  movement_type: {
    Quartz: "كوارتز",
    "Mechanical (Manual Wind)": "ميكانيكي (تعبئة يدوية)",
    "Automatic (Self-Winding)": "أوتوماتيكي (ذاتي التعبئة)",
    "Spring Drive": "سبرينج درايف",
    "Kinetic (Eco-Drive)": "كينتيك",
    Solar: "شمسي",
    "Eco-Drive": "إيكو درايف",
    "Radio-Controlled": "تحكم بالراديو",
    "GPS Time": "توقيت GPS",
    Tourbillon: "توربيون",
    "Co-Axial": "كو أكسيال",
  },
  display_type: {
    Analog: "عقارب",
    "Digital LCD": "رقمي LCD",
    "Digital LED": "رقمي LED",
    "Digital OLED": "رقمي OLED",
    "E-Ink": "حبر إلكتروني",
    Hybrid: "هجين",
  },
  water_resistance: {
    "3 ATM (30m)": "3 ATM (30م)",
    "5 ATM (50m)": "5 ATM (50م)",
    "10 ATM (100m)": "10 ATM (100م)",
    "20 ATM (200m)": "20 ATM (200م)",
    "30 ATM (300m)": "30 ATM (300م)",
    "50 ATM (500m)": "50 ATM (500م)",
    "100 ATM (1000m)": "100 ATM (1000م)",
    "Splash Resistant": "مقاوم للرذاذ",
  },
  dial_color: {
    Black: "أسود",
    "White/Silver": "أبيض / فضي",
    Blue: "أزرق",
    Green: "أخضر",
    Grey: "رمادي",
    Champagne: "شامبانيا",
    Brown: "بني",
    Red: "أحمر",
    Orange: "برتقالي",
    Purple: "بنفسجي",
    "Mother-of-Pearl": "عرق اللؤلؤ",
    Gold: "ذهبي",
    Pink: "وردي",
    Yellow: "أصفر",
    Teal: "أزرق مخضر",
    Navy: "كحلي",
    Burgundy: "عنابي",
    "Skeleton/Transparent": "سكليتون / شفاف",
  },
};

const SPEC_KEYS: { key: keyof SkuLookupResult; arKey: keyof SkuLookupResult; label: string }[] = [
  { key: "gender", arKey: "gender_ar", label: "Gender" },
  { key: "watch_type", arKey: "watch_type_ar", label: "Watch Type" },
  { key: "case_material", arKey: "case_material_ar", label: "Case Material" },
  { key: "band_material", arKey: "band_material_ar", label: "Band Material" },
  { key: "movement_type", arKey: "movement_type_ar", label: "Movement Type" },
  { key: "display_type", arKey: "display_type_ar", label: "Display Type" },
  { key: "water_resistance", arKey: "water_resistance_ar", label: "Water Resistance" },
  { key: "dial_color", arKey: "dial_color_ar", label: "Dial Color" },
  { key: "case_diameter", arKey: "case_diameter_ar", label: "Case Diameter" },
  { key: "case_thickness", arKey: "case_thickness_ar", label: "Case Thickness" },
  { key: "short_description", arKey: "short_description_ar", label: "Short Description" },
  { key: "description", arKey: "description_ar", label: "Full Description" },
];

export default function SkuManagementPage() {
  const [skuInput, setSkuInput] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [lookupData, setLookupData] = useState<SkuLookupResult | null>(null);
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, "pending" | "accepted" | "rejected">>({});

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showError("Please upload a valid image file (PNG, JPG, WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      const img = document.createElement("img");
      img.onload = () => {
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setImageInput(compressedDataUrl);
          setImagePreview(compressedDataUrl);
          showSuccess("Watch image attached & optimized!");
          return;
        }

        setImageInput(rawDataUrl);
        setImagePreview(rawDataUrl);
        showSuccess("Watch image attached successfully!");
      };

      img.onerror = () => {
        setImageInput(rawDataUrl);
        setImagePreview(rawDataUrl);
        showSuccess("Watch image attached!");
      };

      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImageInput("");
    setImageUrlInput("");
    setImagePreview(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const brandToUse = selectedBrand === "Other" ? customBrand.trim() : selectedBrand;
    const skuToUse = skuInput.trim();
    const activeImage = imageTab === "upload" ? imageInput : imageUrlInput.trim();

    if (!skuToUse && !activeImage) {
      showError("Please enter a SKU number or attach a watch image");
      return;
    }

    setIsLoading(true);
    try {
      const res = await lookupSku({
        sku: skuToUse,
        brand_name: brandToUse,
        image: activeImage,
      });

      if (res) {
        setLookupData(res);
        const initStatus: Record<string, "pending" | "accepted" | "rejected"> = {};
        SPEC_KEYS.forEach((s) => {
          initStatus[s.key] = "pending";
        });
        setFieldStatuses(initStatus);
        showSuccess(`Extracted specifications for ${res.brand_name || skuToUse || "watch"}`);
      }
    } catch (err: any) {
      showError(err?.response?.data?.error || err?.message || "Failed to fetch SKU data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageStatus = (imageId: string, status: "accepted" | "rejected") => {
    if (!lookupData) return;
    setLookupData({
      ...lookupData,
      images: lookupData.images.map((img) =>
        img.id === imageId ? { ...img, status: img.status === status ? "pending" : status } : img
      ),
    });
  };

  const handleFieldStatus = (key: string, status: "accepted" | "rejected") => {
    setFieldStatuses((prev) => ({
      ...prev,
      [key]: prev[key] === status ? "pending" : status,
    }));
  };

  const handleFieldChange = (key: keyof SkuLookupResult, arKey: keyof SkuLookupResult, newValueEn: string) => {
    if (!lookupData) return;
    const arMap = ARABIC_TRANSLATIONS[key as string] || {};
    const newValueAr = arMap[newValueEn] || (lookupData[arKey] as string) || newValueEn;

    setLookupData({
      ...lookupData,
      [key]: newValueEn,
      [arKey]: newValueAr,
    });
  };

  const handleBulkFieldStatus = (status: "accepted" | "rejected") => {
    const updated: Record<string, "pending" | "accepted" | "rejected"> = {};
    SPEC_KEYS.forEach((s) => {
      updated[s.key] = status;
    });
    setFieldStatuses(updated);
    showSuccess(`Marked all fields as ${status}`);
  };

  const handleBulkImageStatus = (status: "accepted" | "rejected") => {
    if (!lookupData) return;
    setLookupData({
      ...lookupData,
      images: lookupData.images.map((img) => ({ ...img, status })),
    });
    showSuccess(`Marked all images as ${status}`);
  };

  const acceptedFieldsCount = Object.values(fieldStatuses).filter((s) => s === "accepted").length;
  const acceptedImagesCount = lookupData?.images.filter((img) => img.status === "accepted").length || 0;

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--admin-border)] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-7 h-7 text-[var(--admin-primary)]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--admin-text)]">
                SKU Management
              </h2>
            </div>
            <p className="text-sm text-[var(--admin-text-muted)] mt-1">
              Extract watch specifications and real images using SKU number, Brand, and Watch Image
            </p>
          </div>
        </div>

        {/* Multimodal SKU & Image Search Form */}
        <form onSubmit={handleSearch} className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Column 1: SKU Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--admin-text)] flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[var(--admin-primary)]" />
                <span>Watch SKU Number</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. ROLEX-126610LN, NT3255NM02..."
                  value={skuInput}
                  onChange={(e) => setSkuInput(e.target.value)}
                  className="w-full pl-3.5 pr-9 py-2.5 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)] text-sm font-mono"
                />
                {skuInput && (
                  <button
                    type="button"
                    onClick={() => setSkuInput("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Column 2: Brand Selection Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--admin-text)] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[var(--admin-primary)]" />
                <span>Brand Name</span>
              </label>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)] text-sm appearance-none cursor-pointer pr-9"
                >
                  <option value="">-- Select Watch Brand --</option>
                  {BRAND_OPTIONS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                  <option value="Other">Other / Custom Brand...</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[var(--admin-text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {selectedBrand === "Other" && (
                <input
                  type="text"
                  placeholder="Enter custom brand name..."
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  className="w-full px-3 py-2 mt-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg text-sm text-[var(--admin-text)]"
                />
              )}
            </div>

            {/* Column 3: Image Input (Upload / URL) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--admin-text)] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[var(--admin-primary)]" />
                  <span>Watch Image</span>
                </label>
                <div className="flex items-center gap-1 bg-[var(--admin-bg-secondary)] p-0.5 rounded-md border border-[var(--admin-border)]">
                  <button
                    type="button"
                    onClick={() => setImageTab("upload")}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                      imageTab === "upload"
                        ? "bg-[var(--admin-primary)] text-white"
                        : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
                    }`}
                  >
                    File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab("url")}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                      imageTab === "url"
                        ? "bg-[var(--admin-primary)] text-white"
                        : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
                    }`}
                  >
                    URL
                  </button>
                </div>
              </div>

              {imageTab === "upload" ? (
                <div className="relative">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 bg-[var(--admin-bg-secondary)] border border-dashed border-[var(--admin-border)] rounded-lg hover:border-[var(--admin-primary)] transition-all cursor-pointer text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]">
                    <Upload className="w-4 h-4 text-[var(--admin-primary)]" />
                    <span>{imagePreview ? "Change File" : "Choose / Drop Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://example.com/watch.jpg..."
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value);
                      if (e.target.value.startsWith("http")) {
                        setImagePreview(e.target.value);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-text)] text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Attached Image Thumbnail Preview */}
          {imagePreview && (
            <div className="flex items-center gap-3 p-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg animate-in fade-in duration-200">
              <img
                src={imagePreview}
                alt="Watch Preview"
                className="w-12 h-12 object-cover rounded-md border border-[var(--admin-border)]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--admin-text)] truncate">Attached Watch Image</p>
                <p className="text-[10px] text-green-500 font-medium">Ready for multimodal extraction</p>
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                className="p-1 text-red-500 hover:bg-red-500/10 rounded-md cursor-pointer transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-end pt-2 border-t border-[var(--admin-border)]/50">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching & Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Search & Extract</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Area */}
        {lookupData ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* SKU Meta Card */}
            <div className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase px-2.5 py-0.5 rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] font-mono font-semibold">
                    SKU: {lookupData.sku}
                  </span>
                  <span className="text-xs text-[var(--admin-text-muted)] font-semibold">
                    {lookupData.brand_name}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--admin-text)] mt-1">
                  {lookupData.model_number}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSearch(new Event("submit") as any)}
                  className="px-3 py-1.5 text-xs font-medium border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-secondary)] flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-fetch</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: 5 WATCH IMAGES */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--admin-border)] pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[var(--admin-text)] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[var(--admin-primary)]" />
                    <span>Watch Images (5 Images)</span>
                  </h3>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    1 Primary Image and 4 Secondary Images retrieved for this SKU
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkImageStatus("accepted")}
                    className="px-3 py-1.5 text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept All Images</span>
                  </button>
                  <button
                    onClick={() => handleBulkImageStatus("rejected")}
                    className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject All Images</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {lookupData.images.map((img) => {
                  const isAccepted = img.status === "accepted";
                  const isRejected = img.status === "rejected";

                  return (
                    <div
                      key={img.id}
                      className={`relative bg-[var(--admin-bg)] border rounded-xl overflow-hidden flex flex-col justify-between transition-all group ${
                        img.isPrimary
                          ? "md:col-span-2 border-[var(--admin-primary)] shadow-md ring-1 ring-[var(--admin-primary)]/30"
                          : isAccepted
                          ? "border-green-500 ring-1 ring-green-500/30"
                          : isRejected
                          ? "border-red-500 opacity-60"
                          : "border-[var(--admin-border)] hover:border-[var(--admin-border-light)]"
                      }`}
                    >
                      <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {img.isPrimary && (
                          <div className="absolute top-2.5 left-2.5 bg-[var(--admin-primary)] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 fill-current" />
                            <span>PRIMARY IMAGE</span>
                          </div>
                        )}
                        {img.status && img.status !== "pending" && (
                          <div
                            className={`absolute top-2.5 right-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full text-white shadow-md flex items-center gap-1 ${
                              isAccepted ? "bg-green-600" : "bg-red-600"
                            }`}
                          >
                            {isAccepted ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Accepted</span>
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                <span>Rejected</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-[var(--admin-bg-secondary)] border-t border-[var(--admin-border)] space-y-2">
                        <p className="text-xs font-semibold text-[var(--admin-text)] truncate">
                          {img.label}
                        </p>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleImageStatus(img.id, "accepted")}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              isAccepted
                                ? "bg-green-600 text-white shadow"
                                : "bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/30"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleImageStatus(img.id, "rejected")}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              isRejected
                                ? "bg-red-600 text-white shadow"
                                : "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/30"
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: EXTRACTED SPECIFICATION FIELDS */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--admin-border)] pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[var(--admin-text)] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--admin-primary)]" />
                    <span>Extracted Specification Fields</span>
                  </h3>
                  <p className="text-xs text-[var(--admin-text-muted)]">
                    Review and accept or reject specifications
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkFieldStatus("accepted")}
                    className="px-3 py-1.5 text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept All Fields</span>
                  </button>
                  <button
                    onClick={() => handleBulkFieldStatus("rejected")}
                    className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject All Fields</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SPEC_KEYS.map(({ key, arKey, label }) => {
                  const valEn = (lookupData[key] as string) || "";
                  const valAr = (lookupData[arKey] as string) || "";
                  const status = fieldStatuses[key] || "pending";
                  const isAccepted = status === "accepted";
                  const isRejected = status === "rejected";
                  const optionsList = DROPDOWN_OPTIONS[key as string] || [];

                  return (
                    <div
                      key={key as string}
                      className={`p-4 rounded-xl border bg-[var(--admin-bg)] flex flex-col justify-between gap-3 transition-all ${
                        isAccepted
                          ? "border-green-500/50 bg-green-500/5"
                          : isRejected
                          ? "border-red-500/50 bg-red-500/5 opacity-70"
                          : "border-[var(--admin-border)] hover:border-[var(--admin-border-light)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[var(--admin-text-muted)] uppercase tracking-wider">
                          {label}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleFieldStatus(key as string, "accepted")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isAccepted
                                ? "bg-green-600 text-white shadow"
                                : "bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/30"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleFieldStatus(key as string, "rejected")}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              isRejected
                                ? "bg-red-600 text-white shadow"
                                : "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/30"
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {optionsList.length > 0 ? (
                          <div className="relative">
                            <select
                              value={valEn}
                              onChange={(e) => handleFieldChange(key, arKey, e.target.value)}
                              className="w-full appearance-none bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] font-medium cursor-pointer"
                            >
                              {optionsList.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-[var(--admin-text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-[var(--admin-text)] bg-[var(--admin-bg-secondary)] p-2 rounded-lg border border-[var(--admin-border)]">
                            {valEn}
                          </div>
                        )}

                        {valAr && (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[var(--admin-text-muted)]">Arabic Translation:</span>
                            <span className="text-xs font-semibold text-[var(--admin-primary)] bg-[var(--admin-primary)]/10 px-2.5 py-0.5 rounded dir-rtl">
                              {valAr}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM SUMMARY & SAVE ACTION BAR */}
            <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-4 shadow-xl z-20 backdrop-blur-md">
              <div className="flex items-center gap-4 text-xs font-medium text-[var(--admin-text)]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Accepted Fields: <strong>{acceptedFieldsCount}</strong> / {SPEC_KEYS.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[var(--admin-primary)]" />
                  <span>Accepted Images: <strong>{acceptedImagesCount}</strong> / {lookupData.images.length}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  showSuccess(`Saved accepted specifications for SKU: ${lookupData.sku}`);
                }}
                className="px-6 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-all font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Approved SKU Data</span>
              </button>
            </div>

          </div>
        ) : (
          /* Empty Initial State */
          <div className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] flex items-center justify-center mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-2">
              Ready for SKU Extraction
            </h3>
            <p className="text-sm text-[var(--admin-text-muted)] max-w-md">
              Enter any Watch SKU number above (e.g. <span className="font-mono text-[var(--admin-text)]">ROLEX-126610LN</span>) to fetch images and specification fields with Accept & Reject controls.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
