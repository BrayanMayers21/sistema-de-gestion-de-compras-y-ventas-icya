import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";
import type { ProductoItem } from "../type/type";

export const productosColumns: ColumnDefinition<ProductoItem>[] = [
  {
    key: "codigo",
    label: "Código",
  },
  {
    key: "producto",
    label: "Producto",
    render: (value: unknown) => (
      <div className="max-w-[200px] truncate font-medium" title={String(value)}>
        {String(value)}
      </div>
    ),
  },
  {
    key: "descripcion",
    label: "Descripción",
    render: (value: unknown) => (
      <div
        className="max-w-[250px] truncate text-sm text-gray-600"
        title={String(value || "Sin descripción")}
      >
        {value ? String(value) : "Sin descripción"}
      </div>
    ),
  },
  {
    key: "unidad_medida",
    label: "Unidad de Medida",
  },
  {
    key: "categoria",
    label: "Categoría",
    render: (value: unknown) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {String(value)}
      </span>
    ),
  },
];
