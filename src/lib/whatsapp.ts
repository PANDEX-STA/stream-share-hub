// Centralized WhatsApp config (Perú)
export const WHATSAPP_NUMBER = "51927134660";
export const WHATSAPP_DEFAULT_MESSAGE = "Hola, quiero comprar un servicio";

export const buildWhatsAppUrl = (message?: string) => {
  const text = encodeURIComponent(message ?? WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
};
