import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const clients = [
  { id: 1, name: "ENGIE", logo: "/engie.png" },
  { id: 2, name: "Antamina", logo: "/antamina.jpg" },
  { id: 3, name: "Ministerio de Agricultura", logo: "/agricultura.png" },
  { id: 4, name: "AgroRural", logo: "/agrorural.png" },
  { id: 5, name: "ANA", logo: "/ana.png" },
  // { id: 6, name: "ANA", logo: "/ana.png" },
  // { id: 7, name: "ANA", logo: "/ana.png" },
  // { id: 8, name: "ANA", logo: "/ana.png" },
  // { id: 9, name: "ANA", logo: "/ana.png" },
  // { id: 10, name: "ANA", logo: "/ana.png" },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % clients.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center pt-14"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/construction-workers-engineers-with-helmets-review.jpg')`,
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#19381b]/90 via-[#19381b]/80 to-[#19381b]/60 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 w-full">
        <div className="max-w-3xl">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            ICYA E.I.R.L.
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-[#f59e0b] font-semibold mb-6 uppercase tracking-wide">
            Ingeniería del Concreto y Albañilería
          </p>

          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-xl">
            Líderes en ejecución de obras civiles, consultoría y alquiler de
            maquinaria pesada en Huaraz y Ancash
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#f59e0b] text-white rounded-full font-medium hover:bg-[#d97706] transition-all group"
            >
              Contáctanos Ahora
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-[#1a365d] transition-all"
            >
              Nuestros Servicios
            </a>
          </div>

          {/* Clients Carousel */}
          <div className="mt-16 border-t border-white/20 pt-8">
            <p className="text-white/70 text-sm font-medium mb-6 uppercase tracking-wider">
              Empresas que confían en nosotros
            </p>

            <div className="relative overflow-hidden">
              {/* Carousel Track */}
              <div className="flex items-center gap-8">
                {clients.map((client, index) => {
                  const isActive = index === currentIndex;
                  const isPrev =
                    index ===
                    (currentIndex - 1 + clients.length) % clients.length;
                  const isNext = index === (currentIndex + 1) % clients.length;
                  const isVisible = isActive || isPrev || isNext;

                  return (
                    <div
                      key={client.id}
                      className={`transition-all duration-700 ease-out ${
                        isVisible ? "opacity-100" : "opacity-0 absolute"
                      } ${isActive ? "scale-110 z-10" : "scale-90 opacity-70"}`}
                      style={{
                        transform: `translateX(${
                          isActive
                            ? "0%"
                            : isPrev
                            ? "-120%"
                            : isNext
                            ? "120%"
                            : "0%"
                        })`,
                      }}
                    >
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-44 h-28 flex items-center justify-center shadow-2xl hover:shadow-[#f59e0b]/20 transition-all duration-300 group">
                        <img
                          src={client.logo || "/placeholder.svg"}
                          alt={client.name}
                          className="max-w-full max-h-full object-contain filter grayscale-0 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {clients.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentIndex === index
                        ? "w-8 h-2 bg-[#f59e0b]"
                        : "w-2 h-2 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Ir a cliente ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
