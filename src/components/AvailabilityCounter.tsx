import { motion } from "framer-motion";
import { AlertTriangle, Users } from "lucide-react";
import { useEffect, useState } from "react";

const services = [
  { name: "HBO Max", total: 5, color: "hsl(265, 80%, 60%)" },
  { name: "Amazon Prime Video", total: 6, color: "hsl(200, 90%, 55%)" },
];

const AvailabilityCounter = () => {
  const [counts, setCounts] = useState(() =>
    services.map((s) => ({
      ...s,
      available: Math.floor(Math.random() * 2) + 1,
    }))
  );

  // Simulated subtle variation
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) =>
        prev.map((s) => ({
          ...s,
          available: Math.max(1, Math.min(s.total - 2, s.available + (Math.random() > 0.5 ? 0 : -1 + Math.floor(Math.random() * 2)))),
        }))
      );
    }, 15000);
    return () => clearInterval(interval);
  }, []);

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
            <AlertTriangle className="w-5 h-5 text-accent animate-pulse-glow" />
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Disponibilidad en tiempo real
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {counts.map((s) => {
              const pct = (s.available / s.total) * 100;
              return (
                <div
                  key={s.name}
                  className="bg-secondary/50 rounded-xl p-4 border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-semibold text-foreground">
                      {s.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: s.color }}>
                      <Users className="w-3.5 h-3.5" />
                      {s.available}/{s.total}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {s.available <= 2
                      ? "⚠️ ¡Quedan muy pocos perfiles!"
                      : "Perfiles disponibles"}
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
