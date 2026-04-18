import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShoppingCart, MessageCircle, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileActionBar from "@/components/MobileActionBar";
import ServiceReviews from "@/components/ServiceReviews";
import PaymentModal from "@/components/PaymentModal";
import { getServiceBySlug } from "@/lib/services";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug);
  const [open, setOpen] = useState(false);

  if (!service) return <Navigate to="/" replace />;

  const Icon = service.icon;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-card border border-border rounded-3xl p-6 sm:p-10"
        >
          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${service.color}20` }}
            >
              <Icon className="w-8 h-8" style={{ color: service.color }} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold font-heading">
                {service.name}
              </h1>
              <p className="text-muted-foreground">{service.plan}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-bold text-accent">
                {service.price}
              </div>
              <p className="text-xs text-muted-foreground">{service.period}</p>
            </div>
          </div>

          <p className="text-secondary-foreground mb-6 leading-relaxed">
            {service.longDescription}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-heading font-bold text-foreground mb-3">
                Qué incluye
              </h3>
              <ul className="space-y-2">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-secondary-foreground"
                  >
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground mb-3">
                Detalles del servicio
              </h3>
              <ul className="space-y-2">
                {service.details.map((d) => (
                  <li key={d.label} className="text-sm">
                    <span className="text-muted-foreground">{d.label}:</span>{" "}
                    <span className="text-foreground font-medium">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3 mb-6">
            <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span>
              Cada compra crea un pedido en estado <strong>Pendiente</strong>.
              Validamos tu comprobante manualmente antes de activar el acceso.
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-transform"
            >
              <ShoppingCart className="w-4 h-4" /> Comprar ahora
            </button>
            <a
              href={buildWhatsAppUrl(
                `Hola, quiero comprar un perfil de ${service.name}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border bg-secondary text-secondary-foreground font-medium hover:bg-muted transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-accent" /> Comprar por WhatsApp
            </a>
          </div>
        </motion.div>

        <ServiceReviews serviceSlug={service.slug} serviceName={service.name} />
      </main>

      <Footer />
      <WhatsAppButton />
      <MobileActionBar />
      <PaymentModal
        service={open ? service : null}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default ServicePage;
