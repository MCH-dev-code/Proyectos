import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, CheckCircle } from 'lucide-react';

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/productos').then(res => res.json()).then(setProducts);
    fetch('http://localhost:3001/clientes').then(res => res.json()).then(setClients);
  }, []);

  const addToCart = (p) => {
    const exists = cart.find(item => item.id === p.id);
    if (exists) {
      setCart(cart.map(item => item.id === p.id ? {...item, cantidad: item.cantidad + 1} : item));
    } else {
      setCart([...cart, {...p, cantidad: 1}]);
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const processSale = async () => {
    if (!selectedClient || cart.length === 0) return alert("Selecciona cliente y productos");
    
    const res = await fetch('http://localhost:3001/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente_id: selectedClient, productos: cart, total })
    });

    if (res.ok) {
      alert("¡Venta Exitosa!");
      setCart([]);
      setSelectedClient('');
      // Opcional: recargar productos para ver stock actualizado
    }
  };

  return (
    <div className="p-8 flex gap-8">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Nueva Venta</h2>
        <select className="w-full p-3 border rounded-xl mb-6" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
          <option value="">Seleccionar Cliente...</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold">{p.nombre}</p>
                <p className="text-blue-600 text-sm">RD$ {p.precio}</p>
                <p className="text-xs text-gray-400">Stock: {p.stock}</p>
              </div>
              <button onClick={() => addToCart(p)} className="bg-slate-100 p-2 rounded-lg hover:bg-blue-100"><Plus size={18}/></button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-80 bg-white p-6 rounded-2xl shadow-lg border h-fit sticky top-8">
        <h3 className="flex items-center gap-2 font-bold mb-4 border-b pb-2"><ShoppingCart size={20}/> Carrito</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span>{item.nombre} (x{item.cantidad})</span>
            <span>RD$ {item.precio * item.cantidad}</span>
          </div>
        ))}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total:</span>
            <span>RD$ {total.toLocaleString()}</span>
          </div>
          <button onClick={processSale} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700">
            <CheckCircle size={20}/> Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
}