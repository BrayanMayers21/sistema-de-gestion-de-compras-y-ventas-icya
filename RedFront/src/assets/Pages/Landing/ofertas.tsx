const ofertas = [
  {
    cargo: "OPERADOR DE MAQUINARIA PESADA, ESPECIALISTA EN RETROEXCAVADORA",
    area: "MINERÍA",
    fecha: "2024-01-15",
  },
  {
    cargo: "OPERADOR DE MAQUINARIA PESADA, ESPECIALISTA EN CARGADOR FRONTAL 5H",
    area: "CONSTRUCCIÓN",
    fecha: "2024-01-10",
  },
  {
    cargo: "CONTADOR PÚBLICO COLEGIADO",
    area: "FINANZAS",
    fecha: "2024-01-05",
  },
]

export function Ofertas() {
  return (
    <section id="ofertas" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2e7d32] mb-2">OFERTAS LABORALES</h2>
          <div className="w-24 h-1 bg-[#8bc34a]"></div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {ofertas.map((oferta, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* Placeholder Image */}
                <div className="w-full md:w-40 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Imagen</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">CARGO: {oferta.cargo}</h3>
                  <p className="text-[#1a365d] font-medium mb-1">ÁREA: {oferta.area}</p>
                  <p className="text-gray-500 text-sm mb-4">PUBLICADO EL: {oferta.fecha}</p>
                  <a href="#contacto" className="text-[#2e7d32] font-medium hover:underline">
                    ver oferta...
                  </a>
                </div>
              </div>
              {/* Bottom border */}
              <div className="h-1 bg-gradient-to-r from-[#607d8b] to-[#78909c]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
