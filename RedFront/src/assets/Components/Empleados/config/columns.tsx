import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";
import type { EmpleadoItem } from "../type/type";

export const empleadosColumns: ColumnDefinition<EmpleadoItem>[] = [
  {
    key: "nombres",
    label: "Nombres",
    render: (_value: unknown, row: any) => (
      <div className="font-medium">
        {`${row.nombres} ${row.primer_apell} ${row.segundo_apell}`}
      </div>
    ),
  },
  {
    key: "nom_cargo_empleado",
    label: "Cargo",
    render: (value: unknown) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {String(value)}
      </span>
    ),
  },
  {
    key: "nom_genero",
    label: "Género",
  },
  {
    key: "sueldo",
    label: "Sueldo",
    render: (value: unknown) => (
      <div className="font-medium text-green-700">
        S/.{" "}
        {Number(value).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
      </div>
    ),
  },
  {
    key: "cuenta_bcp",
    label: "Cuenta BCP",
    render: (value: unknown) => (
      <div className="font-mono text-sm text-gray-600">
        {value ? String(value) : "Sin cuenta"}
      </div>
    ),
  },
  {
    key: "fecha_registro_empleado",
    label: "Fecha de Registro",
    render: (value: unknown) => {
      if (!value) return "Sin fecha";
      const fecha = new Date(String(value));
      return (
        <div className="text-sm text-gray-600">
          {fecha.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      );
    },
  },
];
