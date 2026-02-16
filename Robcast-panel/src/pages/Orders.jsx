export default function Orders() {
  const orders = [
    { id: '#1024', customer: 'Rosa Marte', total: 'RD$ 1,500', status: 'Completado' },
    { id: '#1025', customer: 'Luis Peña', total: 'RD$ 4,200', status: 'Procesando' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Pedidos de Robcast</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono text-blue-600">{o.id}</td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4 font-bold">{o.total}</td>
                <td className="p-4"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}