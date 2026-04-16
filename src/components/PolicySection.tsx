import { motion } from "framer-motion";

const policies = [
  "Los perfiles son de uso personal e intransferible.",
  "El pago se realiza de forma mensual antes de la fecha de vencimiento.",
  "No compartir credenciales con terceros.",
  "El servicio puede ser cancelado en cualquier momento sin penalidad.",
  "StreamZone no es responsable por cambios en las plataformas originales.",
];

const PolicySection = () => (
  <section className="py-12 px-4">
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-card border border-border rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-lg font-bold font-heading text-foreground mb-4">
          📋 Políticas de uso
        </h3>
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
