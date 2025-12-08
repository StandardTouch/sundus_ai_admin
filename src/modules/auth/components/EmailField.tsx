import { Mail } from "lucide-react";

interface EmailFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
}

export default function EmailField({ id, name, value, onChange, onBlur, error, touched }: EmailFieldProps) {
  // Both modes: white text on secondary background
  const inputBg = "bg-white/10";
  const inputText = "text-white placeholder:text-white/60";
  const borderColor = "border-white/20";
  const focusRing = "focus:ring-white/50";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
        Email Address
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white z-10 pointer-events-none" strokeWidth={2} />
        <input
          id={id}
          name={name}
          type="email"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border rounded-lg ${inputText} focus:outline-none focus:ring-2 transition-all ${
            touched && error
              ? "border-red-500 focus:ring-red-500"
              : `${borderColor} ${focusRing}`
          }`}
          placeholder="Enter your email"
        />
      </div>
      {touched && error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

