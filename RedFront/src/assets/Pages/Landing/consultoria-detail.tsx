import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  TrendingUp,
  Lightbulb,
  Award,
  Target,
  Users,
  ClipboardCheck,
  Layers,
} from "lucide-react";
import { Header } from "./header";
import { Footer } from "./footer";

interface ConsultoriaService {
  icon: any;
  title: string;
  description: string;
  items: string[];
}

const services: ConsultoriaService[] = [
  {
    icon: FileText,
    title: "Expedientes Técnicos",
    description:
      "Elaboración completa de documentación técnica para proyectos de inversión pública y privada.",
    items: [
      "Memoria descriptiva",
      "Especificaciones técnicas",
      "Planos y diseños",
      "Metrados y presupuestos",
      "Cronogramas de ejecución",
    ],
  },
  {
    icon: Target,
    title: "Proyectos de Inversión Pública",
    description:
      "Formulación de proyectos bajo el sistema de Invierte.pe en todos sus niveles.",
    items: [
      "Perfil de proyecto",
      "Estudios de pre factibilidad",
      "Estudios de factibilidad",
      "Evaluación económica",
      "Análisis de riesgo",
    ],
  },
  {
    icon: Layers,
    title: "Estudios Especializados",
    description:
      "Estudios técnicos complementarios para proyectos de ingeniería.",
    items: [
      "Mecánica de Suelos",
      "Diseño de Estructuras Sismorresistente",
      "Estudio Geológico",
      "Estudio Hidrológico e Hidrogeológico",
      "Estudio Hidrográfico y Oceanográfico",
      "Estudio de Impacto Ambiental",
    ],
  },
];

const projectTypes = [
  {
    icon: ClipboardCheck,
    title: "Obras Hidráulicas",
    areas: [
      "Proyectos de Hidráulicos",
      "Proyectos de Saneamiento y Agua Potable",
      "Irrigación y Drenaje",
    ],
    color: "#0288d1",
  },
  {
    icon: TrendingUp,
    title: "Infraestructura Vial",
    areas: ["Proyectos Viales", "Puentes", "Túneles"],
    color: "#616161",
  },
  {
    icon: Lightbulb,
    title: "Edificaciones",
    areas: ["Habilitación Urbana", "Edificaciones", "Estructuras Metálicas"],
    color: "#f57c00",
  },
];

const advantages = [
  "Equipo multidisciplinario de profesionales especializados",
  "Más de 20 años de experiencia en consultoría",
  "Cumplimiento estricto de normativas vigentes",
  "Uso de software especializado de última generación",
  "Seguimiento y control de calidad continuo",
  "Entrega oportuna de documentación",
];

const stats = [
  { label: "Proyectos Formulados", value: "200+" },
  { label: "Expedientes Técnicos", value: "150+" },
  { label: "Estudios Especializados", value: "300+" },
];

export function ConsultoriaDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url(/engineering-team-reviewing-blueprints-construction.jpg)`,
            filter: "brightness(0.6)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            mixBlendMode: "multiply",
          }}
        />

        <div className="relative h-full flex items-center justify-center text-white px-4">
          <div className="max-w-5xl mx-auto text-center">
            <Link
              to="/#consultoria"
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </Link>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              CONSULTORÍA
            </h1>
            <p className="text-2xl md:text-3xl font-light opacity-90">
              Servicios de Ingeniería y Proyectos de Inversión
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
              fill="rgb(248, 250, 252)"
            />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300 border-t-4 border-blue-600"
            >
              <div className="text-4xl font-bold mb-2 text-blue-600">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-blue-100 text-blue-600">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-blue-900">
                Servicios de Consultoría Especializada
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Brindamos servicios de consultoría en la elaboración de
                expedientes técnicos y formulación de proyectos de inversión
                pública a nivel de perfil, pre factibilidad y factibilidad.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Elaboración de Estudio de Pre inversión e inversión para
                proyectos de Hidráulicos, proyectos de Saneamiento y Agua
                Potable, proyectos Viales, proyectos de Habilitación Urbana y de
                Edificaciones, proyectos de Irrigación y Drenaje, proyectos
                especiales como Estructuras Metálicas, Puertos, Túneles.
              </p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">
            Nuestros Servicios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2 text-gray-700 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">
            Tipos de Proyectos
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projectTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-8 border-l-4"
                  style={{ borderColor: type.color }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor: `${type.color}20`,
                        color: type.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {type.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {type.areas.map((area, areaIdx) => (
                      <li
                        key={areaIdx}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advantages Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900">
              Ventajas Competitivas
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {advantages.map((advantage, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100"
              >
                <Users className="w-6 h-6 flex-shrink-0 text-blue-600 mt-1" />
                <span className="text-gray-800 font-medium">{advantage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">
            Panel Fotográfico
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="/engineering-team-reviewing-blueprints-construction.jpg"
                alt="Estudios de campo"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="p-4 bg-white">
                <h4 className="font-bold text-gray-900">Estudios de Campo</h4>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="/placeholder.svg"
                alt="Diseño y modelamiento"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="p-4 bg-white">
                <h4 className="font-bold text-gray-900">
                  Diseño y Modelamiento
                </h4>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl group">
              <img
                src="/placeholder.svg"
                alt="Proyectos realizados"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="p-4 bg-white">
                <h4 className="font-bold text-gray-900">
                  Proyectos Realizados
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl shadow-2xl p-12 text-white text-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Necesitas consultoría para tu proyecto?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contáctanos para una evaluación profesional y elaboración de
            estudios técnicos
          </p>
          <Link
            to="/#contact"
            className="inline-block bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Solicitar Consultoría
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
