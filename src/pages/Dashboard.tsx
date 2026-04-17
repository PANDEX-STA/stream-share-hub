import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Crown,
  Star,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSound } from "@/hooks/useSound";
import SoundToggle from "@/components/SoundToggle";

interface Subscription {
  id: string;
  service_name: string;
  price: number;
  status: "active" | "pending" | "expired" | "cancelled";
  payment_method: string | null;
  starts_at: string;
  expires_at: string;
}

const WHATSAPP_NUMBER = "51999999999";

const serviceIcon = (name: string) =>
  name.toLowerCase().includes("hbo") ? Crown : Star;

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { play } = useSound();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profile }, { data: subData, error }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);
      if (profile?.full_name) setFullName(profile.full_name);
      if (error) toast.error("No se pudieron cargar tus servicios");
      setSubs((subData ?? []) as Subscription[]);
      setLoading(false);
    })();
  }, [user]);

  const handleRenew = (s: Subscription) => {
    play("click");
    const text = encodeURIComponent(
      `Hola, quiero renovar mi servicio de *${s.service_name}* (S/ ${Number(
        s.price,
      ).toFixed(2)}/mes).`,
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleSignOut = async () => {
    await signOut();
    play("click");
    navigate("/", { replace: true });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando tu panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-heading font-bold text-foreground">
              Stream<span className="text-gradient">Zone</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-1">
            Hola, {fullName || "amig@"} 👋
          </h1>
          <p className="text-muted-foreground">
            Aquí están tus servicios contratados.
          </p>
        </motion.div>

        {subs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-card border border-border rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-lg font-bold font-heading mb-2">
              Aún no tienes servicios activos
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Elige un plan y empieza a disfrutar hoy mismo.
            </p>
            <Link
              to="/#servicios"
              onClick={() => play("click")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-transform"
            >
              <ShoppingCart className="w-4 h-4" /> Ver planes
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {subs.map((s, i) => {
              const Icon = serviceIcon(s.service_name);
              const expires = new Date(s.expires_at);
              const daysLeft = Math.ceil(
                (expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
              );
              const isActive = s.status === "active" && daysLeft > 0;
              const statusLabel = isActive
                ? "Activo"
                : s.status === "pending"
                  ? "Pendiente"
                  : "Vencido";
              const statusColor = isActive
                ? "text-accent bg-accent/10 border-accent/30"
                : s.status === "pending"
                  ? "text-amber-400 bg-amber-400/10 border-amber-400/30"
                  : "text-destructive bg-destructive/10 border-destructive/30";

              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-gradient-card border border-border rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-foreground">
                          {s.service_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          S/ {Number(s.price).toFixed(2)} / mes
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColor} flex items-center gap-1`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {statusLabel}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm mb-5">
                    <p className="text-muted-foreground">
                      Vence:{" "}
                      <span className="text-foreground font-medium">
                        {expires.toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    {isActive && daysLeft <= 7 && (
                      <p className="text-xs text-amber-400">
                        ⚠️ Quedan {daysLeft} día{daysLeft === 1 ? "" : "s"}.
                        Renueva pronto.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleRenew(s)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:scale-[1.02] transition-transform"
                  >
                    <RefreshCw className="w-4 h-4" /> Renovar ahora
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
