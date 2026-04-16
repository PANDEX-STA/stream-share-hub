import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "María G.", text: "Llevo 6 meses con mi perfil de HBO Max y nunca he tenido problemas. Súper recomendado.", rating: 5 },
  { name: "Carlos R.", text: "Excelente servicio, el soporte responde al instante. Mi Prime Video funciona perfecto.", rating: 5 },
  { name: "Ana L.", text: "Al principio dudé, pero ya van 4 meses y todo genial. El precio es increíble.", rating: 5 },
  { name: "Diego M.", text: "Rápido, confiable y barato. ¿Qué más se puede pedir? 100% recomendado.", rating: 5 },
];

const TestimonialsSection = () => (
  <section className="py-24 px-4 relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(4,90%,55%,0.04),_transparent_60%)]" />
    <div className="max-w-5xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4">
          Lo que dicen nuestros <span className="text-gradient">clientes</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-card border border-border rounded-2xl p-6"
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-secondary-foreground mb-4 leading-relaxed">"{t.text}"</p>
            <p className="font-semibold font-heading text-sm">{t.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
