import React, { useState, useContext } from "react";
import robcastLogo from "../assets/robcast.png";
import { CarritoContext } from "../context/CarritoContext.jsx";
import { UsuarioContext } from "../context/UsuarioContext.jsx";
import LoginModal from "./LoginModal.jsx";

const Header = ({ onNavigate, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [abrirCarrito, setAbrirCarrito] = useState(false);
  const [abrirLoginModal, setAbrirLoginModal] = useState(false);
  const { carrito, cantidadItems, totalCarrito, eliminarDelCarrito, actualizarCantidad } = useContext(CarritoContext);
  const { usuarioActual } = useContext(UsuarioContext);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      if (onNavigate) onNavigate("tienda");
      setSearchTerm("");
    }
  };

  const handleSesionClick = () => {
    if (usuarioActual) {
      // Si está logueado, ir a la página de sesión
      onNavigate("sesion");
    } else {
      // Si no está logueado, abrir el modal
      setAbrirLoginModal(true);
    }
  };

  const handleRegisterClick = () => {
    setAbrirLoginModal(false);
    onNavigate("sesion");
  };

  return (
    <header className="bg-purple-100 py-3 md:py-4 px-4 md:px-10 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3 md:gap-6">
        {/* Logo */}
        <div>
          <img 
            src={robcastLogo} 
            alt="Robcast Logo" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
        
        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} className="flex-1 min-w-0">
          <div className="flex gap-1 md:gap-2">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded text-[11px] md:text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded text-[11px] md:text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap"
            >
              Buscar
            </button>
          </div>
        </form>
        
        {/* Botones Sesión y Carrito */}
        <div className="flex items-center gap-2 md:gap-3 relative">
          <button 
            onClick={handleSesionClick}
            className="flex items-center gap-1 bg-blue-600 text-white px-2 md:px-3 py-1.5 md:py-2 rounded text-[11px] md:text-sm font-bold hover:bg-blue-700 transition whitespace-nowrap"
          >
            {usuarioActual ? (
              <>
                ✅ {usuarioActual.nombre.split(" ")[0]}
              </>
            ) : (
              <>
                👤 Sesión
              </>
            )}
          </button>

          {/* Mostrar carrito solo si está logueado */}
          {usuarioActual && (
            <button 
              onClick={() => setAbrirCarrito(!abrirCarrito)}
              className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-lg md:text-xl"
            >
              🛒
              {cantidadItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                  {cantidadItems}
                </span>
              )}
            </button>
          )}

          {/* Dropdown del Carrito */}
          {abrirCarrito && (
            <div className="absolute right-0 top-16 bg-white rounded-lg shadow-lg border border-gray-200 w-80 max-h-96 overflow-y-auto z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">🛒 MI CARRITO</h3>
              </div>

              {carrito.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Carrito vacío</div>
              ) : (
                <>
                  <div className="p-4 space-y-3">
                    {carrito.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded p-2 text-sm">
                        <p className="font-bold text-gray-800 line-clamp-1 mb-1">{item.nombre}</p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-blue-600 font-bold">${item.precio}</span>
                          <span className="text-gray-600">x{item.cantidad}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-bold"
                          >
                            −
                          </button>
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs font-bold"
                          >
                            +
                          </button>
                          <button
                            onClick={() => eliminarDelCarrito(item.id)}
                            className="flex-1 bg-red-200 hover:bg-red-300 text-red-700 px-2 py-1 rounded text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex justify-between mb-3 font-bold">
                      <span>TOTAL:</span>
                      <span className="text-blue-600">${totalCarrito.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-bold transition text-sm">
                       WhatsApp
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={abrirLoginModal}
        onClose={() => setAbrirLoginModal(false)}
        onSuccess={() => {
          setAbrirLoginModal(false);
        }}
        onRegisterClick={handleRegisterClick}
      />
    </header>
  );
};

export default Header;
