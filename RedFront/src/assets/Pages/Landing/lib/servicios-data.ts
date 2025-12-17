export interface Servicio {
  id: string
  title: string
  image: string
  description: string[]
  characteristics?: string[]
  equipment?: string[]
  equipmentImages: string[]
}

export const serviciosData: Servicio[] = [
  {
    id: "instalacion-geosinteticos",
    title: "INSTALACIÓN DE GEOSINTÉTICOS",
    image: "/geosynthetics-installation-membrane-construction-w.jpg",
    description: [
      "Proveemos un completo servicio de instalación de GEOSINTÉTICOS (soldadura por extrusión y fusión). Nuestra capacidad de trabajo nos permite atender su proyecto a través de todo el territorio nacional.",
      "Contamos con un equipo calificado y con procedimientos de control de calidad, lo mismo que nos permite asegurar una instalación correcta de nuestros productos en proyectos como:",
    ],
    characteristics: [
      "Instalación de Geomembranas",
      "Instalación de Geotextiles",
      "Instalación de Geoceldas",
      "Instalación de Geotubos",
      "Instalación de Geomalla",
    ],
    equipmentImages: [
      "/geomembrane-welding-machine-green-industrial.jpg",
      "/extrusion-welding-gun-plastic.jpg",
      "/hot-air-welding-tool-geosynthetics.jpg",
      "/welding-rod-geomembrane-installation.jpg",
    ],
  },
  {
    id: "instalacion-tuberias-hdpe",
    title: "INSTALACIÓN DE TUBERÍAS HDPE",
    image: "/hdpe-pipe-installation-workers-orange-vests-thermo.jpg",
    description: [
      "Somos especialistas en soldadura por termofusión, trabajamos para entregar un buen servicio a nuestros clientes. Realizamos proyectos de riego, líneas de aducción de agua potable, línea de impulsión para alcantarillado, acoplamiento a líneas de agua, etc.",
      "Nuestro servicio se orienta en el área Minera y Construcción, respaldado por un equipo humano calificado y de gran experiencia en el rubro. Disponemos de equipos propios de termofusión para diferentes diámetros.",
      "El servicio es a nivel nacional",
    ],
    equipmentImages: [
      "/thermofusion-welding-machine-blue-hdpe-pipes.jpg",
      "/pipe-butt-fusion-machine-industrial.jpg",
      "/hdpe-pipe-fittings-elbow-black.jpg",
      "/electrofusion-welding-machine-pipes.jpg",
    ],
  },
  {
    id: "alquiler-camion-grua",
    title: "ALQUILER DE CAMIÓN GRÚA",
    image: "/crane-truck-red-heavy-machinery-rental-constructio.jpg",
    description: [
      "Somos una empresa con alta experiencia y trayectoria en el mercado, dedicada al servicio de alquiler camión grúa. Además ofrecemos servicios de transporte de carga a nivel nacional.",
      "En nuestro servicio Ofrecemos soluciones innovadoras de izaje y manipuleo de cargas para lo cual contando con personal con amplia experiencia.",
    ],
    characteristics: [
      "Izajes de postes",
      "Montajes y desmontajes de estructuras",
      "Contenedores",
      "Proyectos de electrificación",
      "Maquinarias pesadas",
    ],
    equipmentImages: [
      "/crane-arm-hydraulic-yellow-attachment.jpg",
      "/hiab-crane-truck-white-flatbed.jpg",
      "/truck-mounted-crane-red-heavy-duty.jpg",
      "/telescopic-crane-arm-truck.jpg",
    ],
  },
  {
    id: "bombeo-concreto",
    title: "BOMBEO DE CONCRETO",
    image: "/concrete-pump-truck-yellow-construction-machinery.jpg",
    description: [
      "Nuestros equipos de bombeo se adaptan a las necesidades de los distintos tipos de obras y trabajos a realizar. Contamos con personal calificado y experimentado que evalúa la necesidad del cliente planteando soluciones para mayor productividad, minimizando tiempos, costos y riesgos en obra.",
      "Contamos con bomba estacionaria TK 40 PUTZMEISTER, cuyo rendimiento es de 20m³/h.",
    ],
    equipmentImages: [
      "/putzmeister-concrete-pump-stationary-orange.jpg",
      "/concrete-pump-hose-flexible-black.jpg",
      "/concrete-delivery-pipe-steel.jpg",
      "/placeholder.svg?height=200&width=200",
    ],
  },
  {
    id: "movimiento-tierras",
    title: "MOVIMIENTO DE TIERRAS",
    image: "/excavator-earthmoving-yellow-caterpillar-construct.jpg",
    description: [
      "Contamos con toda la maquinaria requerida y operadores altamente calificados para movimiento de tierras, retiro de escombros, y nivelación de terreno; nos desplazamos a nivel nacional y a donde nos indique el cliente, cumpliendo esta tarea en los tiempos requeridos por nuestros clientes.",
    ],
    equipmentImages: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
  },
  {
    id: "alquiler-andamio",
    title: "ALQUILER DE ANDAMIO",
    image: "/scaffolding-rental-construction-workers-safety.jpg",
    description: [
      "Tenemos andamios LAYHER en alquiler para todo tipo de trabajo en altura, normado y homologado por estándares europeos. Así mismo contamos con personal capacitado y experimentado para el armado.",
    ],
    equipmentImages: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
  },
  {
    id: "alquiler-auto-hormigonera",
    title: "ALQUILER DE AUTO HORMIGONERA",
    image: "/concrete-mixer-truck-yellow-construction-site.jpg",
    description: [
      "Contamos con CARMIX 3.5 TT que gracias a las tecnologías y soluciones adoptadas se auto alimenta, produce, transporta y descarga más de 100 m3 de hormigón al día; reduce notablemente los costos de producción del hormigón; elimina los desperdicios (también de tiempo) y racionaliza la obra produciendo solo lo que se necesita y solo cuando lo requiere.",
    ],
    characteristics: [
      "Capacidad 4850 litros, producción real hormigón 3,5 m3 por amasada",
      "Doble hélice",
      "Tapa de registro para vaciar en caso de emergencia",
      "Accionamiento por motor hidráulico con reductora hepicicloidal",
      "Regulación de la velocidad de amasado y descarga con independencia de la velocidad de giro del motor diesel",
      "Descarga por inversión de giro",
      "Rotación de cuba (300°) permite descargar a más de 2 metros de altura a los 4 lados de la máquina",
    ],
    equipmentImages: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
  },
  {
    id: "demolicion-hilo-diamantado",
    title: "DEMOLICIÓN CON HILO DIAMANTADO",
    image: "/diamond-wire-cutting-demolition-equipment-orange-h.jpg",
    description: [
      "Contamos equipo de corte de concreto y perforación diamantado y podemos realizar demoliciones de vigas, columnas, muros pantalla, placas, pisos, zapatas, estribos entre otros.",
      "Realizamos perforaciones, ampliación de ductos, circulaciones, ductos de iluminación y ventilación, para lo cual contamos con equipos de la línea.",
    ],
    characteristics: [
      "Intervenimos donde otros sistemas no sirven",
      "Se puede cortar grandes superficies",
      "Trabajos sub acuáticos",
      "No se genera chispas",
      "Pérdidas mínima de estructura a cortar",
      "No se genera polvo",
      "No se produce esquirlas",
      "No se produce daños a las estructuras colindantes",
      "Trabajo en lugares de difícil acceso",
      "Cortes rectos y cortes curvos de acuerdo a la necesidad",
    ],
    equipment: [
      "Cortadora de Hilo de Diamante Husqvarna CS 2512",
      "Perforadora Husqvarna DMS 240",
      "Cortadora Manual Husqvarna K6500 Ring",
    ],
    equipmentImages: [
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
      "/placeholder.svg?height=200&width=200",
    ],
  },
]

export function getServicioById(id: string): Servicio | undefined {
  return serviciosData.find((s) => s.id === id)
}
