import { Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import type { TableAction } from "../../Tabla_general/type/generic-table";
import type { EmpleadoItem } from "../type/type";

export interface EmpleadosActionsConfig {
  empleados: EmpleadoItem[];
  setSelectedEmpleado: (empleado: EmpleadoItem | null) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  deleteItem: (id: number | string) => Promise<any>;
}

export const createEmpleadosActions = (
  config: EmpleadosActionsConfig
): TableAction[] => {
  const {
    empleados,
    setSelectedEmpleado,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    deleteItem,
  } = config;

  return [
    {
      icon: Eye,
      label: "Ver detalles",
      permission: "productos.view",
      showOnMobile: true,
      onClick: (id) => {
        const empleado = empleados.find((e) => e.idempleados === id);
        if (empleado) {
          setSelectedEmpleado(empleado);
          setIsDetailModalOpen(true);
        }
      },
    },
    {
      icon: Pencil,
      label: "Editar",
      permission: "productos.update",
      showOnMobile: true,
      onClick: (id) => {
        const empleado = empleados.find((e) => e.idempleados === id);
        if (empleado) {
          setSelectedEmpleado(empleado);
          setIsEditModalOpen(true);
        }
      },
    },
    {
      icon: Trash2,
      label: "Eliminar",
      permission: "productos.delete",
      variant: "destructive",
      showOnMobile: false,
      onClick: async (id) => {
        await toast.promise(deleteItem(id), {
          loading: "Eliminando empleado...",
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

export const useEmpleadosActions = (config: EmpleadosActionsConfig) => {
  return createEmpleadosActions(config);
};
