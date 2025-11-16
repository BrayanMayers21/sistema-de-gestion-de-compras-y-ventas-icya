import { Pencil, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import type { TableAction } from "../../Tabla_general/type/generic-table";
import type { Categoria } from "../type/type";

export interface CategoriasActionsConfig {
  categorias: Categoria[];
  setSelectedCategoria: (categoria: Categoria | null) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  setSelectedCategoriaId: (id: number | null) => void;
  deleteItem: (id: number | string) => Promise<any>;
}

export const createCategoriasActions = (
  config: CategoriasActionsConfig
): TableAction[] => {
  const {
    categorias,
    setSelectedCategoria,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    setSelectedCategoriaId,
    deleteItem,
  } = config;

  return [
    {
      icon: Eye,
      label: "Ver detalles",
      permission: "usuarios.view",
      showOnMobile: true,
      onClick: (id) => {
        const categoria = categorias.find((c) => c.id_categoria === id);
        if (categoria) {
          setSelectedCategoriaId(categoria.id_categoria);
          setIsDetailModalOpen(true);
        }
      },
    },
    {
      icon: Pencil,
      label: "Editar",
      permission: "usuarios.view",
      showOnMobile: true,
      onClick: (id) => {
        const categoria = categorias.find((c) => c.id_categoria === id);
        if (categoria) {
          setSelectedCategoria(categoria);
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
          loading: "Eliminando categoría...",
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

// Hook personalizado para usar las acciones de categorías
export const useCategoriasActions = (config: CategoriasActionsConfig) => {
  return createCategoriasActions(config);
};
