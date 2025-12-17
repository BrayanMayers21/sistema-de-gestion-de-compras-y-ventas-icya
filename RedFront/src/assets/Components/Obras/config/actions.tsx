import { Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import type { TableAction } from "../../Tabla_general/type/generic-table";
import type { ObraItem } from "../type/type";

// ======= ACTIONS PARA OBRAS =======
export interface ObrasActionsConfig {
  obras: ObraItem[];
  setSelectedObra: (obra: ObraItem | null) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  deleteItem: (id: number | string) => Promise<any>;
}

export const createObrasActions = (
  config: ObrasActionsConfig
): TableAction[] => {
  const {
    obras,
    setSelectedObra,
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
        const obra = obras.find((o) => o.idobras === id);
        if (obra) {
          setSelectedObra(obra);
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
        const obra = obras.find((o) => o.idobras === id);
        if (obra) {
          setSelectedObra(obra);
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
          loading: "Eliminando obra...",
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

export const useObrasActions = (config: ObrasActionsConfig) => {
  return createObrasActions(config);
};

// ======= ACTIONS PARA PRODUCTOS (MANTENER COMPATIBILIDAD) =======
