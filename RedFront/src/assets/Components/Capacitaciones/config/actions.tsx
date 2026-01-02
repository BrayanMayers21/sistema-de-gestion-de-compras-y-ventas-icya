import { Pencil, Trash2, Eye, FileDown } from "lucide-react";
import toast from "react-hot-toast";
import type { TableAction } from "../../Tabla_general/type/generic-table";
import type { Capacitacion } from "../type/type";

export interface CapacitacionesActionsConfig {
  capacitaciones: Capacitacion[];
  setSelectedCapacitacion: (capacitacion: Capacitacion | null) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  deleteItem: (id: number | string) => Promise<any>;
  downloadPDF: (id: number) => Promise<void>;
}

export const createCapacitacionesActions = (
  config: CapacitacionesActionsConfig
): TableAction[] => {
  const {
    capacitaciones,
    setSelectedCapacitacion,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    deleteItem,
    downloadPDF,
  } = config;

  return [
    {
      icon: Eye,
      label: "Ver detalles",
      permission: "usuarios.view",
      showOnMobile: true,
      onClick: (id) => {
        const capacitacion = capacitaciones.find(
          (c) => c.id_capacitacion === id
        );
        if (capacitacion) {
          setSelectedCapacitacion(capacitacion);
          setIsDetailModalOpen(true);
        }
      },
    },
    {
      icon: FileDown,
      label: "Descargar PDF",
      permission: "usuarios.view",
      showOnMobile: true,
      variant: "secondary",
      onClick: async (id) => {
        await toast.promise(downloadPDF(Number(id)), {
          loading: "Descargando PDF...",
          success: "PDF descargado correctamente",
          error: "Error al descargar el PDF",
        });
      },
    },
    {
      icon: Pencil,
      label: "Editar",
      permission: "usuarios.view",
      showOnMobile: true,
      onClick: (id) => {
        const capacitacion = capacitaciones.find(
          (c) => c.id_capacitacion === id
        );
        if (capacitacion) {
          setSelectedCapacitacion(capacitacion);
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
          loading: "Eliminando capacitación...",
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

export const useCapacitacionesActions = (
  config: CapacitacionesActionsConfig
) => {
  return createCapacitacionesActions(config);
};
