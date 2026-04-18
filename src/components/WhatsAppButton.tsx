import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-card w-72"
          >
            <p className="text-foreground font-semibold text-sm mb-1">
              💬 ¿En qué podemos ayudarte?
            </p>
            <p className="text-muted-foreground text-xs mb-4">
              Te respondemos por WhatsApp para resolver dudas y guiarte en la
              compra.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-primary-foreground"
              style={{ background: "hsl(142, 70%, 45%)" }}
            >
              <MessageCircle className="w-4 h-4" />
              Escribir por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground shadow-lg transition-transform hover:scale-110"
        style={{ background: "hsl(142, 70%, 45%)" }}
        aria-label="Chat por WhatsApp"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
