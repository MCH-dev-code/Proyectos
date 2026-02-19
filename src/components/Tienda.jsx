import { useState, useContext, useEffect } from "react";
import { CarritoContext } from "../context/CarritoContext.jsx";
import ApiService from "../services/ApiService.js";

const Tienda = ({ busquedaInicial = "", categoriaSeleccionada: categoriaProp = null }) => {
  const { carrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito, totalCarrito, cantidadItems } = useContext(CarritoContext);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [busqueda, setBusqueda] = useState(busquedaInicial);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [ordenamiento, setOrdenamiento] = useState("destacados");
  const [paginaActual, setPaginaActual] = useState(1);
  const [vista, setVista] = useState("todas"); // todas, ofertas, mas-vendidos, combos
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productosPerPagina = 12;
  
  // Estado para productos desde la API
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos desde la API
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        const data = await ApiService.getProductos();
        // Mapear los datos de la API al formato esperado
        const productosFormateados = data.map(p => ({
          ...p,
          precio: parseFloat(p.precio) || 0,
          stock: parseInt(p.stock) || 0,
          descripcion: p.descripcion || '',
          categoria: p.categoria || 'General',
          imagen: p.imagen || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
          rating: 4.5, // Valor por defecto
          esOferta: false,
          esMasVendido: false,
          esCombo: false
        }));
        setProductos(productosFormateados);
        setError(null);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError('Error al cargar productos');
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

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

  const handleCardKeyDown = (e, producto) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedProduct(producto);
    }
  };

  const handleWhatsApp = (productName) => {
    const message = `Hola, estoy interesado en el producto: ${productName}`;
    const whatsappUrl = `https://wa.me/18095946269?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Mostrar loading
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">⚠️ {error}</p>
          <button onClick={() => window.location.reload()} className="text-blue-600 underline">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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

  // Generar categorías dinámicamente desde los productos
  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))];

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
                    <article
                      role="button"
                      tabIndex={0}
                      key={producto.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setSelectedProduct(producto)}
                      onKeyDown={(e) => handleCardKeyDown(e, producto)}
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
                        <p className="text-xs text-gray-600 mb-3">
                          Stock: <span className="font-bold text-green-600">{producto.stock}</span>
                        </p>

                        <button
                          onClick={(e) => { e.stopPropagation(); agregarAlCarrito(producto); }}
                          disabled={producto.stock === 0}
                          className="mt-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-xs font-bold transition"
                        >
                          🛒 Agregar
                        </button>
                      </div>
                    </article>
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

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedProduct(null)}
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gray-100 flex items-center justify-center p-6">
                <img
                  src={selectedProduct.imagen || "https://via.placeholder.com/400x400?text=Sin+Imagen"}
                  alt={selectedProduct.nombre}
                  className="object-contain max-h-80"
                />
              </div>

              <div className="p-6 flex flex-col gap-3">
                <p className="text-xs text-gray-500 font-semibold uppercase">Producto</p>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedProduct.nombre}</h3>
                <p className="text-lg font-bold text-blue-700">${selectedProduct.precio}</p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedProduct.descripcion || "Sin descripción disponible."}
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      selectedProduct.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} unidades` : "Sin stock"}
                  </span>
                  {selectedProduct.rating && (
                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">⭐ {selectedProduct.rating}</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => agregarAlCarrito(selectedProduct)}
                    disabled={selectedProduct.stock <= 0}
                    className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm transition ${
                      selectedProduct.stock > 0
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-white cursor-not-allowed"
                    }`}
                  >
                    🛒 Agregar al carrito
                  </button>
                  <button
                    onClick={() => handleWhatsApp(selectedProduct.nombre)}
                    className="flex-1 px-4 py-3 rounded-lg font-bold text-sm bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tienda;
