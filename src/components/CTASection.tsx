import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const CTASection = () => {
  const waUrl = buildWhatsAppUrl();

  return (
    <section className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center bg-gradient-card border border-primary/30 rounded-3xl p-10 sm:p-16 shadow-glow relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(4,90%,55%,0.08),_transparent_70%)]" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4">
            ¿Listo para empezar tu <span className="text-gradient">perfil</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Escríbenos por WhatsApp y te guiamos en el proceso de compra y
            activación paso a paso.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground font-bold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-[0_0_30px_-5px_hsl(142,70%,45%,0.4)]"
          >
            <MessageCircle className="w-6 h-6" />
            Escribir por WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
