import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";

interface AdminOrder {
  id: string;
  user_id: string;
  service_name: string;
  service_slug: string;
  price: number;
  status: "pendiente" | "activo" | "expirado" | "cancelado";
  payment_method: string | null;
  receipt_path: string | null;
  customer_contact: string | null;
  created_at: string;
  expires_at: string | null;
}

interface ProfileLite {
  id: string;
  full_name: string | null;
  email: string | null;
}

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const statusColors: Record<AdminOrder["status"], string> = {
  pendiente: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  activo: "text-accent bg-accent/10 border-accent/30",
  expirado: "text-destructive bg-destructive/10 border-destructive/30",
  cancelado: "text-muted-foreground bg-muted/40 border-border",
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AdminOrder["status"] | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  const loadAll = async () => {
    setLoading(true);
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("No se pudieron cargar los pedidos");
      setLoading(false);
      return;
    }
    const list = (ordersData ?? []) as AdminOrder[];
    setOrders(list);

    const userIds = [...new Set(list.map((o) => o.user_id))];
    if (userIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      const map: Record<string, ProfileLite> = {};
      (profs ?? []).forEach((p) => {
        map[p.id] = p as ProfileLite;
      });
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin]);

  const updateStatus = async (
    id: string,
    status: AdminOrder["status"],
  ) => {
    setUpdatingId(id);
    const updates: Record<string, unknown> = { status };
    if (status === "activo") {
      const now = new Date();
      const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      updates.starts_at = now.toISOString();
      updates.expires_at = expires.toISOString();
    }
    const { error } = await supabase.from("orders").update(updates).eq("id", id);
    setUpdatingId(null);
    if (error) {
      toast.error("No se pudo actualizar");
      return;
    }
    toast.success(`Estado actualizado: ${status}`);
    await loadAll();
  };

  const viewReceipt = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("receipts")
      .createSignedUrl(path, 60 * 5);
    if (error || !data?.signedUrl) {
      toast.error("No se pudo abrir el comprobante");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Verificando acceso...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-gradient-card border border-border rounded-2xl p-8">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h1 className="text-xl font-bold font-heading mb-2">
            Acceso restringido
          </h1>
          <p className="text-sm text-muted-foreground mb-5">
            Esta sección es solo para administradores.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    pendiente: orders.filter((o) => o.status === "pendiente").length,
    activo: orders.filter((o) => o.status === "activo").length,
    expirado: orders.filter((o) => o.status === "expirado").length,
    cancelado: orders.filter((o) => o.status === "cancelado").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-heading font-bold text-foreground">
              Stream<span className="text-gradient">Zone</span> · Admin
            </span>
          </Link>
          <button
            onClick={loadAll}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary"
          >
            <RefreshCw className="w-4 h-4" /> Actualizar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-1">
            Panel de administración
          </h1>
          <p className="text-muted-foreground text-sm">
            Gestiona pedidos, valida comprobantes y activa servicios.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "pendiente", "activo", "expirado", "cancelado"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  filter === f
                    ? "bg-gradient-primary text-primary-foreground border-transparent"
                    : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {f === "all" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}{" "}
                ({counts[f]})
              </button>
            ),
          )}
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">
            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
            Cargando pedidos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 border border-dashed border-border rounded-2xl">
            No hay pedidos en esta categoría.
          </div>
        ) : (
          <div className="bg-gradient-card border border-border rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-secondary/60 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="col-span-3">Cliente</span>
              <span className="col-span-2">Servicio</span>
              <span className="col-span-1">Pago</span>
              <span className="col-span-2">Fecha</span>
              <span className="col-span-1">Estado</span>
              <span className="col-span-3 text-right">Acciones</span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((o) => {
                const profile = profiles[o.user_id];
                return (
                  <li
                    key={o.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 text-sm"
                  >
                    <div className="md:col-span-3">
                      <p className="font-medium text-foreground">
                        {profile?.full_name || "Sin nombre"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {profile?.email || o.user_id.slice(0, 8) + "…"}
                      </p>
                      {o.customer_contact && (
                        <p className="text-xs text-muted-foreground">
                          {o.customer_contact}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-foreground">{o.service_name}</p>
                      <p className="text-xs text-muted-foreground">
                        S/ {Number(o.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="md:col-span-1 text-muted-foreground text-xs">
                      {o.payment_method || "—"}
                    </div>
                    <div className="md:col-span-2 text-muted-foreground text-xs">
                      {formatDate(o.created_at)}
                    </div>
                    <div className="md:col-span-1">
                      <span
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full border inline-block ${statusColors[o.status]}`}
                      >
                        {o.status}
                      </span>
                    </div>
                    <div className="md:col-span-3 flex flex-wrap gap-1.5 md:justify-end">
                      {o.receipt_path ? (
                        <button
                          onClick={() => viewReceipt(o.receipt_path!)}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-border bg-secondary/50 text-foreground hover:bg-muted"
                        >
                          <Eye className="w-3.5 h-3.5" /> Comprobante
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground italic px-2 py-1.5">
                          sin comprobante
                        </span>
                      )}
                      {o.status !== "activo" && (
                        <button
                          disabled={updatingId === o.id}
                          onClick={() => updateStatus(o.id, "activo")}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Activar
                        </button>
                      )}
                      {o.status !== "pendiente" && (
                        <button
                          disabled={updatingId === o.id}
                          onClick={() => updateStatus(o.id, "pendiente")}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 hover:bg-amber-400/20 disabled:opacity-50"
                        >
                          <Clock className="w-3.5 h-3.5" /> Pendiente
                        </button>
                      )}
                      {o.status !== "cancelado" && (
                        <button
                          disabled={updatingId === o.id}
                          onClick={() => updateStatus(o.id, "cancelado")}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancelar
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
