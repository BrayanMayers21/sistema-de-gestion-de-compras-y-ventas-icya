import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";
import type { RequerimientoItem } from "../type/type";

export const requerimientosColumns: ColumnDefinition<RequerimientoItem>[] = [
  {
    key: "id",
    label: "ID",
    isNumeric: true,
  },
  {
    key: "producto",
    label: "Producto",
    render: (value: unknown) => (
      <div className="max-w-[150px] truncate" title={String(value)}>
        {String(value)}
      </div>
    ),
  },
  {
    key: "unidad_medida",
    label: "Unidad de Medida",
    render: (value: unknown) => (
      <div className="max-w-[100px] truncate" title={String(value)}>
        {String(value)}
      </div>
    ),
  },
  {
    key: "descripcion_producto",
    label: "Descripción",
    render: (value: unknown) => (
      <div className="max-w-[200px] truncate" title={String(value)}>
        {String(value)}
      </div>
    ),
  },
  {
    key: "cantidad",
    label: "Cantidad",
    isNumeric: true,
  },
  {
    key: "proveedor",
    label: "Proveedor",
    render: (value: unknown) => (
      <div className="max-w-[150px] truncate" title={String(value)}>
        {String(value)}
      </div>
    ),
  },
  {
    key: "observaciones",
    label: "Observaciones",
    render: (value: unknown) => (
      <div
        className="max-w-[150px] truncate"
        title={String(value) || "Sin observaciones"}
      >
        {String(value) || "Sin observaciones"}
      </div>
    ),
  },
];
