import { motion } from "framer-motion";
import { Check, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "@/lib/services";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const ServicesSection = () => {
  return (
    <section id="servicios" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4">
            Nuestros <span className="text-gradient">Servicios</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Conoce los detalles de cada plan y las reseñas reales de nuestros
            usuarios antes de comprar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative group"
            >
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Más popular
                  </span>
                </div>
              )}
              <div
                className={`bg-gradient-card border rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-glow flex flex-col ${
                  service.popular ? "border-primary/40" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <service.icon
                      className="w-6 h-6"
                      style={{ color: service.color }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {service.plan}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold font-heading">
                    {service.price}
                  </span>
                  <span className="text-muted-foreground">{service.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-secondary-foreground"
                    >
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2.5">
                  <Link
                    to={`/servicio/${service.slug}`}
                    className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all ${
                      service.popular
                        ? "bg-gradient-primary text-primary-foreground shadow-glow hover:scale-[1.02]"
                        : "bg-secondary text-secondary-foreground border border-border hover:bg-muted"
                    }`}
                  >
                    Ver detalles y comprar
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={buildWhatsAppUrl(
                      `Hola, quiero comprar un perfil de ${service.name}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl border border-border bg-secondary/40 text-secondary-foreground hover:bg-muted transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-accent" />
                    Comprar por WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Cada compra crea un pedido en estado <strong>Pendiente</strong>. Tu
          acceso se activa cuando validamos manualmente tu comprobante.
        </p>
      </div>
    </section>
  );
};

export default ServicesSection;
