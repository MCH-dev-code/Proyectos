const CategoryCards = () => {
  const categories = [
    {
      title: "Ofertas del Mes",
      description: "Equipos completos, todas las marcas disponibles",
      buttonText: "VER OFERTA",
      img: "https://images.pcliquidations.com/images/products/6011/6011.jpg"
    },
    {
      title: "Laptop",
      description: "Variedad de laptop nueva, diferente marcas",
      buttonText: "VER TIENDA",
      img: "https://p2-ofp.static.pub/fes/cms/2022/10/10/9er9vj7fkv909z7mkyv8006u6m6q0n540450.png"
    },
    {
      title: "Impresoras",
      description: "Impresoras térmicas nuevas y refurbished",
      buttonText: "VER PRODUCTO",
      img: "https://www.pngarts.com/files/1/Laser-Printer-PNG-Image-with-Transparent-Background.png"
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-2" id="tienda">
      {categories.map((item, index) => (
        <div 
          key={index} 
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm border-b-4 border-blue-600 flex flex-col sm:flex-row lg:flex-col justify-between items-center group hover:shadow-xl transition-all min-h-48 overflow-hidden"
        >
          <div className="flex flex-col justify-between h-full z-10 flex-1 w-full sm:w-auto lg:w-full">
            <div>
              <h4 className="font-bold text-lg md:text-xl text-gray-800 leading-tight">{item.title}</h4>
              <p className="text-gray-400 text-[10px] md:text-[11px] mt-2 max-w-[140px]">{item.description}</p>
            </div>
            <button className="border border-blue-500 text-blue-600 text-[9px] md:text-[10px] font-black px-3 md:px-4 py-2 rounded w-fit hover:bg-blue-600 hover:text-white transition-colors uppercase mt-4 sm:mt-0 lg:mt-4">
              {item.buttonText}
            </button>
          </div>
          
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center flex-shrink-0 ml-0 sm:ml-4 lg:ml-0">
            <img 
              src={item.img} 
              alt={item.title} 
              className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
            />
          </div>
        </div>
      ))}
    </section>
  );
};
export default CategoryCards;