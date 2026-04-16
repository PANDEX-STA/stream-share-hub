import { motion } from "framer-motion";
import { MousePointerClick, Wallet, Tv } from "lucide-react";

const steps = [
  { icon: MousePointerClick, step: "01", title: "Elige tu servicio", desc: "Selecciona HBO Max o Amazon Prime Video" },
  { icon: Wallet, step: "02", title: "Realiza el pago", desc: "Pago seguro por Yape, Plin o transferencia" },
  { icon: Tv, step: "03", title: "Recibe tu acceso", desc: "En minutos tendrás tu perfil listo para usar" },
];

const HowItWorks = () => (
  <section className="py-24 px-4">
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4">
          Así de <span className="text-gradient">fácil</span>
        </h2>
        <p className="text-muted-foreground text-lg">3 simples pasos y listo</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <div className="relative inline-flex mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <s.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-xs font-bold font-heading text-accent">
                {s.step}
              </span>
            </div>
            <h3 className="font-bold font-heading text-xl mb-2">{s.title}</h3>
            <p className="text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
