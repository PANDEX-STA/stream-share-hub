import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/hooks/useSound";

const SoundToggle = () => {
  const { enabled, toggle, play } = useSound();
  return (
    <button
      onClick={() => {
        toggle();
        // Confirm new state with a tone (only audible if turning on)
        setTimeout(() => play("click"), 30);
      }}
      aria-label={enabled ? "Desactivar sonido" : "Activar sonido"}
      title={enabled ? "Sonido activado" : "Sonido silenciado"}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/70 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {enabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </button>
  );
};

export default SoundToggle;
