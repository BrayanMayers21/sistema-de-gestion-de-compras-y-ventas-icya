import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Wrench,
  Package,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { getServicioById } from "./lib/servicios-data";
import { EquipmentCarousel } from "./equipment-carousel";
import { Header } from "./header";
import { Footer } from "./footer";

export function ServicioDetail() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  const servicio = getServicioById(id);

  if (!servicio) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Header />

      <main className="pt-10">
        {/* Hero Section with Enhanced Design */}
        <div className="relative h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              backgroundImage: `url(${servicio.image || "/placeholder.svg"})`,
              filter: "brightness(0.6)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)",
              mixBlendMode: "multiply",
            }}
          />

          <div className="relative h-full flex items-center justify-center text-white px-4">
            <div className="max-w-5xl mx-auto text-center">
              <Link
                to="/#servicios"
                className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver a Servicios</span>
              </Link>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                {servicio.title}
              </h1>
              <p className="text-xl md:text-2xl font-light opacity-90">
                Alquiler y Servicios Especializados
              </p>
            </div>
          </div>

          {/* Decorative Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="rgb(249, 250, 251)"
              />
            </svg>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300 border-t-4 border-green-600">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-600 mb-2">
                Calidad
              </div>
              <div className="text-gray-600 font-medium">
                Equipos Certificados
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300 border-t-4 border-yellow-500">
              <Package className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                Variedad
              </div>
              <div className="text-gray-600 font-medium">Amplio Inventario</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300 border-t-4 border-blue-600">
              <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-2">
                Soporte
              </div>
              <div className="text-gray-600 font-medium">Asesoría Técnica</div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Description */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-green-100 text-green-600">
                <Wrench className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4 text-green-900">
                  Descripción del Servicio
                </h2>
                <div className="space-y-4">
                  {servicio.description.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-700 text-lg leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Characteristics & Equipment Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Characteristics */}
            {servicio.characteristics &&
              servicio.characteristics.length > 0 && (
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-green-100 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-900">
                      Características
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {servicio.characteristics.map((characteristic, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                        <span>{characteristic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Equipment List */}
            {servicio.equipment && servicio.equipment.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                    <Package className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900">
                    Equipos Disponibles
                  </h3>
                </div>
                <ul className="space-y-3">
                  {servicio.equipment.map((equipo, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{equipo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Equipment Carousel */}
          {servicio.equipmentImages && servicio.equipmentImages.length > 0 && (
            <div className="mb-12">
              <EquipmentCarousel
                images={servicio.equipmentImages}
                title="EQUIPOS UTILIZADOS"
              />
            </div>
          )}

          {/* Call to Action */}
          <div className="rounded-3xl shadow-2xl p-12 text-white text-center bg-gradient-to-br from-green-600 via-green-700 to-green-800">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Interesado en este servicio?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Contáctanos para más información, cotizaciones y disponibilidad de
              equipos
            </p>
            <Link
              to="/#contact"
              className="inline-block bg-white text-green-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Solicitar Cotización
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
