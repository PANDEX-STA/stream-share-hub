import { motion } from "framer-motion";
import { AlertTriangle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { inventory } from "@/lib/inventory";

const meta: Record<string, { color: string }> = {
  "HBO Max": { color: "hsl(265, 80%, 60%)" },
  "Amazon Prime Video": { color: "hsl(200, 90%, 55%)" },
};

const AvailabilityCounter = () => {
  const [, force] = useState(0);

  useEffect(() => {
    const unsub = inventory.subscribe(() => force((v) => v + 1));
    return () => {
      unsub();
    };
  }, []);

  const items = Object.entries(inventory.all());

  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-card border border-primary/30 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Disponibilidad en tiempo real
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {items.map(([name, s]) => {
              const pct = s.total ? (s.available / s.total) * 100 : 0;
              const color = meta[name]?.color ?? "hsl(var(--accent))";
              const lowStock = s.available <= 2;
              return (
                <div
                  key={name}
                  className="bg-secondary/50 rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-semibold text-foreground">
                      {name}
                    </span>
                    <div
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color }}
                    >
                      <Users className="w-3.5 h-3.5" />
                      {s.available}/{s.total}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {s.available === 0
                      ? "❌ Agotado por hoy"
                      : lowStock
                      ? `⚠️ ¡Quedan solo ${s.available} perfiles!`
                      : `${s.available} perfiles disponibles`}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AvailabilityCounter;
