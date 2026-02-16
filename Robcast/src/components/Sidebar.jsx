import { useState } from "react";

const Sidebar = ({ onNavigate, onCategoryClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const categorias = [
    "Computadoras", "Laptops", "Monitores", "Accesorios", 
    "Impresoras", "Bocinas", "Sillas", "Soporte Técnico"
  ];

  const handleCategoryClick = (categoria) => {
    onCategoryClick(categoria);
    onNavigate("tienda");
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Button to toggle sidebar on mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden mb-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        {sidebarOpen ? "Cerrar Categorías" : "Ver Categorías"}
      </button>

      <aside className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-5 h-fit ${
        sidebarOpen ? "block" : "hidden lg:block"
      }`}>
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4 tracking-tight text-sm md:text-base">PRODUCTOS</h3>
        
        <ul className="space-y-2 md:space-y-4">
          {categorias.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => handleCategoryClick(cat)}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition text-xs md:text-sm group hover:bg-blue-50 hover:text-blue-700"
              >
                <span className="group-hover:scale-110 transition-transform">📁</span> {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};
export default Sidebar;