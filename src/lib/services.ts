import { Crown, Star, type LucideIcon } from "lucide-react";

export interface ServiceData {
  slug: string;
  name: string;
  plan: string;
  price: string;
  priceNumber: number;
  period: string;
  icon: LucideIcon;
  color: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  details: { label: string; value: string }[];
  popular?: boolean;
}

export const services: ServiceData[] = [
  {
    slug: "hbo-max",
    name: "HBO Max",
    plan: "Plan Premium",
    price: "S/ 8",
    priceNumber: 8,
    period: "/mes por perfil",
    icon: Crown,
    color: "hsl(265, 80%, 60%)",
    shortDescription:
      "Perfil personal exclusivo en HBO Max con acceso completo HD/4K.",
    longDescription:
      "Disfruta del catálogo completo de HBO Max desde tu propio perfil personal. Películas, series originales, documentales y producciones exclusivas en calidad HD y 4K. Cuenta compartida con un máximo de 5 usuarios, cada uno con su perfil independiente.",
    features: [
      "Perfil personal exclusivo",
      "Acceso completo HD / 4K",
      "Contenido original HBO",
      "Máximo 5 usuarios por cuenta",
      "Soporte por WhatsApp",
    ],
    details: [
      { label: "Duración", value: "30 días desde la activación" },
      { label: "Renovación", value: "Mensual, sin compromiso" },
      { label: "Dispositivos", value: "TV, móvil, tablet, PC" },
      { label: "Activación", value: "Tras validación del pago" },
    ],
    popular: true,
  },
  {
    slug: "prime-video",
    name: "Amazon Prime Video",
    plan: "Perfil Personal",
    price: "S/ 5",
    priceNumber: 5,
    period: "/mes por perfil",
    icon: Star,
    color: "hsl(200, 90%, 55%)",
    shortDescription:
      "Tu propio perfil en Amazon Prime Video al mejor precio.",
    longDescription:
      "Accede a Amazon Prime Video con un perfil personal dentro de una cuenta compartida. Películas, series originales, documentales y contenido exclusivo de Amazon Studios. Máximo 6 usuarios por cuenta, cada uno con su propio perfil.",
    features: [
      "Perfil personal exclusivo",
      "Contenido exclusivo Amazon",
      "Calidad HD disponible",
      "Máximo 6 usuarios por cuenta",
      "Soporte por WhatsApp",
    ],
    details: [
      { label: "Duración", value: "30 días desde la activación" },
      { label: "Renovación", value: "Mensual, sin compromiso" },
      { label: "Dispositivos", value: "TV, móvil, tablet, PC" },
      { label: "Activación", value: "Tras validación del pago" },
    ],
  },
];

export const getServiceBySlug = (slug?: string) =>
  services.find((s) => s.slug === slug);
