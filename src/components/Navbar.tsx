import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogIn, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const waUrl = buildWhatsAppUrl();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-heading font-bold text-xl">
          Stream<span className="text-gradient">Zone</span>
        </Link>

        <div className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
          <a href="/#servicios" className="hover:text-foreground transition-colors">
            Servicios
          </a>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-foreground hover:text-accent transition-colors"
            >
              <ShieldCheck className="w-4 h-4" /> Admin
            </Link>
          )}
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-secondary/70 text-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Mi panel
            </Link>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-secondary/70 text-foreground hover:bg-muted transition-colors"
            >
              <LogIn className="w-4 h-4" /> Entrar
            </Link>
          )}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-primary text-primary-foreground font-semibold px-5 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            Comprar ahora
          </a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setOpen(!open)}
            className="text-foreground"
            aria-label="Menú"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <a
            href="/#servicios"
            onClick={() => setOpen(false)}
            className="block text-muted-foreground hover:text-foreground"
          >
            Servicios
          </a>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-secondary/70 text-foreground"
            >
              <ShieldCheck className="w-4 h-4" /> Panel admin
            </Link>
          )}
          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-secondary/70 text-foreground"
            >
              <LayoutDashboard className="w-4 h-4" /> Mi panel
            </Link>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-secondary/70 text-foreground"
            >
              <LogIn className="w-4 h-4" /> Iniciar sesión
            </Link>
          )}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg text-center"
          >
            Comprar ahora
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
