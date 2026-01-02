import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";
import type { RequerimientoObra } from "../type/type";
import { Badge } from "@/components/ui/badge";

const estadoBadgeVariant = (estado: string) => {
  switch (estado) {
    case "pendiente":
      return "secondary";
    case "aprobado":
      return "default";
    case "en_proceso":
      return "outline";
    case "atendido":
      return "success";
    case "cancelado":
      return "destructive";
    default:
      return "secondary";
  }
};

const estadoTexto = (estado: string) => {
  switch (estado) {
    case "pendiente":
      return "Pendiente";
    case "aprobado":
      return "Aprobado";
    case "en_proceso":
      return "En Proceso";
    case "atendido":
      return "Atendido";
    case "cancelado":
      return "Cancelado";
    default:
      return estado;
  }
};

export const requerimientosColumns: ColumnDefinition<RequerimientoObra>[] = [
  {
    key: "numero_requerimiento",
    label: "N° Requerimiento",
    render: (value: unknown) => (
      <div className="font-medium">{String(value)}</div>
    ),
  },
  {
    key: "obra",
    label: "Obra",
    render: (value: unknown, row: RequerimientoObra) => (
      <div className="max-w-[200px] truncate" title={row.obra?.nom_obra || ""}>
        {row.obra?.nom_obra || "Sin obra"}
      </div>
    ),
  },
  {
    key: "residente_obra",
    label: "Residente de Obra",
    render: (value: unknown) => (
      <div className="max-w-[150px] truncate" title={String(value)}>
        {String(value)}
      </div>
    ),
  },
  {
    key: "fecha_requerimiento",
    label: "Fecha Requerimiento",
    render: (value: unknown) => {
      if (!value) return "-";
      const fecha = new Date(String(value));
      return fecha.toLocaleDateString("es-PE");
    },
  },
  {
    key: "fecha_atencion",
    label: "Fecha Atención",
    render: (value: unknown) => {
      if (!value) return "-";
      const fecha = new Date(String(value));
      return fecha.toLocaleDateString("es-PE");
    },
  },
  {
    key: "lugar_entrega",
    label: "Lugar de Entrega",
    render: (value: unknown) => (
      <div
        className="max-w-[150px] truncate"
        title={String(value) || "No especificado"}
      >
        {String(value) || "-"}
      </div>
    ),
  },
  {
    key: "estado",
    label: "Estado",
    render: (value: unknown) => (
      <Badge variant={estadoBadgeVariant(String(value))}>
        {estadoTexto(String(value))}
      </Badge>
    ),
  },
  {
    key: "detalles",
    label: "Productos",
    render: (value: unknown, row: RequerimientoObra) => {
      const cantidadProductos = row.detalles?.length || 0;
      return (
        <div className="text-center">
          <Badge variant="outline">{cantidadProductos}</Badge>
        </div>
      );
    },
  },
];
