const Flyer = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg overflow-hidden shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 md:p-10">
        {/* Contenido texto */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl font-black leading-tight">
            ¡Ofertas Especiales en Equipos Tecnológicos!
          </h2>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            Descubre nuestras promociones exclusivas en computadoras, laptops, impresoras y más. 
            Calidad garantizada con soporte técnico profesional.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="bg-white text-blue-600 px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-blue-50 transition whitespace-nowrap">
              Ver Ofertas
            </button>
            <button className="border-2 border-white text-white px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-white hover:text-blue-600 transition whitespace-nowrap">
              Contactanos
            </button>
          </div>
        </div>

        {/* Imagen */}
        <div className="hidden md:flex justify-center">
          <div className="text-6xl">💻</div>
        </div>
      </div>

      {/* Barra de información */}
      <div className="bg-blue-700 grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 md:px-10 py-4 text-center text-sm md:text-base">
        <div>
          <p className="font-bold">📞 Llamanos</p>
          <p className="text-blue-100">+1(809) 594-6269</p>
        </div>
        <div>
          <p className="font-bold">📧 Email</p>
          <p className="text-blue-100">ventas@robcast.com.do</p>
        </div>
        <div>
          <p className="font-bold">🚚 Envío Rápido</p>
          <p className="text-blue-100">En todo el país</p>
        </div>
      </div>
    </section>
  );
};

export default Flyer;
