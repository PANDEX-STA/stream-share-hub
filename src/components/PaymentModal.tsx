import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  CheckCircle,
  CreditCard,
  Smartphone,
  ArrowLeft,
  MessageCircle,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { inventory } from "@/lib/inventory";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSound } from "@/hooks/useSound";

type Service = {
  name: string;
  price: string;
  features?: string[];
};

interface Props {
  service: Service | null;
  onClose: () => void;
}

type Step = "summary" | "method" | "upload" | "form" | "done";

const WHATSAPP_NUMBER = "51999999999";
const MAX_FILE_MB = 5;

const paymentMethods = [
  { id: "yape", label: "Yape", icon: Smartphone, color: "hsl(280, 80%, 55%)" },
  { id: "plin", label: "Plin", icon: Smartphone, color: "hsl(150, 70%, 45%)" },
  { id: "card", label: "Visa / Mastercard", icon: CreditCard, color: "hsl(220, 80%, 55%)" },
];

const PaymentModal = ({ service, onClose }: Props) => {
  const [step, setStep] = useState<Step>("summary");
  const [method, setMethod] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { play } = useSound();

  // Reset state when service changes / closes
  useEffect(() => {
    if (!service) {
      setStep("summary");
      setMethod("");
      setFile(null);
      setPreview(null);
      setUploadError(null);
      setName("");
      setSending(false);
    }
  }, [service]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!service) return null;

  const goBack = () => {
    setUploadError(null);
    if (step === "method") setStep("summary");
    else if (step === "upload") setStep("method");
    else if (step === "form") setStep("upload");
  };

  const buildWaMessage = (extra?: string) => {
    const lines = [
      `Hola, quiero comprar un perfil de *${service.name}* (${service.price}/mes).`,
    ];
    if (name.trim()) lines.push(`Nombre: ${name.trim()}`);
    if (method) lines.push(`Método de pago: ${method}`);
    if (extra) lines.push(extra);
    return encodeURIComponent(lines.join("\n"));
  };

  const openWhatsApp = (extra?: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWaMessage(extra)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const f = e.target.files?.[0];
    if (!f) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(f.type)) {
      setUploadError("Formato no válido. Sube una imagen JPG o PNG.");
      setFile(null);
      setPreview(null);
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setUploadError(`La imagen es muy grande (máx ${MAX_FILE_MB}MB).`);
      setFile(null);
      setPreview(null);
      return;
    }

    try {
      const url = URL.createObjectURL(f);
      if (preview) URL.revokeObjectURL(preview);
      setFile(f);
      setPreview(url);
      toast.success("Comprobante cargado correctamente");
    } catch {
      setUploadError("No se pudo procesar la imagen. Envíala por WhatsApp.");
    }
  };

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const parsePrice = (p: string) => {
    const n = parseFloat(p.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Ingresa tu nombre");
      play("error");
      return;
    }
    setSending(true);
    play("click");
    const extra = file
      ? "Adjuntaré mi comprobante en este chat."
      : "Enviaré mi comprobante en este chat.";

    // Persist subscription if user is logged in (silent on failure)
    if (user) {
      try {
        await supabase.from("subscriptions").insert({
          user_id: user.id,
          service_name: service.name,
          price: parsePrice(service.price),
          status: "pending",
          payment_method: method || null,
        });
      } catch {
        /* ignore — checkout should not block */
      }
    }

    setTimeout(() => {
      inventory.decrement(service.name);
      setSending(false);
      setStep("done");
      play("success");
      openWhatsApp(extra);
    }, 600);
  };

  const headerTitle = {
    summary: "Resumen de tu compra",
    method: "Método de pago",
    upload: "Sube tu comprobante",
    form: "Tus datos",
    done: "¡Listo!",
  }[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border w-full max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 shadow-card relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {step !== "summary" && step !== "done" && (
                <button
                  onClick={goBack}
                  aria-label="Volver"
                  className="text-muted-foreground hover:text-foreground p-1 -ml-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h3 className="text-lg font-bold font-heading">{headerTitle}</h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mb-5">
            {service.name} · {service.price}/mes
          </p>

          {/* SUMMARY */}
          {step === "summary" && (
            <div className="space-y-4">
              <div className="bg-secondary/50 border border-border rounded-xl p-4">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-heading font-bold text-foreground">
                    {service.name}
                  </span>
                  <span className="text-2xl font-bold text-accent">
                    {service.price}
                    <span className="text-xs text-muted-foreground font-normal">
                      {" "}
                      /mes
                    </span>
                  </span>
                </div>
                {service.features && (
                  <ul className="space-y-1.5">
                    {service.features.slice(0, 4).map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3">
                <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>
                  Tu acceso se activa al confirmar el pago. Servicio mensual,
                  cancelas cuando quieras.
                </span>
              </div>

              <button
                onClick={() => setStep("method")}
                className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:scale-[1.02] transition-transform"
              >
                Confirmar compra
              </button>
              <button
                onClick={() => openWhatsApp()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-secondary text-secondary-foreground font-medium hover:bg-muted transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Comprar por WhatsApp
              </button>
              <button
                onClick={onClose}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* METHOD */}
          {step === "method" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-2">
                Elige cómo quieres pagar:
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
              <button
                onClick={() => openWhatsApp()}
                className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl border border-border bg-secondary/30 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Prefiero comprar por WhatsApp
              </button>
            </div>
          )}

          {/* UPLOAD */}
          {step === "upload" && (
            <div className="space-y-4">
              <p className="text-sm text-foreground">
                Método: <span className="font-semibold text-accent">{method}</span>
              </p>

              {(method === "Yape" || method === "Plin") && (
                <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Envía {service.price} al número:
                  </p>
                  <p className="text-2xl font-bold font-heading text-foreground">
                    999 999 999
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Titular: StreamZone
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sube tu comprobante (opcional)
                </label>

                {!preview ? (
                  <label className="flex flex-col items-center justify-center gap-2 w-full py-6 rounded-xl border border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-secondary/30">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Toca para seleccionar (JPG / PNG, máx {MAX_FILE_MB}MB)
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-border bg-secondary/30">
                    <img
                      src={preview}
                      alt="Vista previa del comprobante"
                      className="w-full max-h-56 object-contain bg-black/40"
                    />
                    <div className="flex items-center justify-between p-2.5 text-xs">
                      <span className="text-muted-foreground truncate max-w-[60%]">
                        {file?.name}
                      </span>
                      <button
                        onClick={removeFile}
                        className="text-destructive hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="mt-2 flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{uploadError}</p>
                      <button
                        onClick={() => openWhatsApp("La subida falló, te enviaré el comprobante aquí.")}
                        className="text-accent font-medium hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Enviar por WhatsApp
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  Si no puedes subir la imagen, podrás enviarla por WhatsApp luego.
                </p>
              </div>

              <button
                onClick={() => setStep("form")}
                className="w-full py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:scale-[1.02] transition-transform"
              >
                Continuar
              </button>
            </div>
          )}

          {/* FORM */}
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
                  Servicio:{" "}
                  <span className="text-foreground font-medium">{service.name}</span>
                </p>
                <p className="text-muted-foreground">
                  Pago: <span className="text-foreground font-medium">{method}</span>
                </p>
                <p className="text-muted-foreground">
                  Comprobante:{" "}
                  <span className="text-foreground font-medium">
                    {file ? "Adjuntado ✓" : "Por WhatsApp"}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Total:{" "}
                  <span className="text-accent font-bold">{service.price}</span>
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
                  </>
                ) : (
                  <>Ya pagué — Confirmar por WhatsApp</>
                )}
              </button>
            </div>
          )}

          {/* DONE */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/15 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-accent" />
              </div>
              <h4 className="text-lg font-bold font-heading text-foreground mb-2">
                ¡Pago recibido!
              </h4>
              <p className="text-sm text-muted-foreground mb-5">
                En breve recibirás tu acceso por WhatsApp. Si no se abrió la
                ventana, contáctanos directamente.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => openWhatsApp()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-muted transition-colors"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
