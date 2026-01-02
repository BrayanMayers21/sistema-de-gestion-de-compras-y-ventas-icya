"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import GenericDataTable from "../../Components/Tabla_general/generic-data-table";
import { useGenericList } from "../../Components/Tabla_general/type/use-generic-list";
import { CapacitacionesService } from "../../Components/Capacitaciones/services/capacitaciones-service";
import { CapacitacionForm } from "../../Components/Capacitaciones/components/capacitacion-form";
import { CapacitacionDetails } from "../../Components/Capacitaciones/components/capacitacion-details";
import {
  capacitacionesColumns,
  useCapacitacionesActions,
} from "../../Components/Capacitaciones/config";
import type {
  Capacitacion,
  CreateCapacitacionData,
  UpdateCapacitacionData,
} from "../../Components/Capacitaciones/type/type";

export default function PageCapacitaciones() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] =
    useState<Capacitacion | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Gestión de Capacitaciones - REDVEL";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const {
    items: capacitaciones,
    loading,
    totalItems,
    currentPage,
    pageSize,
    searchQuery,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    deleteItem,
    refetch,
    clearFilters,
  } = useGenericList<Capacitacion>({
    endpoint: "/api/capacitaciones",
    enableCache: false,
  });

  // Función para forzar recarga múltiple
  const forceRefresh = async () => {
    console.log("Ejecutando recarga forzada...");
    try {
      await refetch();
      setTimeout(async () => {
        await refetch();
        console.log("Recarga forzada completada");
      }, 500);
    } catch (error) {
      console.error("Error en recarga forzada:", error);
    }
  };

  // Usar las columnas definidas en el archivo de configuración
  const columns = capacitacionesColumns;

  // Funciones para manejar formularios
  const handleCreateCapacitacion = async (
    data: CreateCapacitacionData | UpdateCapacitacionData
  ): Promise<boolean> => {
    try {
      console.log("Creando capacitación...", data);
      const result = await CapacitacionesService.crear(
        data as CreateCapacitacionData
      );
      console.log("Capacitación creada exitosamente:", result);

      // Recargar la tabla inmediatamente después de crear
      console.log("Recargando tabla...");
      await forceRefresh();
      console.log("Tabla recargada exitosamente");

      toast.success("Capacitación creada correctamente. Tabla actualizada.", {
        duration: 3000,
      });
      return true;
    } catch (error: any) {
      console.error("Error creating capacitación:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error al crear la capacitación"
      );
      return false;
    }
  };

  const handleUpdateCapacitacion = async (
    data: CreateCapacitacionData | UpdateCapacitacionData
  ): Promise<boolean> => {
    if (!selectedCapacitacion) return false;

    try {
      console.log("Actualizando capacitación...", data);
      const result = await CapacitacionesService.actualizar(
        selectedCapacitacion.id_capacitacion,
        data
      );
      console.log("Capacitación actualizada exitosamente:", result);

      // Recargar la tabla
      await forceRefresh();

      toast.success(
        "Capacitación actualizada correctamente. Tabla actualizada.",
        { duration: 3000 }
      );
      return true;
    } catch (error: any) {
      console.error("Error updating capacitación:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error al actualizar la capacitación"
      );
      return false;
    }
  };

  // Configurar las acciones usando el hook
  const actions = useCapacitacionesActions({
    capacitaciones,
    setSelectedCapacitacion,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    deleteItem: async (id) => {
      try {
        const result = await deleteItem(id);
        if (result.success) {
          await forceRefresh();
          toast.success("Capacitación eliminada correctamente");
        }
        return result;
      } catch (error: any) {
        console.error("Error deleting capacitación:", error);
        toast.error("Error al eliminar la capacitación");
        return { success: false, message: "Error al eliminar" };
      }
    },
    downloadPDF: async (id: number) => {
      try {
        await CapacitacionesService.descargarPDF(id);
        toast.success("PDF descargado correctamente");
      } catch (error) {
        console.error("Error downloading PDF:", error);
        toast.error("Error al descargar el PDF");
        throw error;
      }
    },
  });

  // Debug: Verificar que las acciones se están creando correctamente
  console.log("🔍 DEBUG - Acciones de Capacitaciones:", {
    actions,
    actionsLength: actions.length,
    capacitacionesLength: capacitaciones.length,
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Capacitaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las capacitaciones, entrenamientos y formaciones del
            personal
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedCapacitacion(null);
            setIsAddModalOpen(true);
          }}
          size="default"
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Capacitación
        </Button>
      </div>

      {/* Tabla de datos */}
      <GenericDataTable<Capacitacion>
        data={capacitaciones}
        columns={columns}
        actions={actions}
        loading={loading}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onSearchClick={handleSearch}
        onRefetch={refetch}
        onClearFilters={clearFilters}
        idField="id_capacitacion"
      />

      {/* Modal para crear capacitación */}
      <CapacitacionForm
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCapacitacion(null);
        }}
        onSubmit={handleCreateCapacitacion}
        mode="create"
      />

      {/* Modal para editar capacitación */}
      <CapacitacionForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCapacitacion(null);
        }}
        onSubmit={handleUpdateCapacitacion}
        mode="edit"
        capacitacion={selectedCapacitacion}
      />

      {/* Modal para ver detalles */}
      <CapacitacionDetails
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCapacitacion(null);
        }}
        capacitacion={selectedCapacitacion}
      />
    </div>
  );
}
