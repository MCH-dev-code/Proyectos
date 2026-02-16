import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import Sales from './pages/Sales';
import Shipping from './pages/Shipping';
import Products from './pages/Products';

export default function App() {
  return (
    <Router>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/pedidos" element={<Orders />} />
            <Route path="/facturas" element={<Invoices />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/ventas" element={<Sales />} />
            <Route path="/envios" element={<Shipping />} />
            <Route path="/productos" element={<Products />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}