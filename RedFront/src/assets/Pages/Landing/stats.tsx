const stats = [
  { value: "15+", label: "Años de Experiencia" },
  { value: "200+", label: "Proyectos Completados" },
  { value: "100%", label: "Clientes Satisfechos" },
  { value: "24/7", label: "Atención Disponible" },
]

export function Stats() {
  return (
    <section className="py-20 bg-[#1a365d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f59e0b] mb-2">{stat.value}</div>
              <p className="text-white/80 text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
