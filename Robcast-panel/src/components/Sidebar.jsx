import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, FileText, Users, Truck, Package, DollarSign } from 'lucide-react';

const NavItem = ({ icon: Icon, label, path }) => (
  <Link to={path} className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-slate-800 hover:text-white transition-all">
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 min-h-screen p-6 flex flex-col gap-8 shadow-xl">
      <div className="text-blue-500 text-2xl font-black border-b border-slate-800 pb-4">ROBCAST</div>
      <nav className="space-y-1">
        <NavItem icon={LayoutDashboard} label="Resumen" path="/" />
        <NavItem icon={Package} label="Productos" path="/productos" />
        <NavItem icon={ShoppingCart} label="Pedidos" path="/pedidos" />
        <NavItem icon={FileText} label="Facturas" path="/facturas" />
        <NavItem icon={DollarSign} label="Ventas" path="/ventas" />
        <NavItem icon={Users} label="Clientes" path="/clientes" />
        <NavItem icon={Truck} label="Envíos" path="/envios" />
      </nav>
    </aside>
  );
}