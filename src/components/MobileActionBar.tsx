import { ShoppingCart, LayoutGrid } from "lucide-react";
import { useSound } from "@/hooks/useSound";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const MobileActionBar = () => {
  const { play } = useSound();
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            play("click");
            scrollTo("servicios");
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-secondary/70 text-foreground font-medium text-sm"
        >
          <LayoutGrid className="w-4 h-4" /> Ver planes
        </button>
        <button
          onClick={() => {
            play("click");
            scrollTo("servicios");
          }}
          className="flex-[1.3] flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow"
        >
          <ShoppingCart className="w-4 h-4" /> Comprar ahora
        </button>
      </div>
    </div>
  );
};

export default MobileActionBar;
