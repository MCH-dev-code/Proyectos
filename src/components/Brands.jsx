const Brands = () => {
  const brands = [
    {
      name: "Genius",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/Genius_logo.svg/1024px-Genius_logo.svg.png"
    },
    {
      name: "Dell",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Dell_logo_2016.svg/1024px-Dell_logo_2016.svg.png"
    },
    {
      name: "HP",
      logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAulBMVEUAAAAAQM9Yh+T///////////8hYN0CStgCS9cBStgCStgDS9kASNcCSdegu/D///+/0fUCS9oSVdphjuYeX93///8CSthhjucAStTA0vVVheQiYd1Bd+Jwmenf6PoCSdgxbN+vx/JRguQbW9zv9P0CStkDSteApOvQ3fgCStgBSdiQr+7Q3feQr+1Bd+EWV9shYNwASNkAUM8bW9qApOwCStgeXtwBSdgCStcCSdYBStcASNeyx/Kwx/NK7O+mAAAAPXRSTlMAEGCfz+///+/Pn18goP///4///48Q3/8w/zD/////j////5//72D//8/P/////8//XxCg/5CQ34CQ72Cg0ugTbgAAAVhJREFUeAFlk1WCxDAMQz2oYWbmZWa6/7U2tSZx4X2EI7uKK0YuXyiWyqhUa/WcZGk0K612uwNSa0iSXBfotdvtPjyDYeL6CMDYHeghMIqJTCpwTNvtFgyMZuG+7s+dwAKKaZg+sGy3V0gy4tc0oaxCBGOtAlA2LsIGaRom0Gorqz6A7Xm8w54CjEAOmi5Z4ZiTE5RdFKF84Vo15FCOxpfAKRah461gy6RrcgUHbVbtHQ3xSV9LBQg2j9WKG21bGgFHgULVW699p62+nMBsZnvv2jJ22joYYulVg7avjSOTXHntJbWtNh6kGWym9ti3B62Nmhplqmrz9PEx1MaTPFe86oFWEF8bOZEX7BLa5PAKRrDXMkNSzy1vMFJ19y4Rzx/w0ObAx1CUhj9Bm20/FP7Mn6AV6X3ToCHpffIJBw0hX7nMzwtaAcf33q4buZ/fYukP39XaT+z2P6OALji3hybPAAAAAElFTkSuQmCC"
    },
    {
      name: "Lenovo",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Lenovo_2015_logo.svg/1024px-Lenovo_2015_logo.svg.png"
    },
    {
      name: "Epson",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Epson_logo.svg/1024px-Epson_logo.svg.png"
    },
    {
      name: "Asus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/ASUS_Logo.svg/1024px-ASUS_Logo.svg.png"
    },
    {
      name: "Acer",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Acer_logo.svg/1024px-Acer_logo.svg.png"
    },
    {
      name: "Brother",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Brother_Industries_logo.svg/1024px-Brother_Industries_logo.svg.png"
    },
    {
      name: "Canon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Canon_logo.svg/1024px-Canon_logo.svg.png"
    },
    {
      name: "Samsung",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1024px-Samsung_Logo.svg.png"
    }
  ];

  return (
    <section className="py-8 md:py-12 px-4 md:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">
          Marcas que Confiamos
        </h2>
        
        {/* Contenedor del carrusel */}
        <div className="overflow-hidden bg-gray-50 rounded-xl py-8">
          <style>{`
            @keyframes slide {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .slide-animation {
              animation: slide 30s linear infinite;
            }
            .slide-container:hover .slide-animation {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="slide-container flex justify-start">
            <div className="slide-animation flex gap-8 md:gap-12">
              {/* Primera vuelta */}
              {brands.map((brand) => (
                <div
                  key={`${brand.name}-1`}
                  className="flex-shrink-0 flex items-center justify-center px-6 md:px-8"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-16 md:max-h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
              {/* Segunda vuelta (para el efecto infinito) */}
              {brands.map((brand) => (
                <div
                  key={`${brand.name}-2`}
                  className="flex-shrink-0 flex items-center justify-center px-6 md:px-8"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-16 md:max-h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
