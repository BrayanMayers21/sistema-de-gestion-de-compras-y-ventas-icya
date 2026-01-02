import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";
import type { Capacitacion } from "../type/type";

export const capacitacionesColumns: ColumnDefinition<Capacitacion>[] = [
  {
    key: "codigo",
    label: "Código",
    render: (value: unknown) => (
      <div className="font-medium text-blue-600">{String(value)}</div>
    ),
  },
  {
    key: "fecha_capacitacion",
    label: "Fecha",
    render: (value: unknown) => {
      if (!value) return "Sin fecha";
      const fecha = new Date(String(value));
      return (
        <div className="text-sm">
          {fecha.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    key: "tema_capacitacion",
    label: "Tema",
    render: (value: unknown) => (
      <div className="font-medium max-w-xs truncate">{String(value)}</div>
    ),
  },
  {
    key: "tipo_actividad",
    label: "Tipo",
    render: (value: unknown) => {
      const tipo = String(value);
      const colores: Record<string, string> = {
        induccion: "bg-blue-100 text-blue-800",
        capacitacion: "bg-green-100 text-green-800",
        entrenamiento: "bg-purple-100 text-purple-800",
        charla: "bg-yellow-100 text-yellow-800",
        simulacro: "bg-red-100 text-red-800",
        otros: "bg-gray-100 text-gray-800",
      };
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            colores[tipo] || "bg-gray-100 text-gray-800"
          }`}
        >
          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
        </span>
      );
    },
  },
  {
    key: "capacitador",
    label: "Capacitador",
    render: (value: unknown) => (
      <div className="text-sm text-gray-700">{String(value)}</div>
    ),
  },
  {
    key: "total_asistentes",
    label: "Asistentes",
    render: (value: unknown) => (
      <div className="text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
          {String(value !== null && value !== undefined ? value : 0)}
        </span>
      </div>
    ),
  },
  {
    key: "num_horas",
    label: "Horas",
    render: (value: unknown) => (
      <div className="text-center text-sm">{value ? `${value}h` : "N/A"}</div>
    ),
  },
];
