import React, { useState } from "react";

// IMPORTACIONES CON RUTA ABSOLUTA DESDE SRC
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import Inicio from "./components/Inicio.jsx";
import Tienda from "./components/Tienda.jsx";
import Nosotros from "./components/Nosotros.jsx";
import Contacto from "./components/Contacto.jsx";
import Sesion from "./components/Sesion.jsx";
import Footer from "./components/Footer.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import { UsuarioProvider } from "./context/UsuarioContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

function Principal() {
  const [paginaActual, setPaginaActual] = useState("inicio");
  const [busquedaHeader, setBusquedaHeader] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);

  // Función para renderizar la página actual
  const handleProductClickHome = (producto) => {
    setBusquedaHeader(producto?.nombre || "");
    setCategoriaFiltro(producto?.categoria || null);
    setPaginaActual("tienda");
  };

  const renderPagina = () => {
    switch (paginaActual) {
      case "inicio":
        return <Inicio onNavigate={setPaginaActual} onCategoryClick={setCategoriaFiltro} onProductClickGoToTienda={handleProductClickHome} />;
      case "tienda":
        return <Tienda busquedaInicial={busquedaHeader} categoriaSeleccionada={categoriaFiltro} />;
      case "nosotros":
        return <Nosotros />;
      case "contacto":
        return <Contacto />;
      case "sesion":
        return <Sesion />;
      default:
        return <Inicio />;
    }
  };

  return (
    <UsuarioProvider>
      <WishlistProvider>
        <CarritoProvider>
          <div className="min-h-screen bg-white">
          <div className="bg-gray-100 text-[8px] sm:text-[10px] py-1 px-4 sm:px-10 flex flex-col sm:flex-row justify-center sm:justify-between text-gray-500 gap-2 sm:gap-0">
            <span className="text-center sm:text-left">Calle 6ta No. 45 Mi hogar, Santo Domingo Este</span>
            <div className="flex gap-4 justify-center sm:justify-end flex-wrap">
              <span>+1(809) 594-6269</span>
              <span>ventas@robcast.com.do</span>
            </div>
          </div>

          <Header onNavigate={setPaginaActual} onSearch={setBusquedaHeader} />
          <Navbar paginaActual={paginaActual} setPaginaActual={setPaginaActual} />

          {renderPagina()}

          <Footer />
        </div>
      </CarritoProvider>
      </WishlistProvider>
    </UsuarioProvider>
  );
}

export default Principal;