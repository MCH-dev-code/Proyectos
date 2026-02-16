import { useState, useContext, useEffect } from "react";
import { CarritoContext } from "../context/CarritoContext.jsx";

const Tienda = ({ busquedaInicial = "", categoriaSeleccionada: categoriaProp = null }) => {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito, totalCarrito, cantidadItems } = useContext(CarritoContext);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [busqueda, setBusqueda] = useState(busquedaInicial);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [ordenamiento, setOrdenamiento] = useState("destacados");
  const [paginaActual, setPaginaActual] = useState(1);
  const [vista, setVista] = useState("todas"); // todas, ofertas, mas-vendidos, combos
  const productosPerPagina = 12;

  // Actualizar búsqueda cuando llega del Header
  useEffect(() => {
    if (busquedaInicial) {
      setBusqueda(busquedaInicial);
      setPaginaActual(1);
    }
  }, [busquedaInicial]);

  // Actualizar categoría cuando llega de Inicio
  useEffect(() => {
    if (categoriaProp) {
      setCategoriaSeleccionada(categoriaProp);
      setPaginaActual(1);
    }
  }, [categoriaProp]);

  const productos = [
    // COMPUTADORAS
    { id: 1, nombre: "Laptop Dell Inspiron 15", precio: 899, descuentoPrecio: 799, categoria: "Computadoras", imagen: "https://p2-ofp.static.pub/fes/cms/2022/10/10/9er9vj7fkv909z7mkyv8006u6m6q0n540450.png", stock: 5, descripcion: "Procesador i7, 8GB RAM, SSD 512GB", rating: 4.5, esOferta: true, esMasVendido: true },
    { id: 2, nombre: "MacBook Pro 14\"", precio: 1999, categoria: "Computadoras", imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop", stock: 3, descripcion: "M3 Pro, 8GB RAM, 512GB SSD", rating: 5, esMasVendido: true, esCombo: true },
    { id: 3, nombre: "Laptop HP Pavilion", precio: 729, descuentoPrecio: 649, categoria: "Computadoras", imagen: "https://images.unsplash.com/photo-1588872657840-18bfd7d1d910?w=300&h=300&fit=crop", stock: 8, descripcion: "Ryzen 5, 16GB RAM, SSD 256GB", rating: 4.2, esOferta: true },
    { id: 4, nombre: "Lenovo ThinkPad X1", precio: 1299, categoria: "Computadoras", imagen: "https://images.unsplash.com/photo-1594642632303-c6ff1b52b326?w=300&h=300&fit=crop", stock: 4, descripcion: "i5, 16GB RAM, SSD 512GB", rating: 4.8, esMasVendido: true },
    
    // MONITORES
    { id: 5, nombre: "Monitor LG 27\" 4K", precio: 399, descuentoPrecio: 349, categoria: "Monitores", imagen: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop", stock: 10, descripcion: "UHD 4K, 60Hz, IPS Panel", rating: 4.6, esOferta: true, esCombo: true },
    { id: 6, nombre: "Monitor Dell 24\" Full HD", precio: 199, categoria: "Monitores", imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop", stock: 15, descripcion: "1920x1080, 75Hz, 5ms", rating: 4.3, esMasVendido: true },
    { id: 7, nombre: "Monitor ASUS 32\" Gaming", precio: 599, descuentoPrecio: 499, categoria: "Monitores", imagen: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop", stock: 7, descripcion: "Curved, 144Hz, 1ms Response", rating: 4.9, esOferta: true },
    { id: 8, nombre: "Monitor BenQ 27\" 240Hz", precio: 799, categoria: "Monitores", imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop", stock: 5, descripcion: "QHD 1440p, 240Hz", rating: 5 },
    
    // ACCESORIOS
    { id: 9, nombre: "Teclado Mecánico RGB", precio: 129, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1587829191301-7ac7ef1912cb?w=300&h=300&fit=crop", stock: 20, descripcion: "Switch Azul, Retroiluminado", rating: 4.7, esMasVendido: true },
    { id: 10, nombre: "Mouse Logitech MX", precio: 99, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop", stock: 18, descripcion: "Inalámbrico, Recargable", rating: 4.8, esCombo: true },
    { id: 11, nombre: "Webcam HD 1080p", precio: 89, descuentoPrecio: 69, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1614008375890-cb53b6c5f8d5?w=300&h=300&fit=crop", stock: 12, descripcion: "Auto Focus, Micrófono", rating: 4.4, esOferta: true },
    { id: 12, nombre: "Cable HDMI 3m", precio: 25, categoria: "Accesorios", imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop", stock: 50, descripcion: "4K 60Hz, certificado", rating: 4.5, esCombo: true },
    
    // IMPRESORAS
    { id: 13, nombre: "Impresora Epson L3150", precio: 349, descuentoPrecio: 299, categoria: "Impresoras", imagen: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=300&h=300&fit=crop", stock: 6, descripcion: "Multifunción, Inyección tinta", rating: 4.6, esOferta: true, esMasVendido: true },
    { id: 14, nombre: "Impresora HP LaserJet", precio: 499, categoria: "Impresoras", imagen: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=300&h=300&fit=crop", stock: 4, descripcion: "Láser, B/N, 40 ppm", rating: 4.7 },
    { id: 15, nombre: "Escáner Fujitsu", precio: 299, categoria: "Impresoras", imagen: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=300&h=300&fit=crop", stock: 8, descripcion: "30 ppm, Automático", rating: 4.5, esCombo: true },
    
    // BOCINAS
    { id: 16, nombre: "Bocina JBL Xtreme", precio: 179, categoria: "Bocinas", imagen: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop", stock: 11, descripcion: "Portátil, Impermeable, Batería 15h", rating: 4.8, esMasVendido: true },
    { id: 17, nombre: "Sistema Sony 2.1", precio: 249, descuentoPrecio: 199, categoria: "Bocinas", imagen: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop", stock: 9, descripcion: "Potencia 50W, Subwoofer", rating: 4.6, esOferta: true },
    { id: 18, nombre: "Audífonos Samsung Galaxy", precio: 149, categoria: "Bocinas", imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", stock: 14, descripcion: "ANC, Bluetooth 5.2", rating: 4.7, esCombo: true },
    
    // SILLAS
    { id: 19, nombre: "Silla Gamer Negro-Rojo", precio: 299, descuentoPrecio: 249, categoria: "Sillas", imagen: "https://images.unsplash.com/photo-1611269431281-e6fcae7ef0fb?w=300&h=300&fit=crop", stock: 7, descripcion: "Altura ajustable, Soporte lumbar", rating: 4.9, esOferta: true, esMasVendido: true },
    { id: 20, nombre: "Silla Ejecutiva Negra", precio: 199, categoria: "Sillas", imagen: "https://images.unsplash.com/photo-1611269431281-e6fcae7ef0fb?w=300&h=300&fit=crop", stock: 10, descripcion: "Ergonómica, Brazos ajustables", rating: 4.5 },
    { id: 21, nombre: "Silla Gamer Premium", precio: 499, categoria: "Sillas", imagen: "https://images.unsplash.com/photo-1611269431281-e6fcae7ef0fb?w=300&h=300&fit=crop", stock: 5, descripcion: "Cuero, Reclinable, Premium", rating: 5, esCombo: true },
  ];

  // Filtrados y ordenados
  let productosFiltrados = productos.filter((p) => {
    const cumpleCategoria = categoriaSeleccionada === null || p.categoria === categoriaSeleccionada;
    const cumpleBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                           p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    
    // Filtrar por vista
    let cumpleVista = true;
    if (vista === "ofertas") {
      cumpleVista = p.esOferta === true;
    } else if (vista === "mas-vendidos") {
      cumpleVista = p.esMasVendido === true;
    } else if (vista === "combos") {
      cumpleVista = p.esCombo === true;
    }
    
    return cumpleCategoria && cumpleBusqueda && cumpleVista;
  });

  // Ordenar
  if (ordenamiento === "precio-menor") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (ordenamiento === "precio-mayor") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  } else if (ordenamiento === "rating") {
    productosFiltrados.sort((a, b) => b.rating - a.rating);
  }

  // Paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPerPagina);
  const inicio = (paginaActual - 1) * productosPerPagina;
  const productosActuales = productosFiltrados.slice(inicio, inicio + productosPerPagina);

  const categorias = ["Computadoras", "Monitores", "Accesorios", "Impresoras", "Bocinas", "Sillas"];

  return (
    <div id="tienda">
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Tienda Robcast</h1>
          <p className="text-gray-600">Explora nuestro catálogo completo de productos tecnológicos</p>
        </div>

        {/* Vistas - Botones de filtrado por sección */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setVista("todas");
              setPaginaActual(1);
            }}
            className={`px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${
              vista === "todas"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📦 Todos
          </button>
          <button
            onClick={() => {
              setVista("ofertas");
              setPaginaActual(1);
            }}
            className={`px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${
              vista === "ofertas"
                ? "bg-red-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🔥 Ofertas
          </button>
          <button
            onClick={() => {
              setVista("mas-vendidos");
              setPaginaActual(1);
            }}
            className={`px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${
              vista === "mas-vendidos"
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ⭐ Más Vendidos
          </button>
          <button
            onClick={() => {
              setVista("combos");
              setPaginaActual(1);
            }}
            className={`px-6 py-3 rounded-lg font-bold transition whitespace-nowrap ${
              vista === "combos"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📦 Combos
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filtros */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 sticky top-20 space-y-6">
              {/* Búsqueda */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm">🔍 BUSCAR</h3>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Categorías */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm">📁 CATEGORÍAS</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => {
                        setCategoriaSeleccionada(null);
                        setPaginaActual(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                        categoriaSeleccionada === null
                          ? "bg-blue-100 text-blue-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Todos
                    </button>
                  </li>
                  {categorias.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setCategoriaSeleccionada(cat);
                          setPaginaActual(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                          categoriaSeleccionada === cat
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ordenamiento */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 text-sm">⬆️ ORDENAR</h3>
                <select
                  value={ordenamiento}
                  onChange={(e) => setOrdenamiento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="destacados">Destacados</option>
                  <option value="precio-menor">Menor precio</option>
                  <option value="precio-mayor">Mayor precio</option>
                  <option value="rating">Mejor valorado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Productos y Carrito */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Productos */}
              <div className="lg:col-span-2">
                {/* Información de filtrado */}
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-gray-600 text-sm">
                    Mostrando <span className="font-bold">{productosActuales.length}</span> de{" "}
                    <span className="font-bold">{productosFiltrados.length}</span> productos
                  </p>
                </div>

                {/* Grid de productos */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {productosActuales.map((producto) => (
                    <div
                      key={producto.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col"
                    >
                      {/* Imagen */}
                      <div className="relative h-40 md:h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* Precio */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {producto.descuentoPrecio ? (
                            <>
                              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                ${producto.descuentoPrecio}
                              </span>
                              <span className="bg-gray-800 text-white px-2 py-0.5 rounded text-xs line-through opacity-75">
                                ${producto.precio}
                              </span>
                            </>
                          ) : (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                              ${producto.precio}
                            </span>
                          )}
                        </div>

</div>

                      {/* Contenido */}
                      <div className="p-3 md:p-4 flex flex-col flex-grow">
                        <h3 className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2 mb-1">
                          {producto.nombre}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">{producto.descripcion}</p>
                        <p className="text-xs text-gray-600 mb-3">
                          Stock: <span className="font-bold text-green-600">{producto.stock}</span>
                        </p>

                        <button
                          onClick={() => agregarAlCarrito(producto)}
                          disabled={producto.stock === 0}
                          className="mt-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-xs font-bold transition"
                        >
                          🛒 Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                {totalPaginas > 1 && (
                  <div className="flex justify-center gap-2 mb-8">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setPaginaActual(num)}
                        className={`px-3 py-2 rounded text-sm font-bold transition ${
                          paginaActual === num
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Carrito */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 sticky top-20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">🛒 CARRITO</h3>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {cantidadItems}
                    </span>
                  </div>

                  {carrito.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">Carrito vacío</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                        {carrito.map((item) => (
                          <div
                            key={item.id}
                            className="border border-gray-200 rounded p-3 text-xs"
                          >
                            <p className="font-bold text-gray-800 line-clamp-1 mb-1">
                              {item.nombre}
                            </p>
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

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between mb-4 font-bold">
                          <span>TOTAL:</span>
                          <span className="text-blue-600 text-lg">${totalCarrito.toFixed(2)}</span>
                        </div>

                        <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold transition mb-2">
                          💬 WhatsApp
                        </button>
                        <button
                          onClick={() => vaciarCarrito()}
                          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-bold transition text-sm"
                        >
                          Vaciar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tienda;
