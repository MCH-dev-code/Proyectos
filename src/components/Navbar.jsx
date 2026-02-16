import { useState } from "react";

const Navbar = ({ paginaActual, setPaginaActual }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (pagina) => {
    setPaginaActual(pagina);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#003d7a] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="hidden md:flex gap-8 font-semibold text-sm">
          <button
            onClick={() => handleNavClick("inicio")}
            className={`hover:text-blue-300 transition pb-1 ${paginaActual === "inicio" ? "border-b-2 border-white" : ""}`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavClick("nosotros")}
            className={`hover:text-blue-300 transition pb-1 ${paginaActual === "nosotros" ? "border-b-2 border-white" : ""}`}
          >
            Nosotros
          </button>
          <button
            onClick={() => handleNavClick("tienda")}
            className={`hover:text-blue-300 transition pb-1 ${paginaActual === "tienda" ? "border-b-2 border-white" : ""}`}
          >
            Tienda
          </button>
          <button
            onClick={() => handleNavClick("contacto")}
            className={`hover:text-blue-300 transition pb-1 ${paginaActual === "contacto" ? "border-b-2 border-white" : ""}`}
          >
            Contacto
          </button>
          <button
            onClick={() => handleNavClick("sesion")}
            className={`hover:text-blue-300 transition pb-1 ${paginaActual === "sesion" ? "border-b-2 border-white" : ""}`}
          >
            Sesión
          </button>
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 z-50"
        >
          <span className={`w-6 h-0.5 bg-white transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 px-3 md:px-6 py-1.5 rounded text-xs md:text-xs font-bold uppercase transition whitespace-nowrap">
            Cotizaciones
          </button>
          <div className="hidden md:flex gap-3 text-xl">
            <a href="#facebook" className="cursor-pointer hover:text-blue-300 transition" title="Facebook">📘</a>
            <a href="#instagram" className="cursor-pointer hover:text-blue-300 transition" title="Instagram">📷</a>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#002a5c] px-4 py-4 space-y-3 animate-in fade-in duration-200">
          <button onClick={() => handleNavClick("inicio")} className="block w-full text-left hover:text-blue-300 transition py-2 border-b border-blue-700">Inicio</button>
          <button onClick={() => handleNavClick("nosotros")} className="block w-full text-left hover:text-blue-300 transition py-2 border-b border-blue-700">Nosotros</button>
          <button onClick={() => handleNavClick("tienda")} className="block w-full text-left hover:text-blue-300 transition py-2 border-b border-blue-700">Tienda</button>
          <button onClick={() => handleNavClick("contacto")} className="block w-full text-left hover:text-blue-300 transition py-2 border-b border-blue-700">Contacto</button>
          <button onClick={() => handleNavClick("sesion")} className="block w-full text-left hover:text-blue-300 transition py-2 border-b border-blue-700">Sesión</button>
          <div className="flex gap-4 pt-2 text-xl">
            <a href="#facebook" className="cursor-pointer hover:text-blue-300 transition" title="Facebook">📘</a>
            <a href="#instagram" className="cursor-pointer hover:text-blue-300 transition" title="Instagram">📷</a>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;