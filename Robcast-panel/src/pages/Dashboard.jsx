import React, { useState, useEffect } from 'react';
import AdminApiService from '../services/AdminApiService.js';

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await AdminApiService.obtenerEstadisticas();
        setEstadisticas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-6 rounded">
            <p className="text-gray-600">Total Ventas</p>
            <p className="text-2xl font-bold">{estadisticas.resumen?.total_ventas || 0}</p>
          </div>
          
          <div className="bg-green-100 p-6 rounded">
            <p className="text-gray-600">Ingresos</p>
            <p className="text-2xl font-bold">${estadisticas.resumen?.ingresos_totales?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="bg-purple-100 p-6 rounded">
            <p className="text-gray-600">Ticket Promedio</p>
            <p className="text-2xl font-bold">${estadisticas.resumen?.ticket_promedio?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="bg-orange-100 p-6 rounded">
            <p className="text-gray-600">Clientes Únicos</p>
            <p className="text-2xl font-bold">{estadisticas.resumen?.clientes_unicos || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}
