"use client";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  FileDown,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CotizacionAntamina } from "../type/cotizacion-type";
import type { ColumnDefinition } from "../../Tabla_general/type/generic-table";

interface CotizacionesActionsProps {
  cotizacion: CotizacionAntamina;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onExportExcel: (id: number) => void;
  onExportPDF: (id: number) => void;
}

export function CotizacionesActions({
  cotizacion,
  onView,
  onEdit,
  onDelete,
  onExportExcel,
  onExportPDF,
}: CotizacionesActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onView(cotizacion.idcotizaciones_antamina)}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalles
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onEdit(cotizacion.idcotizaciones_antamina)}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onExportExcel(cotizacion.idcotizaciones_antamina)}
          className="cursor-pointer"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Descargar Excel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onExportPDF(cotizacion.idcotizaciones_antamina)}
          className="cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          Descargar PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(cotizacion.idcotizaciones_antamina)}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function useCotizacionesActions(
  onView: (id: number) => void,
  onEdit: (id: number) => void,
  onDelete: (id: number) => void,
  onExportExcel: (id: number) => void,
  onExportPDF: (id: number) => void
): ColumnDefinition<CotizacionAntamina> {
  return {
    key: "idcotizaciones_antamina",
    label: "Acciones",
    render: (_value, row) => {
      return (
        <div className="text-center">
          <CotizacionesActions
            cotizacion={row}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onExportExcel={onExportExcel}
            onExportPDF={onExportPDF}
          />
        </div>
      );
    },
  };
}
