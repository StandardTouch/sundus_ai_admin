import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  label?: string;
}

export default function PasswordField({ id, name, value, onChange, onBlur, error, touched, label = "Password" }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Both modes: white text on secondary background
  const inputBg = "bg-white/10";
  const inputText = "text-white placeholder:text-white/60";
  const borderColor = "border-white/20";
  const focusRing = "focus:ring-white/50";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white z-10 pointer-events-none" strokeWidth={2} />
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full pl-10 pr-12 py-2.5 ${inputBg} border rounded-lg ${inputText} focus:outline-none focus:ring-2 transition-all ${
            touched && error
              ? "border-red-500 focus:ring-red-500"
              : `${borderColor} ${focusRing}`
          }`}
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-white/80 transition-colors cursor-pointer z-10"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-5 h-5 text-white" strokeWidth={2} /> : <Eye className="w-5 h-5 text-white" strokeWidth={2} />}
        </button>
      </div>
      {touched && error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
