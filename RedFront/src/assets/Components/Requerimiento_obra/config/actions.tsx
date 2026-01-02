import { Pencil, Trash2, Eye, FileText, FileSpreadsheet } from "lucide-react";
import toast from "react-hot-toast";
import type { TableAction } from "../../Tabla_general/type/generic-table";
import type { RequerimientoObra } from "../type/type";
import { RequerimientosService } from "../services/requerimiento-service";

export interface RequerimientosActionsConfig {
  requerimientos: RequerimientoObra[];
  setSelectedRequerimiento: (requerimiento: RequerimientoObra | null) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDetailModalOpen?: (open: boolean) => void;
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
      icon: Eye,
      label: "Ver Detalle",
      permission: "usuarios.view",
      variant: "outline",
      showOnMobile: true,
      onClick: async (id) => {
        try {
          const response = await RequerimientosService.mostrarRequerimientoObra(
            Number(id)
          );
          if (response.data) {
            // Aquí podrías abrir un modal de detalle
            toast.success("Detalles cargados");
            console.log("Detalles:", response.data);
          }
        } catch (error: any) {
          toast.error("Error al cargar los detalles");
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
      icon: FileSpreadsheet,
      label: "Descargar Excel",
      permission: "usuarios.view",
      variant: "default",
      showOnMobile: false,
      onClick: async (id) => {
        await toast.promise(RequerimientosService.descargarExcel(Number(id)), {
          loading: "Generando Excel...",
          success: "Excel descargado correctamente",
          error: (error: any) =>
            `Error al generar Excel: ${error.message || error}`,
        });
      },
    },
    {
      icon: Pencil,
      label: "Editar",
      permission: "usuarios.view",
      showOnMobile: true,
      onClick: (id) => {
        const requerimiento = requerimientos.find(
          (r) => r.id_requerimiento_obra === Number(id)
        );
        if (requerimiento) {
          setSelectedRequerimiento(requerimiento);
          setIsEditModalOpen(true);
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
              return result.message || "Requerimiento eliminado correctamente";
            } else {
              throw new Error(result.message || "Error al eliminar");
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
