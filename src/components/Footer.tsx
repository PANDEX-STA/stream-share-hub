const Footer = () => (
  <footer className="border-t border-border py-10 px-4">
    <div className="max-w-5xl mx-auto text-center">
      <h3 className="font-heading font-bold text-xl mb-2">
        Stream<span className="text-gradient">Zone</span>
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
        Perfiles de streaming compartidos al mejor precio. Servicio rápido, seguro y confiable.
      </p>
      <div className="text-muted-foreground text-xs space-y-1">
        <p>📩 Contacto: WhatsApp +51 999 999 999</p>
        <p className="mt-4 border-t border-border pt-4">
          ⚠️ Este servicio ofrece perfiles compartidos. No estamos afiliados a HBO Max ni Amazon.
          Uso bajo responsabilidad del usuario.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} StreamZone. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
