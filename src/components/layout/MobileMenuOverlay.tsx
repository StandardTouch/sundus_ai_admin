interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenuOverlay({ isOpen, onClose }: MobileMenuOverlayProps) {
  if (!isOpen) return null;

  return (
    <button
      type="button"
      className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-pointer border-0 p-0"
      onClick={onClose}
      aria-label="Close menu"
    />
  );
}

