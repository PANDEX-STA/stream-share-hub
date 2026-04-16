import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Star, ShoppingCart } from "lucide-react";
import PaymentModal from "./PaymentModal";

const services = [
  {
    name: "HBO Max",
    plan: "Plan Premium",
    price: "S/ 8",
    period: "/mes por perfil",
    icon: Crown,
    color: "hsl(265, 80%, 60%)",
    features: [
      "Perfil personal exclusivo",
      "Acceso completo HD / 4K",
      "Contenido original HBO",
      "Máximo 5 usuarios por cuenta",
      "Soporte prioritario",
    ],
    popular: true,
  },
  {
    name: "Amazon Prime Video",
    plan: "Perfil Personal",
    price: "S/ 5",
    period: "/mes por perfil",
    icon: Star,
    color: "hsl(200, 90%, 55%)",
    features: [
      "Perfil personal exclusivo",
      "Contenido exclusivo Amazon",
      "Calidad HD disponible",
      "Máximo 6 usuarios por cuenta",
      "Soporte incluido",
    ],
    popular: false,
  },
];

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<{ name: string; price: string } | null>(null);

  return (
    <>
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
              Elige tu plataforma favorita y empieza a disfrutar hoy mismo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.name}
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
                  className={`bg-gradient-card border rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-glow ${
                    service.popular ? "border-primary/40" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <service.icon className="w-6 h-6" style={{ color: service.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-heading">{service.name}</h3>
                      <p className="text-muted-foreground text-sm">{service.plan}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <span className="text-4xl font-bold font-heading">{service.price}</span>
                    <span className="text-muted-foreground">{service.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-secondary-foreground">
                        <Check className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedService({ name: service.name, price: service.price })}
                    className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all ${
                      service.popular
                        ? "bg-gradient-primary text-primary-foreground shadow-glow hover:scale-[1.02]"
                        : "bg-secondary text-secondary-foreground border border-border hover:bg-muted"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Pagar ahora
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PaymentModal service={selectedService} onClose={() => setSelectedService(null)} />
    </>
  );
};

export default ServicesSection;
