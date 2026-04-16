import { motion } from "framer-motion";
import { Shield, CheckCircle, Headphones, Lock, Zap, Award } from "lucide-react";

const badges = [
  { icon: Shield, label: "Pago seguro", desc: "Tus datos protegidos" },
  { icon: CheckCircle, label: "Acceso garantizado", desc: "O te devolvemos tu dinero" },
  { icon: Headphones, label: "Soporte 24/7", desc: "Siempre disponibles" },
  { icon: Lock, label: "Perfil privado", desc: "Solo tú tienes acceso" },
  { icon: Zap, label: "Activación inmediata", desc: "En menos de 5 minutos" },
  { icon: Award, label: "+500 clientes", desc: "Nos recomiendan" },
];

const TrustBadges = () => (
  <section className="py-16 px-4">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2">
          ¿Por qué <span className="text-gradient">elegirnos</span>?
        </h2>
        <p className="text-muted-foreground">Tu satisfacción es nuestra prioridad</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="bg-gradient-card border border-border rounded-xl p-4 text-center hover:border-primary/30 transition-colors"
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
              <b.icon className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm font-semibold text-foreground">{b.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBadges;
