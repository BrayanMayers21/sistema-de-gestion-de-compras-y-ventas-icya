export function About() {
  return (
    <section id="empresa" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2e7d32] mb-2">LA EMPRESA</h2>
          <div className="w-24 h-1 bg-[#8bc34a]"></div>
        </div>

        {/* Main Description */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed mb-6">
            Somos una empresa que se dedicada a la actividad de construcción de obras civiles, asimismo brindamos el
            servicio de consultoría en la elaboración de expedientes técnicos y formulación de proyectos de inversión
            pública a nivel de perfil, pre factibilidad y factibilidad.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nuestros clientes nos prefieren por el cumplimiento estricto de nuestros tres principios:{" "}
            <strong>La Calidad, Puntualidad y Sentido de Responsabilidad Social.</strong>
          </p>
        </div>

        {/* Vision, Mission, Politica */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Vision */}
          <div className="bg-gray-50 p-8 rounded-lg border-t-4 border-[#2e7d32]">
            <h3 className="text-xl font-bold text-[#1a365d] mb-4">VISIÓN:</h3>
            <p className="text-gray-600 leading-relaxed">
              Nuestra visión es llegar a ser una empresa reconocida en el mercado nacional, con una cultura
              organizacional basada en el conocimiento y con un claro sentido de responsabilidad social.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gray-50 p-8 rounded-lg border-t-4 border-[#f59e0b]">
            <h3 className="text-xl font-bold text-[#1a365d] mb-4">MISIÓN:</h3>
            <p className="text-gray-600 leading-relaxed">
              ICyA es una empresa dedicada a la Construcción de obras civiles y Consultoría, cuyo objetivo central es
              satisfacer las necesidades de nuestros clientes, para lo cual contamos con experiencia y equipo
              calificado.
            </p>
          </div>

          {/* Politica */}
          <div className="bg-gray-50 p-8 rounded-lg border-t-4 border-[#2e7d32]">
            <h3 className="text-xl font-bold text-[#1a365d] mb-4">POLÍTICA:</h3>
            <p className="text-gray-600 leading-relaxed">
              En el desempeño de nuestro trabajo hacemos uso de los más altos estándares en el comportamiento individual
              y colectivo, siendo honestos y transparentes en nuestro actuar, manteniendo la palabra empeñada,
              cumpliendo la legislación vigente y actuando siempre con seriedad en cada una de nuestras decisiones.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
