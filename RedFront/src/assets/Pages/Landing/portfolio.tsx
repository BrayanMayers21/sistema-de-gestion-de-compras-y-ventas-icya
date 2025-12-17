import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    title: "Sistema de Riego Yanacahuanca",
    category: "Obras Hidráulicas",
    image: "/irrigation-system-agriculture-water-channels.jpg",
    location: "Huaraz",
  },
  {
    title: "Carretera Ancash - Huaraz",
    category: "Obras Viales",
    image: "/mountain-highway-road-construction-peru.jpg",
    location: "Ancash",
  },
  {
    title: "Edificio Institucional",
    category: "Edificaciones",
    image: "/modern-institutional-building-construction.jpg",
    location: "Huaraz",
  },
  {
    title: "Planta de Tratamiento",
    category: "Saneamiento",
    image: "/water-treatment-plant-infrastructure.jpg",
    location: "Independencia",
  },
  {
    title: "Puente Vehicular",
    category: "Infraestructura",
    image: "/concrete-bridge-construction.jpg",
    location: "Carhuaz",
  },
  {
    title: "Movimiento de Tierras",
    category: "Terracería",
    image: "/excavation-earthwork-heavy-machinery.jpg",
    location: "Ancash",
  },
]

export function Portfolio() {
  return (
    <section id="proyectos" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Proyectos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Obras que hablan por nosotros</h2>
          </div>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            Ver todos los proyectos
            <ArrowUpRight size={18} />
          </a>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="group relative bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{project.location}</span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
