import React, { useContext, useState, useEffect } from "react";
import { UsuarioContext } from "../context/UsuarioContext.jsx";
import { CarritoContext } from "../context/CarritoContext.jsx";
import { WishlistContext } from "../context/WishlistContext.jsx";
import ApiService from "../services/ApiService.js";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  // Cargar productos de la API
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        const data = await ApiService.getProductos();
        setProducts(data);
        setErrorCarga(null);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setErrorCarga(err.message);
        // Usar productos por defecto si falla la API
        setProducts([
          {
            id: 1,
            nombre: "Laptop Dell XPS",
            precio: 45000,
            imagen: "https://p2-ofp.static.pub/fes/cms/2022/10/10/9er9vj7fkv909z7mkyv8006u6m6q0n540450.png",
            stock: 5,
            rating: 4.5,
            reviews: 23
          },
          {
            id: 2,
            nombre: "Monitor LG 27\"",
            precio: 18000,
            imagen: "https://www.pngarts.com/files/1/Monitor-PNG-HD-Image.png",
            stock: 8,
            rating: 4.8,
            reviews: 45
          },
          {
            id: 3,
            nombre: "Teclado Mecánico RGB",
            precio: 3500,
            imagen: "https://images.unsplash.com/photo-1587829191301-7ac7ef1912cb?w=300&h=300&fit=crop",
            stock: 15,
            rating: 4.9,
            reviews: 67
          },
          {
            id: 4,
            nombre: "Mouse Logitech",
            precio: 1500,
            imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
            stock: 20,
            rating: 4.3,
            reviews: 34
          },
          {
            id: 5,
            nombre: "Cable USB-C",
            precio: 350,
            imagen: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop",
            stock: 50,
            rating: 4.4,
            reviews: 12
          }
        ]);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const { usuarioActual } = useContext(UsuarioContext);
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { agregarAWishlist, eliminarDelWishlist, estaEnWishlist } = useContext(WishlistContext);
  const [toast, setToast] = useState(null);
  const [showCoupon, setShowCoupon] = useState({});

  const handleWhatsApp = (productName) => {
    const message = `Hola, estoy interesado en el producto: ${productName}`;
    const whatsappUrl = `https://wa.me/18095946269?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAgregarCarrito = (product) => {
    if (!usuarioActual) {
      setToast({ tipo: "error", mensaje: "Debes iniciar sesión para agregar al carrito" });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    if (product.stock <= 0) {
      setToast({ tipo: "error", mensaje: "Producto sin stock" });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    agregarAlCarrito({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen
    });
    setToast({ tipo: "success", mensaje: `${product.nombre} añadido al carrito` });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleWishlist = (product) => {
    if (!usuarioActual) {
      setToast({ tipo: "error", mensaje: "Debes iniciar sesión para usar wishlist" });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    if (estaEnWishlist(product.id)) {
      eliminarDelWishlist(product.id);
      setToast({ tipo: "info", mensaje: "Eliminado de favoritos" });
    } else {
      agregarAWishlist(product);
      setToast({ tipo: "success", mensaje: "Añadido a favoritos ❤️" });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400 text-sm">{'⭐'.repeat(Math.floor(rating))}</span>
        <span className="text-xs text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <section className="py-8 md:py-12 px-4 md:px-10 bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 ${
          toast.tipo === "success" ? "bg-green-500" :
          toast.tipo === "error" ? "bg-red-500" :
          "bg-blue-500"
        } text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse`}>
          {toast.mensaje}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          Catálogo de Productos
        </h2>

        {/* Estado de carga */}
        {cargando && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">⏳ Cargando productos...</p>
          </div>
        )}

        {/* Error de carga */}
        {errorCarga && !cargando && (
          <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded text-center">
            ⚠️ {errorCarga} - Mostrando productos por defecto
          </div>
        )}
        
        {!cargando && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition flex flex-col h-full relative"
              >
              {/* Badge stock */}
              {product.stock <= 0 && (
                <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                  Sin Stock
                </div>
              )}

              {/* Wishlist Button */}
              {usuarioActual && (
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className={`absolute top-2 left-2 z-10 text-xl transition ${
                    estaEnWishlist(product.id) ? "text-red-500" : "text-gray-300 hover:text-red-500"
                  }`}
                >
                  ❤️
                </button>
              )}

              {/* Imagen */}
              <div className="w-full h-32 md:h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={product.imagen || 'https://via.placeholder.com/300x300?text=Sin+Imagen'}
                  alt={product.nombre}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="px-3 md:px-4 pt-3">
                  {renderStars(product.rating)}
                  {product.reviews && <p className="text-xs text-gray-500">({product.reviews} reseñas)</p>}
                </div>
              )}

              {/* Contenido */}
              <div className="px-3 md:px-4 pb-3 flex flex-col flex-grow">
                <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-2 line-clamp-2">
                  {product.nombre}
                </h3>
                
                {/* Precio y Stock */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm md:text-base font-bold text-blue-600">
                      ${product.precio}
                    </p>
                    <span className={`text-xs font-bold ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `${product.stock} unidades` : 'Sin stock'}
                    </span>
                  </div>
                </div>

                {/* Botones */}
                <div className="mt-auto space-y-2">
                  {usuarioActual ? (
                    <button
                      onClick={() => handleAgregarCarrito(product)}
                      disabled={product.stock <= 0}
                      className={`w-full px-3 py-2 rounded text-xs md:text-sm font-bold transition ${
                        product.stock > 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-400 text-white cursor-not-allowed'
                      }`}
                    >
                      🛒 {product.stock > 0 ? 'Agregar Carrito' : 'Sin stock'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setToast({ tipo: "error", mensaje: "Inicia sesión para comprar" })}
                      className="w-full bg-gray-400 text-white px-3 py-2 rounded text-xs md:text-sm font-bold cursor-not-allowed"
                    >
                      🔒 Inicia Sesión
                    </button>
                  )}
                  <button
                    onClick={() => handleWhatsApp(product.nombre)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-xs md:text-sm font-bold transition"
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
