import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";

type Service = { name: string; price: string };

interface Props {
  service: Service | null;
  onClose: () => void;
}

const paymentMethods = [
  { id: "yape", label: "Yape", icon: Smartphone, color: "hsl(280, 80%, 55%)" },
  { id: "plin", label: "Plin", icon: Smartphone, color: "hsl(150, 70%, 45%)" },
  { id: "card", label: "Visa / Mastercard", icon: CreditCard, color: "hsl(220, 80%, 55%)" },
];

const PaymentModal = ({ service, onClose }: Props) => {
  const [step, setStep] = useState<"method" | "upload" | "form" | "done">("method");
  const [method, setMethod] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);

  if (!service) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Ingresa tu nombre");
      return;
    }
    setSending(true);

    // Build WhatsApp message
    const msg = encodeURIComponent(
      `Hola, quiero un perfil de *${service.name}* (${service.price}/mes).\n` +
      `Nombre: ${name.trim()}\n` +
      `Método de pago: ${method}\n` +
      `${file ? "Adjuntaré mi comprobante." : "Enviaré mi comprobante después."}`
    );
    const url = `https://wa.me/51999999999?text=${msg}`;

    setTimeout(() => {
      setSending(false);
      setStep("done");
      window.open(url, "_blank");
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-card relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold font-heading mb-1">{service.name}</h3>
          <p className="text-muted-foreground text-sm mb-6">
            {service.price} /mes por perfil
          </p>

          {step === "method" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground mb-2">
                Elige tu método de pago:
              </p>
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => {
                    setMethod(pm.label);
                    setStep("upload");
                  }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-border bg-secondary/50 hover:border-primary/40 transition-colors text-left"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${pm.color}20` }}
                  >
                    <pm.icon className="w-5 h-5" style={{ color: pm.color }} />
                  </div>
                  <span className="font-medium text-foreground">{pm.label}</span>
                </button>
              ))}
            </div>
          )}

          {step === "upload" && (
            <div className="space-y-4">
              <p className="text-sm text-foreground">
                Método: <span className="font-semibold text-accent">{method}</span>
              </p>

              {(method === "Yape" || method === "Plin") && (
                <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Envía {service.price} al número:</p>
                  <p className="text-2xl font-bold font-heading text-foreground">999 999 999</p>
                  <p className="text-xs text-muted-foreground mt-1">Titular: StreamZone</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sube tu comprobante (opcional):
                </label>
                <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-secondary/30">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {file ? file.name : "Seleccionar imagen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <button
                onClick={() => setStep("form")}
                className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:scale-[1.02] transition-transform"
              >
                Continuar
              </button>
            </div>
          )}

          {step === "form" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Tu nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  maxLength={100}
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                />
              </div>

              <div className="bg-secondary/50 border border-border rounded-xl p-3 text-sm space-y-1">
                <p className="text-muted-foreground">
                  Servicio: <span className="text-foreground font-medium">{service.name}</span>
                </p>
                <p className="text-muted-foreground">
                  Pago: <span className="text-foreground font-medium">{method}</span>
                </p>
                <p className="text-muted-foreground">
                  Total: <span className="text-accent font-bold">{service.price}</span>
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {sending ? "Enviando..." : "Confirmar y enviar por WhatsApp"}
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" />
              <h4 className="text-lg font-bold font-heading text-foreground mb-2">
                ¡Solicitud enviada!
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Te contactaremos por WhatsApp para activar tu perfil en minutos.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-muted transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
