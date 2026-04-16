import { motion } from "framer-motion";
import { Shield, User, CreditCard, Headphones, Clock } from "lucide-react";

const benefits = [
  { icon: Shield, title: "Acceso 100% seguro", desc: "Tus datos y perfil están protegidos en todo momento" },
  { icon: User, title: "Perfil personal", desc: "Tu propio perfil, sin compartir con extraños" },
  { icon: CreditCard, title: "Pago mensual", desc: "Sin contratos, cancela cuando quieras" },
  { icon: Headphones, title: "Soporte rápido", desc: "Respuesta en menos de 1 hora por WhatsApp" },
  { icon: Clock, title: "Cupos limitados", desc: "Asegura tu lugar antes de que se agoten" },
];

const BenefitsSection = () => (
  <section className="py-24 px-4 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(24,100%,55%,0.06),_transparent_60%)]" />
    <div className="max-w-5xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4">
          ¿Por qué <span className="text-gradient">elegirnos</span>?
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Más de 500 clientes confían en nosotros cada mes
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <b.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold font-heading text-lg mb-2">{b.title}</h3>
            <p className="text-muted-foreground text-sm">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
