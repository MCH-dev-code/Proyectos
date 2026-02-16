export default function Invoices() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Facturación</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Nueva Factura</button>
      </div>
      <div className="bg-white p-6 rounded-xl border-2 border-dashed border-slate-200 text-center text-slate-400">
        No hay facturas recientes para mostrar.
      </div>
    </div>
  );
}