import { useEffect, useState } from "react";
import ApiService from "../services/ApiService";

const defaultFlyer = {
  titulo: "OFERTA DISPONIBLE",
  subtitulo: "Optiplex 790 i5 2da Generación",
  descripcion: "Core i5 3ra gen · 4 GB RAM · HDD 500 GB",
  boton_texto: "Ver oferta",
  boton_url: "/tienda",
  imagen_url: "/optiplex-flyer.png",
  specs: {
    cpu: "Core i5 3ra gen",
    ram: "4 GB RAM",
    storage: "HDD 500 GB"
  }
};

const Flyer = () => {
  const [flyer, setFlyer] = useState(defaultFlyer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlyer = async () => {
      try {
        const data = await ApiService.getFlyer();
        const remote = data?.flyer;
        if (remote) {
          const parsedSpecs = typeof remote.specs === "string" ? JSON.parse(remote.specs || "{}") : (remote.specs || {});
          setFlyer({
            ...defaultFlyer,
            ...remote,
            specs: { ...defaultFlyer.specs, ...parsedSpecs }
          });
        }
      } catch (err) {
        // Mantener fallback si falla
        console.error("No se pudo cargar flyer remoto", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadFlyer();
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg overflow-hidden shadow-lg p-8">
        <div className="animate-pulse text-blue-100">Cargando flyer...</div>
      </section>
    );
  }

  const bgStyle = flyer.imagen_url ? { backgroundImage: `url(${flyer.imagen_url})` } : {};
  const bgClasses = flyer.imagen_url ? "bg-cover bg-center" : "bg-gradient-to-r from-blue-700 to-blue-900";

  return (
    <section
      className={`relative text-white rounded-lg overflow-hidden shadow-lg ${bgClasses}`}
      style={bgStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-900/60 to-blue-800/40" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto p-6 md:p-10 flex flex-col gap-6">
        <div className="flex flex-col gap-3 max-w-2xl">
          <p className="text-blue-200 text-xs font-semibold tracking-[0.2em] uppercase">{flyer.titulo}</p>
          <h2 className="text-3xl md:text-4xl font-black leading-tight">{flyer.subtitulo}</h2>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            {flyer.descripcion}
          </p>

          <div className="flex flex-wrap gap-2 pt-2 text-xs font-bold">
            {flyer.specs?.cpu && <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur">{flyer.specs.cpu}</span>}
            {flyer.specs?.ram && <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur">{flyer.specs.ram}</span>}
            {flyer.specs?.storage && <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur">{flyer.specs.storage}</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            {flyer.boton_texto && (
              <a
                href={flyer.boton_url || "#"}
                className="bg-white text-blue-700 px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-blue-50 transition whitespace-nowrap"
              >
                {flyer.boton_texto}
              </a>
            )}
            <a
              href="/contacto"
              className="border-2 border-white text-white px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-white hover:text-blue-700 transition whitespace-nowrap"
            >
              Contáctanos
            </a>
          </div>
        </div>

        <div className="bg-blue-900/50 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 md:px-10 py-4 text-center text-sm md:text-base rounded-lg border border-white/10">
          <div>
            <p className="font-bold">📞 Llámanos</p>
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
      </div>
    </section>
  );
};

export default Flyer;
