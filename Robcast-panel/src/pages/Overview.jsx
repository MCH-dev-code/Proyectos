import { useState, useEffect } from 'react';
import { DollarSign, Package, Users, ShoppingBag } from 'lucide-react';

export default function Overview() {
  const [stats, setStats] = useState({
    ingresos_totales: 0,
    total_productos: 0,
    total_clientes: 0,
    total_ventas: 0
  });

  useEffect(() => {
    fetch('http://localhost:3001/stats/summary')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const cards = [
    { title: "Ingresos", value: `RD$ ${Number(stats.ingresos_totales || 0).toLocaleString()}`, icon: <DollarSign className="text-green-600"/>, bg: "bg-green-50" },
    { title: "Productos", value: stats.total_productos, icon: <Package className="text-blue-600"/>, bg: "bg-blue-50" },
    { title: "Clientes", value: stats.total_clientes, icon: <Users className="text-purple-600"/>, bg: "bg-purple-50" },
    { title: "Ventas", value: stats.total_ventas, icon: <ShoppingBag className="text-orange-600"/>, bg: "bg-orange-50" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Resumen de Robcast</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${card.bg}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Estado del Sistema</h3>
        <p className="text-slate-500">Conectado a MySQL: <span className="text-green-500 font-bold">Online</span></p>
      </div>
    </div>
  );
}