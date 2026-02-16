import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, Phone } from 'lucide-react';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:3001/clientes');
      const data = await res.json();
      setClients(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClients(); }, []);

  const addClient = async () => {
    const name = prompt("Nombre del cliente:");
    if (!name) return;
    
    await fetch('http://localhost:3001/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: name, email: 'cliente@ejemplo.com', telefono: '000-000-0000' })
    });
    fetchClients();
  };

  const deleteClient = async (id) => {
    if (window.confirm("¿Eliminar cliente?")) {
      await fetch(`http://localhost:3001/clientes/${id}`, { method: 'DELETE' });
      fetchClients();
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando Clientes...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Directorio de Clientes</h2>
        <button onClick={addClient} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <UserPlus size={18} /> Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                {c.nombre[0]}
              </div>
              <button onClick={() => deleteClient(c.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{c.nombre}</h3>
            <div className="mt-4 space-y-2 text-slate-500 text-sm">
              <p className="flex items-center gap-2"><Mail size={14}/> {c.email}</p>
              <p className="flex items-center gap-2"><Phone size={14}/> {c.telefono}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}