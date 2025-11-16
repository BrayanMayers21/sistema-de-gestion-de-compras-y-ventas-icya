import { Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import type { TableAction } from "../../Tabla_general/type/generic-table";
import type { ProductoItem } from "../type/type";

export interface ProductosActionsConfig {
  productos: ProductoItem[];
  setSelectedProducto: (producto: ProductoItem | null) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  deleteItem: (id: number | string) => Promise<any>;
}

export const createProductosActions = (
  config: ProductosActionsConfig
): TableAction[] => {
  const {
    productos,
    setSelectedProducto,
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
        const producto = productos.find((p) => p.id_producto === id);
        if (producto) {
          setSelectedProducto(producto);
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
        const producto = productos.find((p) => p.id_producto === id);
        if (producto) {
          setSelectedProducto(producto);
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
          loading: "Eliminando producto...",
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

export const useProductosActions = (config: ProductosActionsConfig) => {
  return createProductosActions(config);
};
