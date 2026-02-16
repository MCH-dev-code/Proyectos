import robcastLogo from "../assets/robcast.png";

const Footer = () => {
  return (
    <footer className="bg-[#002d5a] text-white mt-12 pt-10 pb-6" id="contacto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
        {/* Columna 1: Logo */}
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
            <img 
              src={robcastLogo} 
              alt="Robcast Logo" 
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">
            Líderes en suministros tecnológicos y soporte técnico. Ofreciendo calidad y confianza en cada equipo.
          </p>
        </div>

        {/* Columna 2: Enlaces */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-bold mb-4 border-b border-blue-400 pb-1">Enlaces Rápidos</h3>
          <ul className="text-sm text-blue-100 space-y-2 text-center md:text-left">
            <li className="hover:text-white cursor-pointer transition">Tienda Online</li>
            <li className="hover:text-white cursor-pointer transition">Servicios Técnicos</li>
            <li className="hover:text-white cursor-pointer transition">Garantía de Equipos</li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div className="flex flex-col items-center md:items-end">
          <h3 className="font-bold mb-4 border-b border-blue-400 pb-1">Contacto</h3>
          <ul className="text-sm text-blue-100 space-y-2 text-center md:text-right">
            <li>📍 Calle Principal #123, Santo Domingo</li>
            <li>📞 +1 (809) 555-0123</li>
            <li>✉️ ventas@robcast.com</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 pt-6 border-t border-blue-800 text-center text-xs text-blue-300">
        © 2026 ROBCAST SUPLIDORES. Todos los derechos reservados.
      </div>
    </footer>
  );
};
export default Footer;