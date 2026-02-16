const Nosotros = () => {
  return (
    <div id="nosotros" className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Sobre Nosotros</h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-3">Nuestra Misión</h2>
              <p>
                En Robcast, nos dedicamos a proporcionar soluciones tecnológicas de calidad a precios accesibles.
                Nuestro objetivo es ser tu proveedor de confianza para todos tus equipos y accesorios informáticos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-3">Nuestra Visión</h2>
              <p>
                Ser la empresa tecnológica líder en el mercado dominicano, reconocida por nuestra excelencia
                en servicio, calidad de productos y atención al cliente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-3">¿Por qué elegirnos?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Productos de marcas reconocidas y de calidad garantizada</li>
                <li>Precios competitivos y opciones de financiamiento</li>
                <li>Servicio técnico profesional y confiable</li>
                <li>Entrega rápida en toda la República Dominicana</li>
                <li>Garantía en todos nuestros productos</li>
                <li>Equipo de vendedores capacitados y amable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-600 mb-3">Nuestra Experiencia</h2>
              <p>
                Con más de una década en el mercado, Robcast ha ganado la confianza de miles de clientes
                en la República Dominicana. Nos enorgullece ser parte de tu éxito.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Nosotros;
