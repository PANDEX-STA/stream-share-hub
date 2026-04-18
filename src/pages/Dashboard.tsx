import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LogOut,
  Crown,
  Star,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShoppingCart,
  Upload,
  MessageCircle,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Order {
  id: string;
  service_slug: string;
  service_name: string;
  price: number;
  status: "pendiente" | "activo" | "expirado" | "cancelado";
  payment_method: string | null;
  receipt_path: string | null;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const serviceIcon = (name: string) =>
  name.toLowerCase().includes("hbo") ? Crown : Star;

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

const statusBadge = {
  pendiente: {
    label: "Pendiente",
    cls: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    Icon: Clock,
  },
  activo: {
    label: "Activo",
    cls: "text-accent bg-accent/10 border-accent/30",
    Icon: CheckCircle2,
  },
  expirado: {
    label: "Expirado",
    cls: "text-destructive bg-destructive/10 border-destructive/30",
    Icon: XCircle,
  },
  cancelado: {
    label: "Cancelado",
    cls: "text-muted-foreground bg-muted/40 border-border",
    Icon: XCircle,
  },
} as const;

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  const loadOrders = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) toast.error("No se pudieron cargar tus pedidos");
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setFullName(data.full_name);
      });
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleUploadReceipt = async (
    order: Order,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Solo se aceptan imágenes JPG o PNG");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen es muy grande (máx 5MB)");
      return;
    }
    setUploadingFor(order.id);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${Date.now()}-${order.id}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("receipts")
        .upload(path, file, { contentType: file.type });
      if (upErr) {
        toast.error("No se pudo subir el comprobante");
        return;
      }
      const { error: updErr } = await supabase
        .from("orders")
        .update({ receipt_path: path })
        .eq("id", order.id);
      if (updErr) {
        toast.error("No se pudo asociar el comprobante");
        return;
      }
      toast.success("Comprobante enviado al administrador");
      await loadOrders();
    } finally {
      setUploadingFor(null);
      e.target.value = "";
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const supportUrl = buildWhatsAppUrl(
    "Hola, necesito ayuda con mi pedido en StreamZone.",
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Cargando tu panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-heading font-bold text-foreground">
              Stream<span className="text-gradient">Zone</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-sm text-foreground bg-primary/10 border border-primary/30 px-3 py-2 rounded-lg hover:bg-primary/20"
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </Link>
            )}
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
          className="mb-8 flex items-end justify-between flex-wrap gap-3"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-1">
              Hola, {fullName || "amig@"} 👋
            </h1>
            <p className="text-muted-foreground">
              Aquí están tus pedidos y su estado actual.
            </p>
          </div>
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-secondary/70 text-foreground text-sm hover:bg-muted"
          >
            <MessageCircle className="w-4 h-4 text-accent" /> Contactar soporte
          </a>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-card border border-border rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-lg font-bold font-heading mb-2">
              Aún no tienes pedidos
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Elige un servicio y empieza tu suscripción.
            </p>
            <Link
              to="/#servicios"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-transform"
            >
              <ShoppingCart className="w-4 h-4" /> Ver planes
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {orders.map((o, i) => {
              const Icon = serviceIcon(o.service_name);
              const badge = statusBadge[o.status];
              const StatusIcon = badge.Icon;

              return (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gradient-card border border-border rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-foreground">
                          {o.service_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          S/ {Number(o.price).toFixed(2)} / mes
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badge.cls} flex items-center gap-1`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {badge.label}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm mb-4">
                    <p className="text-muted-foreground">
                      Fecha de compra:{" "}
                      <span className="text-foreground font-medium">
                        {formatDate(o.created_at)}
                      </span>
                    </p>
                    {o.payment_method && (
                      <p className="text-muted-foreground">
                        Método:{" "}
                        <span className="text-foreground font-medium">
                          {o.payment_method}
                        </span>
                      </p>
                    )}
                    {o.status === "activo" && o.expires_at && (
                      <p className="text-muted-foreground">
                        Vence:{" "}
                        <span className="text-foreground font-medium">
                          {formatDate(o.expires_at)}
                        </span>
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      Comprobante:{" "}
                      <span className="text-foreground font-medium">
                        {o.receipt_path ? "Enviado ✓" : "Pendiente"}
                      </span>
                    </p>
                  </div>

                  {!o.receipt_path && o.status === "pendiente" && (
                    <label className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground cursor-pointer transition-colors">
                      {uploadingFor === o.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Subiendo...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" /> Subir comprobante
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        disabled={uploadingFor === o.id}
                        onChange={(e) => handleUploadReceipt(o, e)}
                      />
                    </label>
                  )}
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
