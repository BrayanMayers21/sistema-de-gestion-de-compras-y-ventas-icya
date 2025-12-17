import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Consultoria() {
  return (
    <section id="consultoria" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2e7d32] mb-2">
            CONSULTORÍA
          </h2>
          <div className="w-24 h-1 bg-[#8bc34a]"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image - Updated with placeholder showing consulting team */}
          <div className="relative group">
            <img
              src="/engineering-team-reviewing-blueprints-construction.jpg"
              alt="Consultoría ICYA"
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-all duration-300 rounded-lg"></div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-2xl font-bold text-[#1a365d] mb-6">
              Servicios de Consultoría Especializada
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Brindamos servicios de consultoría en la elaboración de
              expedientes técnicos y formulación de proyectos de inversión
              pública a nivel de perfil, pre factibilidad y factibilidad.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Obras urbanas y edificaciones",
                "Obras de saneamiento",
                "Represas e irrigaciones",
                "Elaboración de perfiles",
                "Estudios de factibilidad",
                "Expedientes técnicos",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#f59e0b] rounded-full"></span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/consultoria"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ver más detalles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
