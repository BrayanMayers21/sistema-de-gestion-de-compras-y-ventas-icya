import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";
import type { Categoria } from "../type/type";

export const categoriasColumns: ColumnDefinition<Categoria>[] = [
  {
    key: "id_categoria",
    label: "ID",
    isNumeric: true,
  },
  {
    key: "nombre",
    label: "Nombre",
  },
  {
    key: "descripcion",
    label: "Descripción",
  },
  {
    key: "estado",
    label: "Estado",
    render: (value: boolean) => (
      <span
        className={
          value ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
        }
      >
        {value ? "Activo" : "Inactivo"}
      </span>
    ),
  },
  {
    key: "fecha_registro",
    label: "Fecha de Registro",
  },
];
