import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="#" className="font-heading font-bold text-xl">
          Stream<span className="text-gradient">Zone</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#servicios" className="hover:text-foreground transition-colors">Servicios</a>
          <a href="#" className="hover:text-foreground transition-colors">Beneficios</a>
          <a
            href="https://wa.me/51999999999?text=Hola,%20quiero%20un%20perfil"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-primary text-primary-foreground font-semibold px-5 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            Comprar ahora
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <a href="#servicios" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-foreground">Servicios</a>
          <a
            href="https://wa.me/51999999999?text=Hola,%20quiero%20un%20perfil"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-primary text-primary-foreground font-semibold px-5 py-2 rounded-lg text-center"
          >
            Comprar ahora
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
