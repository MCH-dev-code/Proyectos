import React, { useState, useEffect } from 'react';
import AdminApiService from '../services/AdminApiService.js';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', precio: '', stock: '' });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await AdminApiService.getProductos();
      setProductos(data);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await AdminApiService.crearProducto({
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      });
      setFormData({ nombre: '', precio: '', stock: '' });
      setShowForm(false);
      cargarProductos();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await AdminApiService.eliminarProducto(id);
      cargarProductos();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Productos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Nuevo Producto
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCrear} className="bg-gray-100 p-6 rounded mb-8">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Crear
          </button>
        </form>
      )}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id} className="border-b">
                <td className="p-3">{prod.nombre}</td>
                <td className="p-3">${prod.precio}</td>
                <td className="p-3">{prod.stock}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEliminar(prod.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
