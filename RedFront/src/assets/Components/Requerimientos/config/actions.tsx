import { Pencil, Trash2, FileText, Eye } from "lucide-react";
import toast from "react-hot-toast";
import type { TableAction } from "../../Tabla_general/type/generic-table";
import type { RequerimientoItem } from "../type/type";
import { RequerimientosService } from "../services/requerimiento-service";

export interface RequerimientosActionsConfig {
  requerimientos: RequerimientoItem[];
  setSelectedRequerimiento: (requerimiento: RequerimientoItem | null) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDetailModalOpen?: (open: boolean) => void; // Opcional por ahora
  setSelectedRequerimientoId?: (id: number | null) => void; // Opcional por ahora
  deleteItem: (id: number | string) => Promise<any>;
}

export const createRequerimientosActions = (
  config: RequerimientosActionsConfig
): TableAction[] => {
  const {
    requerimientos,
    setSelectedRequerimiento,
    setIsEditModalOpen,
    deleteItem,
  } = config;

  return [
    {
      icon: Pencil,
      label: "Editar",
      permission: "usuarios.view",
      showOnMobile: true,
      onClick: (id) => {
        const requerimiento = requerimientos.find((r) => r.id === Number(id));
        if (requerimiento) {
          setSelectedRequerimiento(requerimiento);
          setIsEditModalOpen(true);
        }
      },
    },
    {
      icon: FileText,
      label: "Descargar PDF",
      permission: "usuarios.view",
      variant: "secondary",
      showOnMobile: true,
      onClick: async (id) => {
        await toast.promise(RequerimientosService.descargarPDF(Number(id)), {
          loading: "Generando PDF...",
          success: "PDF descargado correctamente",
          error: (error: any) =>
            `Error al generar PDF: ${error.message || error}`,
        });
      },
    },
    {
      icon: Eye,
      label: "Ver PDF",
      permission: "usuarios.view",
      variant: "outline",
      showOnMobile: false,
      onClick: (id) => {
        try {
          const ventanaAbierta = RequerimientosService.verPDFEnNuevaVentana(
            Number(id)
          );
          if (!ventanaAbierta) {
            toast.error(
              "El navegador bloqueó la ventana emergente. Permite ventanas emergentes para ver el PDF."
            );
          } else {
            toast.success("PDF abierto en nueva ventana");
          }
        } catch (error: any) {
          toast.error(`Error al abrir PDF: ${error.message || error}`);
        }
      },
    },
    {
      icon: Trash2,
      label: "Eliminar",
      permission: "usuarios.view",
      variant: "destructive",
      showOnMobile: false,
      onClick: async (id) => {
        await toast.promise(deleteItem(id), {
          loading: "Eliminando requerimiento...",
          success: (result: any) => {
            if (result.success) {
              return result.message;
            } else {
              throw new Error(result.message);
            }
          },
          error: (error: any) => error.message || "Error al eliminar",
        });
      },
    },
  ];
};

// Hook personalizado para usar las acciones de requerimientos
export const useRequerimientosActions = (
  config: RequerimientosActionsConfig
) => {
  return createRequerimientosActions(config);
};
