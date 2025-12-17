import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Building2,
  Wrench,
  Users,
  Award,
} from "lucide-react";
import { Header } from "./header";
import { Footer } from "./footer";

interface ObraData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  stats: {
    label: string;
    value: string;
  }[];
  gallery: string[];
  advantages: string[];
  color: string;
  accentColor: string;
}

const obrasData: Record<string, ObraData> = {
  saneamiento: {
    id: "saneamiento",
    title: "SANEAMIENTO",
    subtitle: "Infraestructura de Agua Potable y Alcantarillado",
    description:
      "Tenemos amplia experiencia a nivel nacional en obras de saneamiento tales como agua potable y alcantarillado con sus componentes como líneas de conducción, líneas de impulsión, líneas de aducción, colectores, galerías filtrantes, reservorios, pozos, cisternas, cámaras de bombeo, plantas de tratamiento de agua potable, plantas de tratamiento de aguas residuales, lagunas de oxidación, conexiones domiciliarias de agua potable, conexiones domiciliarias de alcantarillado, sistemas de drenaje y alcantarillado.",
    image: "/sanitation-construction-water-pipes-peru-workers.jpg",
    features: [
      "Líneas de conducción e impulsión",
      "Colectores y galerías filtrantes",
      "Reservorios y cisternas",
      "Plantas de tratamiento de agua potable",
      "Plantas de tratamiento de aguas residuales",
      "Lagunas de oxidación",
      "Conexiones domiciliarias completas",
      "Sistemas de drenaje",
    ],
    stats: [
      { label: "Proyectos Completados", value: "150+" },
      { label: "Años de Experiencia", value: "20+" },
      { label: "Hectáreas Cubiertas", value: "5000+" },
    ],
    gallery: [
      "/sanitation-construction-water-pipes-peru-workers.jpg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    advantages: [
      "Experiencia nacional comprobada",
      "Equipos especializados",
      "Cumplimiento de normativas sanitarias",
      "Tecnología de punta",
    ],
    color: "#0288d1",
    accentColor: "#4fc3f7",
  },
  riego: {
    id: "riego",
    title: "RIEGO Y DRENAJE",
    subtitle: "Sistemas Hidráulicos para la Agricultura",
    description:
      "Proporcionamos la mejor solución en sistemas hidráulicos para la agricultura, nuestra experiencia nos ha permitido diseñar y construir sistemas de riego con un buen diseño hidráulico, una buena eficiencia de riego y calidad de los materiales. Hemos ejecutado obras de riego tales como canales, redes de riego, presurizado, desarenadores y reservorios de almacenamiento de agua, para ampliar y recuperar la frontera agrícola en miles de hectáreas.",
    image: "/irrigation-canal-water-drainage-system-peru.jpg",
    features: [
      "Canales de riego",
      "Redes de riego completas",
      "Sistemas presurizados",
      "Desarenadores",
      "Reservorios de almacenamiento",
      "Diseño hidráulico optimizado",
      "Tecnología de eficiencia hídrica",
    ],
    stats: [
      { label: "Hectáreas Recuperadas", value: "8000+" },
      { label: "Canales Construidos", value: "200km+" },
      { label: "Eficiencia de Riego", value: "95%" },
    ],
    gallery: [
      "/irrigation-canal-water-drainage-system-peru.jpg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    advantages: [
      "Diseño hidráulico especializado",
      "Materiales de alta calidad",
      "Eficiencia probada en riego",
      "Ampliación de frontera agrícola",
    ],
    color: "#388e3c",
    accentColor: "#66bb6a",
  },
  edificacion: {
    id: "edificacion",
    title: "EDIFICACIÓN Y HABILITACIÓN URBANA",
    subtitle: "Construcción de Alto Nivel",
    description:
      "Ejecutamos obras de edificación y habilitación urbana públicas y privadas, para lo cual disponemos de medios, maquinaria, personal y profesionales con experiencia y calidad acumuladas durante años. El equipo técnico está acostumbrado a cumplir los estándares más exigentes para ejecutar obras de alto nivel, siempre bajo estrictos procedimientos de control y seguimiento.",
    image: "/urban-building-construction-apartments-peru.jpg",
    features: [
      "Edificaciones públicas y privadas",
      "Habilitación urbana integral",
      "Maquinaria de última generación",
      "Personal altamente calificado",
      "Control de calidad estricto",
      "Cumplimiento de estándares internacionales",
    ],
    stats: [
      { label: "Edificios Construidos", value: "80+" },
      { label: "M² Construidos", value: "500,000+" },
      { label: "Satisfacción del Cliente", value: "98%" },
    ],
    gallery: [
      "/urban-building-construction-apartments-peru.jpg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    advantages: [
      "Equipos técnicos experimentados",
      "Procedimientos rigurosos",
      "Cumplimiento de plazos",
      "Calidad garantizada",
    ],
    color: "#f57c00",
    accentColor: "#ffb74d",
  },
  vial: {
    id: "vial",
    title: "OBRAS VIALES",
    subtitle: "Infraestructura de Transporte Nacional",
    description:
      "Contamos con los recursos humanos y con el equipo vial completo para desarrollar y ejecutar todo tipo de obras viales desde el desmonte, movimiento de suelos, pavimentos hasta la señalización. Construimos calles y avenidas urbanas, rutas, autopistas, rotondas, puentes, mantenimiento vial, para pavimentación de urbanizaciones y carreteras a nivel nacional.",
    image: "/highway-road-construction-asphalt-mountains-peru.jpg",
    features: [
      "Desmonte y movimiento de tierras",
      "Pavimentación completa",
      "Construcción de puentes",
      "Señalización vial",
      "Autopistas y rotondas",
      "Mantenimiento vial",
      "Carreteras nacionales",
    ],
    stats: [
      { label: "Kilómetros Pavimentados", value: "500+" },
      { label: "Puentes Construidos", value: "30+" },
      { label: "Rutas Completadas", value: "100+" },
    ],
    gallery: [
      "/highway-road-construction-asphalt-mountains-peru.jpg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    advantages: [
      "Equipo vial completo",
      "Experiencia nacional",
      "Tecnología moderna",
      "Cumplimiento normativo",
    ],
    color: "#616161",
    accentColor: "#9e9e9e",
  },
  metalicas: {
    id: "metalicas",
    title: "ESTRUCTURAS METÁLICAS",
    subtitle: "Diseño, Fabricación y Montaje Especializado",
    description:
      "Nos dedicándonos a la construcción de estructuras metálicas, realizando desde el proyecto hasta el montaje en obra. Estamos especializados en diseño, fabricación y montaje de estructuras metálicas.",
    image: "/metal-structure-construction-warehouse-industrial.jpg",
    features: [
      "Diseño estructural completo",
      "Fabricación especializada",
      "Montaje en obra",
      "Control de calidad exhaustivo",
      "Profesionales certificados",
      "Cobertura nacional",
    ],
    stats: [
      { label: "Estructuras Fabricadas", value: "200+" },
      { label: "Toneladas Procesadas", value: "5000+" },
      { label: "M² de Estructuras", value: "100,000+" },
    ],
    gallery: [
      "/metal-structure-construction-warehouse-industrial.jpg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    advantages: [
      "Equipo altamente calificado",
      "Control de calidad riguroso",
      "Fabricación precisa",
      "Alcance nacional",
    ],
    color: "#37474f",
    accentColor: "#78909c",
  },
  mineria: {
    id: "mineria",
    title: "CONEXAS A MINERÍA",
    subtitle: "Obras Civiles para el Sector Minero",
    description:
      "Realizamos trabajos de obras civiles conexos a la minería tales como: Movimientos de tierras, Construcción de plantas concentradoras, chancadoras, campamentos mineros, Construcción de todo tipo estructuras utilizando gaviones y geosintéticos, Campamentos mineros, viviendas, comedores, edificios administrativos, auditórium y otros, Muros de contención usando gaviones de gran envergadura, Construcción de canchas y presas de relaves, Construcción de carreteras y trochas, Construcción de alcantarillado y drenaje pluvial, Redes de agua y desagüe industrial, Cierre de mina.",
    image: "/mining-infrastructure-construction-workers-safety.jpg",
    features: [
      "Movimientos de tierras especializados",
      "Plantas concentradoras y chancadoras",
      "Estructuras con gaviones y geosintéticos",
      "Campamentos mineros completos",
      "Muros de contención",
      "Canchas y presas de relaves",
      "Carreteras mineras",
      "Cierre de mina",
    ],
    stats: [
      { label: "Proyectos Mineros", value: "50+" },
      { label: "Campamentos Construidos", value: "25+" },
      { label: "Km de Carreteras", value: "300+" },
    ],
    gallery: [
      "/mining-infrastructure-construction-workers-safety.jpg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    advantages: [
      "Experiencia en sector minero",
      "Cumplimiento de seguridad",
      "Tecnología especializada",
      "Proyectos complejos",
    ],
    color: "#5d4037",
    accentColor: "#8d6e63",
  },
  impuestos: {
    id: "impuestos",
    title: "OBRAS POR IMPUESTOS",
    subtitle: "Inversión Pública con Experiencia Comprobada",
    description:
      "Somos una de las empresas huaracinas con más experiencia en el rubro de obras por impuestos, contamos con profesionales calificados, con equipos de buena calidad y personal altamente capacitado para la realización del proyecto, cumpliendo todos los procedimientos de control y seguimiento.",
    image: "/public-infrastructure-construction-fence-green.jpg",
    features: [
      "Gestión integral de proyectos",
      "Cumplimiento normativo OxI",
      "Equipos de calidad certificada",
      "Personal capacitado",
      "Control y seguimiento riguroso",
      "Experiencia regional",
    ],
    stats: [
      { label: "Proyectos OxI", value: "15+" },
      { label: "Inversión Gestionada", value: "S/. 50M+" },
      { label: "Beneficiarios", value: "100,000+" },
    ],
    gallery: [
      "/public-infrastructure-construction-fence-green.jpg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    advantages: [
      "Líder regional en OxI",
      "Profesionales calificados",
      "Impacto social comprobado",
      "Transparencia total",
    ],
    color: "#1b5e20",
    accentColor: "#4caf50",
  },
};

export function ObraDetail() {
  const { id } = useParams<{ id: string }>();
  const obra = id ? obrasData[id] : null;

  if (!obra) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Obra no encontrada
          </h1>
          <Link to="/#obras" className="text-blue-600 hover:underline">
            Volver a obras
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url(${obra.image})`,
            filter: "brightness(0.7)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${obra.color}dd 0%, ${obra.accentColor}dd 100%)`,
            mixBlendMode: "multiply",
          }}
        />

        <div className="relative h-full flex items-center justify-center text-white px-4">
          <div className="max-w-5xl mx-auto text-center">
            <Link
              to="/#obras"
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Obras</span>
            </Link>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              {obra.title}
            </h1>
            <p className="text-2xl md:text-3xl font-light opacity-90">
              {obra.subtitle}
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
          {obra.stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300"
              style={{ borderTop: `4px solid ${obra.color}` }}
            >
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: obra.color }}
              >
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div
              className="p-4 rounded-2xl"
              style={{ backgroundColor: `${obra.color}20`, color: obra.color }}
            >
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: obra.color }}
              >
                Descripción del Servicio
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {obra.description}
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Features */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: `${obra.color}20`,
                  color: obra.color,
                }}
              >
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold" style={{ color: obra.color }}>
                Servicios Incluidos
              </h3>
            </div>
            <ul className="space-y-3">
              {obra.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle
                    className="w-5 h-5 mt-1 flex-shrink-0"
                    style={{ color: obra.accentColor }}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advantages */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: `${obra.color}20`,
                  color: obra.color,
                }}
              >
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold" style={{ color: obra.color }}>
                Nuestras Ventajas
              </h3>
            </div>
            <ul className="space-y-4">
              {obra.advantages.map((advantage, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-xl border-l-4 bg-gray-50"
                  style={{ borderColor: obra.color }}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" style={{ color: obra.color }} />
                    <span className="font-medium text-gray-800">
                      {advantage}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
