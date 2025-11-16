"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGenericList } from "../Tabla_general/type/use-generic-list";
import GenericDataTable from "../Tabla_general/generic-data-table";
import {
  cotizacionesColumns,
  useCotizacionesActions,
} from "./config/cotizacion-index";
import { CotizacionForm } from "./components/cotizacion-form";
import { CotizacionDetails } from "./components/cotizacion-details";
import { CotizacionAntaminaService } from "./services/cotizacion-service";
import toast from "react-hot-toast";
import type {
  CreateCotizacionData,
  UpdateCotizacionData,
  CotizacionAntamina,
} from "./type/cotizacion-type";

export default function CotizacionAntaminaPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCotizacionId, setSelectedCotizacionId] = useState<
    number | null
  >(null);

  const {
    items: cotizaciones,
    loading,
    totalItems,
    currentPage,
    pageSize,
    searchQuery,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    refetch,
    clearFilters,
  } = useGenericList<CotizacionAntamina>({
    endpoint: "/api/cotizacion-antamina/list",
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

  // Funciones para manejar acciones
  const handleViewCotizacion = (id: number) => {
    setSelectedCotizacionId(id);
    setIsDetailModalOpen(true);
  };

  const handleEditCotizacion = (id: number) => {
    setSelectedCotizacionId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteCotizacion = async (id: number) => {
    if (!confirm("¿Está seguro de eliminar esta cotización?")) {
      return;
    }

    try {
      const result = await CotizacionAntaminaService.eliminar(id);
      if (result.success) {
        toast.success("Cotización eliminada correctamente");
        await forceRefresh();
      } else {
        toast.error(result.error || "Error al eliminar la cotización");
      }
    } catch (error: any) {
      console.error("Error deleting cotizacion:", error);
      toast.error("Error al eliminar la cotización");
    }
  };

  // Usar las columnas con acciones
  const actionsColumn = useCotizacionesActions(
    handleViewCotizacion,
    handleEditCotizacion,
    handleDeleteCotizacion
  );
  const columns = [...cotizacionesColumns, actionsColumn];

  // Funciones para manejar formularios
  const handleCreateCotizacion = async (
    data: CreateCotizacionData
  ): Promise<boolean> => {
    try {
      console.log("Creando cotización...", data);
      const result = await CotizacionAntaminaService.crear(data);

      if (result.success) {
        console.log("Cotización creada exitosamente:", result);
        await forceRefresh();
        toast.success("Cotización creada correctamente");
        return true;
      } else {
        toast.error(result.error || "Error al crear la cotización");
        return false;
      }
    } catch (error: any) {
      console.error("Error creating cotizacion:", error);
      toast.error(
        error.response?.data?.error || "Error al crear la cotización"
      );
      return false;
    }
  };

  const handleUpdateCotizacion = async (
    data: UpdateCotizacionData
  ): Promise<boolean> => {
    if (!selectedCotizacionId) return false;

    try {
      console.log("Actualizando cotización...", data);
      const result = await CotizacionAntaminaService.actualizar(
        selectedCotizacionId,
        data
      );

      if (result.success) {
        console.log("Cotización actualizada exitosamente");
        await forceRefresh();
        toast.success("Cotización actualizada correctamente");
        setIsEditModalOpen(false);
        return true;
      } else {
        toast.error(result.error || "Error al actualizar la cotización");
        return false;
      }
    } catch (error: any) {
      console.error("Error updating cotizacion:", error);
      toast.error("Error al actualizar la cotización");
      return false;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Cotizaciones Antamina
          </h1>
          <p className="text-gray-500 mt-1">
            Gestión de cotizaciones para el proyecto Antamina
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Cotización
        </Button>
      </div>

      {/* Tabla de cotizaciones */}
      <GenericDataTable
        columns={columns as any}
        data={cotizaciones}
        actions={[]}
        loading={loading}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        searchQuery={searchQuery}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={handleSearch}
        onSearchClick={handleSearch}
        onClearFilters={clearFilters}
        onRefetch={forceRefresh}
        idField="idcotizaciones_antamina"
      />

      {/* Modales */}
      <CotizacionForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCotizacion}
        mode="create"
      />

      <CotizacionForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCotizacionId(null);
        }}
        onSubmit={(data) =>
          handleUpdateCotizacion(data as UpdateCotizacionData)
        }
        mode="edit"
        cotizacionId={selectedCotizacionId || undefined}
      />

      <CotizacionDetails
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCotizacionId(null);
        }}
        cotizacionId={selectedCotizacionId}
      />
    </div>
  );
}
