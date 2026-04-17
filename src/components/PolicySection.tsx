import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle } from "lucide-react";

const policies = [
  "No cambiar la contraseña de la cuenta.",
  "Uso personal e intransferible (1 perfil por persona).",
  "No compartir credenciales con terceros.",
  "El pago se realiza de forma mensual antes del vencimiento.",
  "Servicio cancelable en cualquier momento sin penalidad.",
];

const PolicySection = () => (
  <section className="py-12 px-4">
    <div className="max-w-3xl mx-auto space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-card border border-accent/30 rounded-2xl p-6 sm:p-8 flex gap-4"
      >
        <ShieldCheck className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-bold font-heading text-foreground mb-1">
            Garantía de acceso o devolución
          </h3>
          <p className="text-sm text-muted-foreground">
            Si tu perfil no funciona en las primeras 24 horas, te reembolsamos o
            te lo reemplazamos sin preguntas. Soporte rápido por WhatsApp.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-card border border-border rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-bold font-heading text-foreground">
            Términos y condiciones de uso
          </h3>
        </div>
        <ul className="space-y-2">
          {policies.map((p, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-accent font-bold">•</span>
              {p}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
);

export default PolicySection;
