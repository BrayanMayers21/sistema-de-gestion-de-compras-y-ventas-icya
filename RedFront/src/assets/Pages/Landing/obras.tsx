import { Link } from "react-router-dom";

const obras = [
  {
    id: "saneamiento",
    title: "SANEAMIENTO",
    image: "/sanitation-construction-water-pipes-peru-workers.jpg",
  },
  {
    id: "riego",
    title: "RIEGO Y DRENAJE",
    image: "/irrigation-canal-water-drainage-system-peru.jpg",
  },
  {
    id: "edificacion",
    title: "EDIFICACIÓN Y HABILITACIÓN URBANA",
    image: "/urban-building-construction-apartments-peru.jpg",
  },
  {
    id: "vial",
    title: "VIAL",
    image: "/highway-road-construction-asphalt-mountains-peru.jpg",
  },
  {
    id: "metalicas",
    title: "ESTRUCTURAS METÁLICAS",
    image: "/metal-structure-construction-warehouse-industrial.jpg",
  },
  {
    id: "mineria",
    title: "CONEXAS A MINERÍA",
    image: "/mining-infrastructure-construction-workers-safety.jpg",
  },
  {
    id: "impuestos",
    title: "OBRAS POR IMPUESTOS",
    image: "/public-infrastructure-construction-fence-green.jpg",
  },
];

export function Obras() {
  return (
    <section id="obras" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2e7d32] mb-2">
            OBRAS
          </h2>
          <div className="w-24 h-1 bg-[#8bc34a]"></div>
        </div>

        {/* Obras Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {obras.map((obra, idx) => (
            <Link
              key={idx}
              to={`/obras/${obra.id}`}
              className="group cursor-pointer"
            >
              <h3 className="text-[#2e7d32] font-bold mb-3 text-sm uppercase tracking-wide">
                {obra.title}
              </h3>
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <img
                  src={obra.image || "/placeholder.svg"}
                  alt={obra.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Ver Detalles →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
