"use client";
import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";
import { Badge } from "@/components/ui/badge";
import type { CotizacionAntamina } from "../type/cotizacion-type";

export const cotizacionesColumns: ColumnDefinition<CotizacionAntamina>[] = [
  {
    key: "numero_cot",
    label: "N° Cotización",
    isSortable: true,
    render: (value) => <div className="font-medium text-blue-600">{value}</div>,
  },
  {
    key: "fecha_cot",
    label: "Fecha",
    isSortable: true,
    render: (value) => {
      const fecha = new Date(value);
      return (
        <div className="text-sm">
          {fecha.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    key: "cliente",
    label: "Cliente",
    isSortable: true,
    render: (value) => <div className="font-medium">{value}</div>,
  },
  {
    key: "descripcion",
    label: "Descripción",
    render: (value) => (
      <div className="max-w-[300px] truncate text-sm text-gray-600">
        {value || <span className="italic text-gray-400">Sin descripción</span>}
      </div>
    ),
  },
  {
    key: "costo_total",
    label: "Costo Total",
    isSortable: true,
    isNumeric: true,
    render: (value) => {
      const total = parseFloat(value);
      const formatted = new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
      }).format(total);
      return (
        <div className="text-right font-semibold text-green-600">
          {formatted}
        </div>
      );
    },
  },
  {
    key: "detalles" as keyof CotizacionAntamina,
    label: "N° Productos",
    render: (_value, row) => {
      const detalles = row.detalles;
      const numDetalles = detalles?.length || 0;
      return (
        <div className="text-center">
          <Badge variant="secondary">{numDetalles} items</Badge>
        </div>
      );
    },
  },
];
