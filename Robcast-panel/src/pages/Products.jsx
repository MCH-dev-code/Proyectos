import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react'; 

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // --- 1. CARGAR PRODUCTOS ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/productos');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  // --- 2. GESTIÓN DE IMÁGENES ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditingProduct({ ...editingProduct, imagen: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // --- 3. ACCIONES ---
  const addProduct = async () => {
    const newProd = { nombre: "Nuevo Producto", stock: 0, precio: 0, imagen: "" };
    try {
      const res = await fetch('http://localhost:3001/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      const data = await res.json();
      await fetchProducts();
      setEditingProduct({ ...newProd, id: data.id });
    } catch (e) { 
      alert("Error: ¿El backend (server.cjs) está encendido?"); 
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/productos/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (e) { 
      alert("Error al guardar cambios"); 
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await fetch(`http://localhost:3001/productos/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  // --- 4. FILTRADO ---
  const filteredProducts = products.filter(p => 
    (p.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-black text-slate-400 animate-pulse">CARGANDO ROBCAST...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      {/* CABECERA */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Inventario</h2>
          <p className="text-slate-500 font-medium">Gestión de stock y precios</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Icons.Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              className="w-full pl-10 p-3 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              placeholder="Buscar..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={addProduct} 
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            + NUEVO
          </button>
        </div>
      </div>

      {/* LISTADO DE PRODUCTOS */}
      <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs uppercase font-black">
            <tr>
              <th className="p-6">Producto</th>
              <th className="p-6 text-center">Stock</th>
              <th className="p-6 text-center">Precio</th>
              <th className="p-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={p.imagen || "https://via.placeholder.com/100"} 
                      className="w-12 h-12 rounded-2xl object-cover shadow-sm bg-slate-200" 
                      alt="" 
                    />
                    <span className="font-bold text-slate-700 text-lg">{p.nombre}</span>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1 rounded-full text-xs font-black ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {p.stock} UDS
                  </span>
                </td>
                <td className="p-6 text-center font-black text-slate-900 text-lg">
                  RD$ {Number(p.precio).toLocaleString()}
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingProduct(p)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                      <Icons.Edit2 size={20} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                      <Icons.Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDICIÓN */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800">Editar Producto</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                <Icons.X size={28}/>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Foto del Producto */}
              <div className="relative w-32 h-32 mx-auto group">
                <img 
                  src={editingProduct.imagen || "https://via.placeholder.com/150"} 
                  className="w-full h-full object-cover rounded-[2rem] border-4 border-slate-50 shadow-md bg-slate-100" 
                  alt="Previsualización"
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()} 
                  className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"
                >
                  <Icons.Camera size={24} />
                </button>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Nombre</label>
                  <input 
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                    value={editingProduct.nombre} 
                    onChange={e => setEditingProduct({...editingProduct, nombre: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2">Stock</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold" 
                      value={editingProduct.stock} 
                      onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2">Precio (RD$)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold" 
                      value={editingProduct.precio} 
                      onChange={e => setEditingProduct({...editingProduct, precio: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                GUARDAR CAMBIOS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}