import { useState } from "react";
import Sidebar from "./Sidebar";
import Flyer from "./Flyer";
import CategoryCards from "./CategoryCards";
import Brands from "./Brands";
import ProductCatalog from "./ProductCatalog";

const Inicio = ({ onNavigate, onCategoryClick, onProductClickGoToTienda }) => {
  return (
    <div id="inicio">
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Fila 1: Sidebar y Flyer lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
          <div className="lg:col-span-1">
            <Sidebar onNavigate={onNavigate} onCategoryClick={onCategoryClick} />
          </div>
          <div className="lg:col-span-2">
            <Flyer />
          </div>
        </div>

        {/* Fila 2: Tarjetas de categorías debajo */}
        <div>
          <CategoryCards /> 
        </div>
      </main>

      <Brands />

      <ProductCatalog onNavigateToTienda={onProductClickGoToTienda} disableInteractions={true} />
    </div>
  );
};

export default Inicio;
