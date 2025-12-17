import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";
import type { ObraItem } from "../type/type";

export const obrasColumns: ColumnDefinition<ObraItem>[] = [
  {
    key: "codigo",
    label: "Código",
    render: (value: unknown) => (
      <div className="font-mono font-medium" title={String(value)}>
        {String(value)}
      </div>
    ),
  },
  {
    key: "nom_obra",
    label: "Nombre de Obra",
    render: (value: unknown) => (
      <div className="max-w-[300px] truncate font-medium" title={String(value)}>
        {String(value)}
      </div>
    ),
  },
];

// Mantener las columnas de productos por compatibilidad
