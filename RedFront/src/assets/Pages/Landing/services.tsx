import { Link } from "react-router-dom";
import { serviciosData } from "./lib/servicios-data";


export function Services() {
  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2e7d32] mb-2">
            SERVICIOS
          </h2>
          <div className="w-24 h-1 bg-[#8bc34a]"></div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviciosData.map((servicio) => (
            <Link
              key={servicio.id}
              to={`/servicios/${servicio.id}`}
              className="group cursor-pointer"
            >
              <h3 className="text-[#2e7d32] font-bold mb-3 text-sm uppercase tracking-wide group-hover:text-[#8bc34a] transition-colors">
                {servicio.title}
              </h3>
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <img
                  src={servicio.image || "/placeholder.svg"}
                  alt={servicio.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
