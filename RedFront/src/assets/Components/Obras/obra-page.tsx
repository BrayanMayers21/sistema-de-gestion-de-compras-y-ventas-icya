"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { CreateObraData, ObraItem, UpdateObraData } from "./type/type";
import { useGenericList } from "../Tabla_general/type/use-generic-list";
import { ObrasService } from "./services/obras-service";
import { obrasColumns, useObrasActions } from "./config";
import GenericDataTable from "../Tabla_general/generic-data-table";
import { ObraDetails, ObraForm } from "./components";

export default function ObrasPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedObra, setSelectedObra] = useState<ObraItem | null>(null);

  const {
    items: obras,
    loading,
    totalItems,
    currentPage,
    pageSize,
    searchQuery,
    handlePageChange,
    handlePageSizeChange,
    setSearchQuery,
    handleSearch,
    deleteItem,
    refetch,
    clearFilters,
  } = useGenericList<ObraItem>({
    endpoint: "/api/obras-listar",
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
  const columns = obrasColumns;

  // Funciones para manejar formularios
  const handleCreateObra = async (
    data: CreateObraData | UpdateObraData
  ): Promise<boolean> => {
    try {
      console.log("Creando obra...", data);
      const result = await ObrasService.crear(data as CreateObraData);
      console.log("Obra creada exitosamente:", result);

      // Recargar la tabla inmediatamente después de crear
      console.log("Recargando tabla...");
      await forceRefresh();
      console.log("Tabla recargada exitosamente");

      toast.success("Obra creada correctamente. Tabla actualizada.");
      return true;
    } catch (error: any) {
      console.error("Error creating obra:", error);
      toast.error(error.response?.data?.error || "Error al crear la obra");
      return false;
    }
  };

  const handleUpdateObra = async (
    data: CreateObraData | UpdateObraData
  ): Promise<boolean> => {
    if (!selectedObra || !selectedObra.idobras) return false;

    try {
      console.log("Actualizando obra...", data);
      await ObrasService.actualizar(data as UpdateObraData);

      // Recargar la tabla inmediatamente después de actualizar
      console.log("Recargando tabla después de actualizar...");
      await forceRefresh();
      console.log("Tabla recargada después de actualizar");

      toast.success("Obra actualizada correctamente. Tabla actualizada.");
      return true;
    } catch (error: any) {
      console.error("Error updating obra:", error);
      toast.error(error.response?.data?.error || "Error al actualizar la obra");
      return false;
    }
  };

  // Usar las acciones definidas en el archivo de configuración
  const actions = useObrasActions({
    obras,
    setSelectedObra,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    deleteItem,
  });

  return (
    <div className="container mx-auto py-0 space-y-4 p-3 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Obras</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administra las obras de tu sistema.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Obra
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              console.log("Recarga manual activada");
              forceRefresh();
              toast.success("Tabla actualizada manualmente");
            }}
          >
            🔄 Recargar
          </Button>
        </div>
      </div>

      {/* Tabla genérica */}
      <GenericDataTable<ObraItem>
        columns={columns}
        data={obras}
        actions={actions}
        loading={loading}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        searchQuery={searchQuery}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSearch={setSearchQuery}
        onSearchClick={handleSearch}
        onClearFilters={clearFilters}
        onRefetch={refetch}
        idField="idobras"
        pageTitle="Obras"
      />

      {/* Modal para crear obra */}
      <ObraForm
        isOpen={isAddModalOpen}
        onClose={() => {
          console.log("Cerrando modal de creación...");
          setIsAddModalOpen(false);
          setTimeout(() => {
            console.log("Recarga desde modal de creación...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleCreateObra}
        mode="create"
      />

      {/* Modal para editar obra */}
      <ObraForm
        isOpen={isEditModalOpen}
        onClose={() => {
          console.log("Cerrando modal de edición...");
          setIsEditModalOpen(false);
          setSelectedObra(null);
          setTimeout(() => {
            console.log("Recarga desde modal de edición...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleUpdateObra}
        mode="edit"
        obra={selectedObra}
      />

      {/* Modal para ver detalles de obra */}
      <ObraDetails
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedObra(null);
        }}
        obra={selectedObra}
      />
    </div>
  );
}
