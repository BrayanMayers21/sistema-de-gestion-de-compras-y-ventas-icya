import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";
import type { OrdenCompraItem, DocumentosInfo } from "../type/type";
import { CheckCircle2, XCircle } from "lucide-react";

export const ordenesColumns: ColumnDefinition<OrdenCompraItem>[] = [
  {
    key: "id_orden",
    label: "ID",
    isNumeric: true,
  },
  {
    key: "numero_orden",
    label: "Número de Orden",
  },
  {
    key: "codigo",
    label: "Código",
    render: (value: unknown) => (
      <div className="max-w-[100px] truncate" title={String(value)}>
        {String(value)}
      </div>
    ),
  },
  
  {
    key: "estado",
    label: "Estado",
    render: (value: unknown) => {
      const estado = String(value).toLowerCase();
      let colorClass = "";

      if (estado === "pagado") {
        colorClass = "text-green-600 bg-green-200";
      } else if (estado === "rechazado") {
        colorClass = "text-red-600 bg-red-100";
      } else {
        colorClass = "text-yellow-600 bg-yellow-100";
      }

      return (
        <div
          className={`max-w-[100px] truncate px-2 py-1 rounded ${colorClass}`}
          title={String(value)}
        >
          {String(value)}
        </div>
      );
    },
  },
  {
    key: "documentos_info",
    label: "Documentos",
    render: (_value: unknown, row: OrdenCompraItem) => {
      const docInfo = row.documentos_info as DocumentosInfo | undefined;

      if (!docInfo) {
        return <div className="text-gray-400 text-sm">Sin información</div>;
      }

      const { porcentaje, presentes, faltantes, completo } = docInfo;

      // Mapeo de nombres amigables
      const nombreAmigable: Record<string, string> = {
        cotizacion: "Cotización",
        factura: "Factura",
        guia: "Guía de Remisión",
        "reporte servicio": "Reporte Servicio",
        "acta de contrato": "Acta de Contrato",
      };

      return (
        <div className="flex flex-col gap-1 min-w-[200px]">
          {/* Barra de progreso */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  porcentaje === 100
                    ? "bg-green-500"
                    : porcentaje >= 67
                    ? "bg-blue-500"
                    : porcentaje >= 34
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <span className="text-xs font-semibold min-w-[35px]">
              {porcentaje}%
            </span>
          </div>

          {/* Lista de documentos */}
          <div className="flex flex-wrap gap-1">
            {presentes.map((doc) => (
              <div
                key={doc}
                className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs"
                title={`✓ ${nombreAmigable[doc] || doc}`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span className="truncate max-w-[80px]">
                  {nombreAmigable[doc]?.split(" ")[0] || doc}
                </span>
              </div>
            ))}
            {faltantes.map((doc) => (
              <div
                key={doc}
                className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs"
                title={`✗ Falta: ${nombreAmigable[doc] || doc}`}
              >
                <XCircle className="w-3 h-3" />
                <span className="truncate max-w-[80px]">
                  {nombreAmigable[doc]?.split(" ")[0] || doc}
                </span>
              </div>
            ))}
          </div>

          {/* Mensaje de completitud */}
          {completo && (
            <div className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Documentación completa
            </div>
          )}
          {faltantes.length > 0 && (
            <div className="text-xs text-red-600">
              {faltantes.length} documento(s) faltante(s)
            </div>
          )}
        </div>
      );
    },
  },
  // render: (value: boolean) => (
  //   <span
  //     className={
  //       value ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
  //     }
  //   >
  //     {value ? "Activo" : "Inactivo"}
  //   </span>
  // ),

  // {
  //   key: "ruc",
  //   label: "RUC",
  // },
  {
    key: "razon_social",
    label: "Proveedor",
  },
  // {
  //   key: "contacto_telefono",
  //   label: "Teléfono de Contacto",
  // },
  // {
  //   key: "subtotal",
  //   label: "Subtotal",
  // },
  // {
  //   key: "igv",
  //   label: "IGV",
  // },
  // {
  //   key: "adelanto",
  //   label: "Adelanto",
  // },
  {
    key: "total",
    label: "Total",
  },
];
