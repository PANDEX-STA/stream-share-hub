import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const HeroSection = () => {
  const waUrl = buildWhatsAppUrl();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(4,90%,55%,0.12),_transparent_60%)]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold font-heading leading-tight mb-6 mt-8"
        >
          Disfruta tus series favoritas{" "}
          <span className="text-gradient">a bajo costo</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Perfiles personales de HBO Max y Amazon Prime Video. Pago verificado
          manualmente y activación tras confirmar tu comprobante.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#servicios"
            className="bg-gradient-primary text-primary-foreground font-semibold px-8 py-4 rounded-lg text-lg shadow-glow hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Ver planes
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border bg-secondary text-secondary-foreground font-medium px-8 py-4 rounded-lg text-lg hover:bg-muted transition-colors"
          >
            Contactar por WhatsApp
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-muted-foreground text-sm"
        >
          <span>✓ Pago verificado manualmente</span>
          <span>✓ Soporte por WhatsApp</span>
          <span>✓ Sin sorpresas</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
