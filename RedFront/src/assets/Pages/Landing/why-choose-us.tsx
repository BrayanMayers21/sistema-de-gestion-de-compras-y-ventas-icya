import { Award, Clock, Users, Wrench } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "25+ Años de Experiencia",
    description: "Trayectoria comprobada en proyectos de ingeniería civil desde 1999.",
  },
  {
    icon: Users,
    title: "Equipo Profesional",
    description: "Ingenieros y técnicos certificados con amplia experiencia en campo.",
  },
  {
    icon: Wrench,
    title: "Equipos Modernos",
    description: "Maquinaria pesada actualizada y herramientas de última generación.",
  },
  {
    icon: Clock,
    title: "Cumplimiento",
    description: "Proyectos entregados a tiempo y dentro del presupuesto acordado.",
  },
]

export function WhyChooseUs() {
  return (
    <section id="nosotros" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Nosotros</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Construimos con pasión y precisión</h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              ICYA E.I.R.L. es una empresa dedicada a la ingeniería del concreto y albañilería, con presencia en Huaraz
              y Lima. Nos especializamos en brindar soluciones integrales de construcción con los más altos estándares
              de calidad.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl -rotate-3" />
            <img
              src="/professional-construction-engineers-team-working-o.jpg"
              alt="Equipo ICYA en obra"
              className="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
