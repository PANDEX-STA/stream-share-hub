import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const Footer = () => (
  <footer className="border-t border-border py-10 px-4">
    <div className="max-w-5xl mx-auto text-center">
      <h3 className="font-heading font-bold text-xl mb-2">
        Stream<span className="text-gradient">Zone</span>
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
        Perfiles de streaming compartidos. Pago verificado manualmente para
        garantizar transparencia y seguridad.
      </p>
      <div className="text-muted-foreground text-xs space-y-1">
        <p>📩 Contacto WhatsApp: +{WHATSAPP_NUMBER.replace(/^51/, "51 ")}</p>
        <p className="mt-4 border-t border-border pt-4 max-w-2xl mx-auto">
          ⚠️ Este servicio ofrece perfiles compartidos en cuentas familiares. No
          estamos afiliados ni representamos a HBO Max ni a Amazon. El uso del
          servicio es responsabilidad del usuario y debe respetar los términos de
          cada plataforma.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} StreamZone. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
