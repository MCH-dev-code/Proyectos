import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Users, AlertCircle } from 'lucide-react';

/**
 * Dashboard del Panel Admin
 * Muestra KPIs, gráficos y alertas del negocio
 */
export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [ventasGrafico, setVentasGrafico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener estadísticas
        const resStats = await fetch(`${API_URL}/admin/reportes/resumen`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resStats.ok) throw new Error('Error al obtener estadísticas');
        const dataStats = await resStats.json();
        setStats(dataStats);

        // Obtener gráfico de ventas
        const resVentas = await fetch(`${API_URL}/admin/reportes/ventas-por-periodo?periodo=mes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resVentas.ok) throw new Error('Error al obtener ventas');
        const dataVentas = await resVentas.json();
        setVentasGrafico(dataVentas.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Administrativo</h1>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Ingresos */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${stats?.ingresos_totales?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Hasta el momento</p>
        </div>

        {/* Total Ventas */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Ventas</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.total_ventas || '0'}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Órdenes completadas</p>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Productos</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats?.total_productos || '0'}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">En catálogo</p>
        </div>

        {/* Clientes */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Clientes</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats?.total_clientes || '0'}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Registrados</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico Línea - Ventas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Ventas por Día</h2>
          {ventasGrafico.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cantidad" 
                  stroke="#3b82f6" 
                  name="Cantidad de Ventas"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Sin datos disponibles</p>
          )}
        </div>

        {/* Gráfico Barras - Ingresos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Ingresos por Día</h2>
          {ventasGrafico.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="total" 
                  fill="#10b981" 
                  name="Ingresos ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Sin datos disponibles</p>
          )}
        </div>
      </div>

      {/* Alertas y Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Bajo */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h2 className="font-bold text-gray-800">Stock Bajo</h2>
          </div>
          {stats?.productos_bajo_stock && stats.productos_bajo_stock.length > 0 ? (
            <ul className="space-y-2">
              {stats.productos_bajo_stock.map(p => (
                <li key={p.id} className="text-sm text-gray-700 flex justify-between">
                  <span className="truncate">{p.nombre}</span>
                  <span className="font-semibold text-yellow-600">{p.stock} ⚠️</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Todo en stock</p>
          )}
        </div>

        {/* Venta Promedio */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-800 mb-4">Estadísticas</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Venta Promedio</p>
              <p className="text-2xl font-bold text-blue-600">
                ${stats?.venta_promedio?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600">Próximo Período</p>
              <p className="text-sm text-gray-800 mt-1">
                Monitór métricas clave para optimizar tu negocio
              </p>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="space-y-2">
            <a 
              href="/admin/productos"
              className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center text-sm"
            >
              Gestionar Productos
            </a>
            <a 
              href="/admin/ventas"
              className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center text-sm"
            >
              Ver Ventas
            </a>
            <a 
              href="/admin/clientes"
              className="block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center text-sm"
            >
              Clientes
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Dashboard actualizado: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
