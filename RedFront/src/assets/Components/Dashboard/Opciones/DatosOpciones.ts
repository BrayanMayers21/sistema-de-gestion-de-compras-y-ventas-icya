import {
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  Map,
  type LucideIcon,
  CalendarDays,
  BarChart4,
  Layers,
  PackageSearch,
  Building2,
  FileText,
  ShieldCheck,
  Users,
  ClipboardCheck,
} from "lucide-react";

export interface MenuItem {
  id?: number;
  name?: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  permiso: string;
  isActive?: boolean;
  clase?: string;
  items?: MenuItem[];
}

export interface MenuGroup {
  titulo: string;
  items: {
    [key: string]: MenuItem;
  };
}

export interface MenuData {
  [key: string]: MenuGroup;
}

export const datosOpciones: MenuData = {
  grupo: {
    titulo: "Platform",
    items: {
      proyectos: {
        permiso: "usuarios.view",
        title: "Proyectos",
        url: "/psrueba",
        icon: GalleryVerticalEnd,
        isActive: false,
        clase: "",
        items: [
          {
            id: 1,
            name: "Design Engineering",
            title: "Design Engineering",
            url: "/empleados/lista",
            icon: Frame,
            permiso: "usuarios.view",
            clase: "",
          },
          {
            id: 2,
            name: "Sales & Marketing",
            title: "Sales & Marketing",
            url: "#",
            icon: PieChart,
            permiso: "usuarios.view",
            clase: "",
          },
          {
            id: 3,
            name: "Travel",
            title: "Travel",
            url: "#",
            icon: Map,
            permiso: "usuarios.view",
            clase: "",
          },
        ],
      },
    },
  },
  grupo2: {
    titulo: "Usuarios",
    items: {
      settings: {
        permiso: "usuarios.view",
        title: "Usuarios",
        url: "/usuarios/lista",
        icon: Settings2,
        isActive: false,
        clase: "",
      },
    },
  },
  grupo3: {
    titulo: "Gestión de Personal",
    items: {
      empleados: {
        permiso: "usuarios.view",
        title: "Empleados",
        url: "/empleados",
        icon: Users,
        clase: "",
        items: [
          {
            id: 1,
            name: "Oficina",
            title: "OFICINA",
            url: "/oficina-empleados",
            icon: Frame,
            permiso: "usuarios.view",
            clase: "",
          },
          {
            id: 2,
            name: "Sales & Marketing",
            title: "Sales & Marketing",
            url: "#",
            icon: PieChart,
            permiso: "usuarios.view",
            clase: "",
          },
          {
            id: 3,
            name: "Travel",
            title: "Travel",
            url: "#",
            icon: Map,
            permiso: "usuarios.view",
            clase: "",
          },
        ],
      },
      asistencias: {
        permiso: "usuarios.view",
        title: "Asistencias",
        url: "/asistencias",
        icon: ClipboardCheck,
        clase: "",
      },
      roles: {
        permiso: "usuarios.view",
        title: "Roles y Permisos",
        url: "/roles",
        icon: ShieldCheck,
        clase: "",
        items: [
          {
            id: 1,
            name: "Design Engineering",
            title: "Design Engineering",
            url: "/psrueba",
            icon: Frame,
            permiso: "usuarios.view",
            clase: "",
          },
          {
            id: 2,
            name: "Sales & Marketing",
            title: "Sales & Marketing",
            url: "#",
            icon: PieChart,
            permiso: "usuarios.view",
            clase: "",
          },
          {
            id: 3,
            name: "Travel",
            title: "Travel",
            url: "#",
            icon: Map,
            permiso: "usuarios.view",
            clase: "",
          },
        ],
      },
    },
  },

  grupo4: {
    titulo: "Recursos",
    items: {
      documentos: {
        permiso: "usuarios.view",
        title: "Orden de Compra-Servicio",
        url: "/orden",
        icon: FileText,
        clase: "",
      },
      areas: {
        permiso: "usuarios.view",
        title: "Áreas",
        url: "/areas",
        icon: Building2,
        clase: "",
      },
    },
  },

  grupo5: {
    titulo: "Inventario",
    items: {
      productos: {
        permiso: "usuarios.view",
        title: "Materiales de Obra",
        url: "/productos",
        icon: PackageSearch,
        clase: "",
      },
      categorias: {
        permiso: "usuarios.view",
        title: "Categorías",
        url: "/categorias",
        icon: Layers,
        clase: "",
      },
      OBRAS11: {
        permiso: "usuarios.view",
        title: "Obras",
        url: "/obras",
        icon: Layers,
        clase: "",
      },
    },
  },

  grupo6: {
    titulo: "Reportes",
    items: {
      reportes: {
        permiso: "usuarios.view",
        title: "Estadísticas",
        url: "/reportes",
        icon: BarChart4,
        clase: "",
      },
      calendario: {
        permiso: "usuarios.view",
        title: "Calendario",
        url: "/calendario",
        icon: CalendarDays,
        clase: "",
      },
    },
  },
  grupo7: {
    titulo: "Cotizaciones",
    items: {
      cotizacion: {
        permiso: "usuarios.view",
        title: "Cotizaciones",
        url: "/cotizaciones",
        icon: BarChart4,
        clase: "",
      },
    },
  },
  grupo87: {
    titulo: "Cotizaciones para Antamina",
    items: {
      cotizacion: {
        permiso: "usuarios.view",
        title: "Antamina",
        url: "/cotizaciones-antamina",
        icon: BarChart4,
        clase: "",
      },
    },
  },
};
