"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { PermisoComponente } from "@/assets/Auth/PermisoComponente";
import { useGenericList } from "../Tabla_general/type/use-generic-list";
import GenericDataTable from "../Tabla_general/generic-data-table";
import { requerimientosColumns, useRequerimientosActions } from "./config";
import { RequerimientoForm } from "./components/requerimiento-form";
import { RequerimientosService } from "./services/requerimiento-service";
import toast from "react-hot-toast";
import type { CreateRequerimientoData, RequerimientoItem } from "./type/type";

export default function RequerimientoPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequerimiento, setSelectedRequerimiento] =
    useState<RequerimientoItem | null>(null);

  const {
    items: requerimientos,
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
  } = useGenericList<RequerimientoItem>({
    endpoint: "/api/requerimientos-listar",
    enableCache: false, // Deshabilitamos cache para asegurar datos frescos
  });

  // Función para forzar recarga múltiple
  const forceRefresh = async () => {
    console.log("Ejecutando recarga forzada...");
    try {
      await refetch();
      // Pequeño delay y segunda recarga para asegurar
      setTimeout(async () => {
        await refetch();
        console.log("Recarga forzada completada");
      }, 500);
    } catch (error) {
      console.error("Error en recarga forzada:", error);
    }
  };

  // Usar las columnas definidas en el archivo de configuración
  const columns = requerimientosColumns;

  // Funciones para manejar formularios
  const handleCreateRequerimiento = async (
    data: CreateRequerimientoData
  ): Promise<boolean> => {
    try {
      console.log("Creando requerimiento...", data);
      const result = await RequerimientosService.crear(data);
      console.log("Requerimiento creado exitosamente:", result);

      // Recargar la tabla inmediatamente después de crear
      console.log("Recargando tabla...");
      await forceRefresh();
      console.log("Tabla recargada exitosamente");

      toast.success("Requerimiento creado correctamente. Tabla actualizada.");
      return true;
    } catch (error: any) {
      console.error("Error creating requerimiento:", error);
      toast.error(
        error.response?.data?.error || "Error al crear el requerimiento"
      );
      return false;
    }
  };

  const handleUpdateRequerimiento = async (
    data: CreateRequerimientoData
  ): Promise<boolean> => {
    if (!selectedRequerimiento) return false;

    try {
      console.log("Actualizando requerimiento...", data);
      await RequerimientosService.actualizar(selectedRequerimiento.id, data);

      // Recargar la tabla inmediatamente después de actualizar
      console.log("Recargando tabla después de actualizar...");
      await forceRefresh();
      console.log("Tabla recargada después de actualizar");

      toast.success(
        "Requerimiento actualizado correctamente. Tabla actualizada."
      );
      return true;
    } catch (error: any) {
      console.error("Error updating requerimiento:", error);
      toast.error(
        error.response?.data?.error || "Error al actualizar el requerimiento"
      );
      return false;
    }
  };

  // Usar las acciones definidas en el archivo de configuración
  const actions = useRequerimientosActions({
    requerimientos,
    setSelectedRequerimiento,
    setIsEditModalOpen,
    deleteItem,
  });

  return (
    <div className="container mx-auto py-0 space-y-4 p-3 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Gestión de Requerimientos
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administra los requerimientos de productos de tu sistema.
          </p>
        </div>

        <div className="flex gap-2">
          {/* <PermisoComponente permisos="requerimientos.create"> */}
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Requerimiento
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
          {/* </PermisoComponente> */}
        </div>
      </div>
      {/* Tabla genérica */}
      <GenericDataTable<RequerimientoItem>
        columns={columns}
        data={requerimientos}
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
        idField="id"
        pageTitle="Requerimientos"
      />

      {/* Modal para crear requerimiento */}
      <RequerimientoForm
        isOpen={isAddModalOpen}
        onClose={() => {
          console.log("Cerrando modal de creación...");
          setIsAddModalOpen(false);
          // Forzar recarga de la tabla cuando se cierre el modal
          setTimeout(() => {
            console.log("Recarga desde modal de creación...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleCreateRequerimiento}
        mode="create"
      />

      {/* Modal para editar requerimiento */}
      <RequerimientoForm
        isOpen={isEditModalOpen}
        onClose={() => {
          console.log("Cerrando modal de edición...");
          setIsEditModalOpen(false);
          setSelectedRequerimiento(null);
          // Forzar recarga de la tabla cuando se cierre el modal
          setTimeout(() => {
            console.log("Recarga desde modal de edición...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleUpdateRequerimiento}
        mode="edit"
      />
    </div>
  );
}
