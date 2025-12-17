import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Client {
  id: number;
  name: string;
  logo: string;
  description?: string;
}

// Datos de ejemplo - reemplaza con tus empresas reales
const clients: Client[] = [
  {
    id: 1,
    name: "Antamina",
    logo: "/antamina.jpg",
    description: "Minería de clase mundial",
  },
  {
    id: 2,
    name: "Engie",
    logo: "/engie.png",
    description: "Construcción y desarrollo",
  },
  {
    id: 3,
    name: "Ministerio de agricultura",
    logo: "/agricultura.png",
    description: "Infraestructura vial",
  },
  {
    id: 4,
    name: "AgroRural",
    logo: "/agrorural.png",
    description: "Proyectos industriales",
  },
  {
    id: 5,
    name: "Ana",
    logo: "/ana.png",
    description: "Ingeniería civil",
  },
  //   {
  //     id: 6,
  //     name: "Empresa 6",
  //     logo: "/logos/empresa6.png",
  //     description: "Construcción sostenible",
  //   },
];

export function ClientsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const itemsPerView = 3;
  const totalSlides = Math.ceil(clients.length / itemsPerView);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const nextSlide = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  const getVisibleClients = () => {
    const start = currentIndex * itemsPerView;
    const end = start + itemsPerView;
    return clients.slice(start, end);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#2e7d32]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f59e0b]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2e7d32] mb-4">
            Nuestros Clientes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empresas que confían en nuestra experiencia y profesionalismo
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-[#2e7d32] to-[#f59e0b] mx-auto rounded-full" />
        </div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-white shadow-xl hover:shadow-2xl flex items-center justify-center text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white transition-all duration-300 group"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-white shadow-xl hover:shadow-2xl flex items-center justify-center text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white transition-all duration-300 group"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Carousel Items */}
          <div className="overflow-hidden ">
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 ease-out ${
                direction === "right"
                  ? "animate-slide-in-right"
                  : "animate-slide-in-left"
              }`}
              key={currentIndex}
            >
              {getVisibleClients().map((client, index) => (
                <div
                  key={client.id}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Card */}
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2e7d32] via-[#8bc34a] to-[#f59e0b] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative bg-white m-[2px] rounded-2xl p-8">
                      {/* Logo Container with 3D Effect */}
                      <div className="relative h-32 flex items-center justify-center mb-6 perspective-1000">
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center p-4 transform transition-transform duration-500 group-hover:rotate-y-12 group-hover:scale-105">
                          <img
                            src={client.logo || "/placeholder.svg"}
                            alt={client.name}
                            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>

                      {/* Client Name */}
                      <h3 className="text-xl font-bold text-center text-gray-800 mb-2 group-hover:text-[#2e7d32] transition-colors duration-300">
                        {client.name}
                      </h3>

                      {/* Description */}
                      {client.description && (
                        <p className="text-center text-gray-600 text-sm">
                          {client.description}
                        </p>
                      )}

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                        <div className="absolute transform rotate-45 bg-gradient-to-br from-[#2e7d32] to-[#f59e0b] w-12 h-12 top-[-24px] right-[-24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -top-3 -right-3 bg-[#f59e0b] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                    Socio
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? "w-12 h-3 bg-gradient-to-r from-[#2e7d32] to-[#8bc34a]"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir a página ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-6">
            <span className="text-sm font-semibold text-gray-500">
              {currentIndex + 1} / {totalSlides}
            </span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-[#2e7d32] mb-2">
              {clients.length}+
            </div>
            <div className="text-sm text-gray-600">Clientes Satisfechos</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-[#2e7d32] mb-2">15+</div>
            <div className="text-sm text-gray-600">Años de Experiencia</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-[#2e7d32] mb-2">100+</div>
            <div className="text-sm text-gray-600">Proyectos Completados</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-[#2e7d32] mb-2">98%</div>
            <div className="text-sm text-gray-600">Tasa de Satisfacción</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.7s ease-out;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .group:hover .transform {
          transform-style: preserve-3d;
        }

        .rotate-y-12 {
          transform: rotateY(12deg);
        }
      `}</style>
    </section>
  );
}
