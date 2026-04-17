import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const names = ["Carlos", "María", "Lucía", "Diego", "Andrea", "José", "Valeria", "Luis"];
const services = ["HBO Max", "Amazon Prime Video"];
const cities = ["Lima", "Arequipa", "Trujillo", "Cusco", "Piura", "Chiclayo"];

type Notice = { id: number; name: string; service: string; city: string };

const SocialProofToast = () => {
  const [current, setCurrent] = useState<Notice | null>(null);

  useEffect(() => {
    let id = 0;
    const show = () => {
      id += 1;
      setCurrent({
        id,
        name: names[Math.floor(Math.random() * names.length)],
        service: services[Math.floor(Math.random() * services.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
      });
      setTimeout(() => setCurrent(null), 4500);
    };
    const first = setTimeout(show, 6000);
    const interval = setInterval(show, 18000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-24 left-4 z-40 pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-xl shadow-card p-3 pr-4 flex items-center gap-3 max-w-xs"
          >
            <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-4 h-4 text-accent" />
            </div>
            <div className="text-xs">
              <p className="text-foreground font-medium">
                {current.name} de {current.city}
              </p>
              <p className="text-muted-foreground">
                acaba de comprar <span className="text-accent">{current.service}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialProofToast;
