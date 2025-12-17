import { Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import type { TableAction } from "../../Tabla_general/type/generic-table";
import type { AsistenciaItem } from "../type/type";

export interface AsistenciasActionsConfig {
  asistencias: AsistenciaItem[];
  setSelectedAsistencia: (asistencia: AsistenciaItem | null) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  deleteItem: (id: number | string) => Promise<any>;
}

export const createAsistenciasActions = (
  config: AsistenciasActionsConfig
): TableAction[] => {
  const {
    asistencias,
    setSelectedAsistencia,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    deleteItem,
  } = config;

  return [
    {
      icon: Eye,
      label: "Ver detalles",
      permission: "asistencias.view",
      showOnMobile: true,
      onClick: (id) => {
        const asistencia = asistencias.find(
          (a) => a.idasistencias_empleados === id
        );
        if (asistencia) {
          setSelectedAsistencia(asistencia);
          setIsDetailModalOpen(true);
        }
      },
    },
    {
      icon: Pencil,
      label: "Editar",
      permission: "asistencias.update",
      showOnMobile: true,
      onClick: (id) => {
        const asistencia = asistencias.find(
          (a) => a.idasistencias_empleados === id
        );
        if (asistencia) {
          setSelectedAsistencia(asistencia);
          setIsEditModalOpen(true);
        }
      },
    },
    {
      icon: Trash2,
      label: "Eliminar",
      permission: "asistencias.delete",
      variant: "destructive",
      showOnMobile: false,
      onClick: async (id) => {
        await toast.promise(deleteItem(id), {
          loading: "Eliminando asistencia...",
          success: (result) => {
            if (result.success) {
              return result.message;
            } else {
              throw new Error(result.message);
            }
          },
          error: (error) => error.message || "Error al eliminar",
        });
      },
    },
  ];
};

export const useAsistenciasActions = (config: AsistenciasActionsConfig) => {
  return createAsistenciasActions(config);
};
