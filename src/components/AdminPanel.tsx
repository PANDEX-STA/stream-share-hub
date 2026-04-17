import { motion } from "framer-motion";
import { LayoutDashboard, CheckCircle2, Clock } from "lucide-react";

const clients = [
  { name: "Carlos M.", service: "HBO Max", status: "Pagado" },
  { name: "María G.", service: "Amazon Prime Video", status: "Pagado" },
  { name: "Diego R.", service: "HBO Max", status: "Pendiente" },
  { name: "Lucía P.", service: "Amazon Prime Video", status: "Pagado" },
  { name: "Andrea V.", service: "HBO Max", status: "Pendiente" },
];

const AdminPanel = () => (
  <section className="py-16 px-4">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-3">
          <LayoutDashboard className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Panel interno
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading">
          Clientes <span className="text-gradient">activos</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Vista pública (datos de muestra) — así organizamos cada compra
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="hidden sm:grid grid-cols-3 gap-4 px-5 py-3 bg-secondary/60 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Cliente</span>
          <span>Servicio</span>
          <span>Estado</span>
        </div>
        <ul>
          {clients.map((c, i) => (
            <li
              key={i}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 px-5 py-3.5 border-b border-border last:border-b-0 text-sm"
            >
              <span className="font-medium text-foreground">{c.name}</span>
              <span className="text-muted-foreground">{c.service}</span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  c.status === "Pagado" ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {c.status === "Pagado" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
                {c.status}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);

export default AdminPanel;
