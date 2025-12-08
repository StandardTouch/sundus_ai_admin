import { useTheme } from "@/contexts/ThemeContext";

interface LoginLogoProps {
  size?: "mobile" | "desktop";
}

export default function LoginLogo({ size = "desktop" }: LoginLogoProps) {
  const { theme } = useTheme();

  if (size === "mobile") {
    return (
      <div className="flex justify-center mb-6 lg:hidden">
        <img
          src={theme === "dark" ? "/logo_dark.png" : "/logo_light.png"}
          alt="Logo"
          className="h-24 sm:h-32 w-auto"
        />
      </div>
    );
  }

  return (
    <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8" style={{ backgroundColor: theme === "dark" ? "#000000" : "#ffffff" }}>
      <div className="text-center">
        <img
          src={theme === "dark" ? "/logo_dark.png" : "/logo_light.png"}
          alt="Logo"
          className="h-64 lg:h-80 xl:h-96 w-auto mx-auto"
        />
      </div>
    </div>
  );
}

