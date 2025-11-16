"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { PermisoComponente } from "@/assets/Auth/PermisoComponente";
import { useGenericList } from "../Tabla_general/type/use-generic-list";
import GenericDataTable from "../Tabla_general/generic-data-table";
import { ordenesColumns, useCategoriasActions } from "./config";
import { OrdenForm } from "./components/orden-form";
import { OrdenDetails } from "./components/orden-details";
import { CategoriasService } from "./services/ordenCompra-service";
import toast from "react-hot-toast";
import type { CreateOrdenCompraData, OrdenCompraItem } from "./type/type";

export default function OrdenPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<OrdenCompraItem | null>(
    null
  );
  const [selectedOrdenId, setSelectedOrdenId] = useState<number | null>(null);

  const {
    items: ordenes,
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
  } = useGenericList<OrdenCompraItem>({
    endpoint: "/api/ordenCompra-listar",
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
  const columns = ordenesColumns;

  // Funciones para manejar formularios
  const handleCreateOrden = async (
    data: CreateOrdenCompraData
  ): Promise<boolean> => {
    try {
      console.log("Creando orden...", data);
      const result = await CategoriasService.crear(data);
      console.log("Orden creada exitosamente:", result);

      // Recargar la tabla inmediatamente después de crear
      console.log("Recargando tabla...");
      await forceRefresh();
      console.log("Tabla recargada exitosamente");

      toast.success("Orden de compra creada correctamente. Tabla actualizada.");
      return true;
    } catch (error: any) {
      console.error("Error creating orden:", error);
      toast.error(
        error.response?.data?.error || "Error al crear la orden de compra"
      );
      return false;
    }
  };

  const handleUpdateOrden = async (
    data: CreateOrdenCompraData
  ): Promise<boolean> => {
    if (!selectedOrden) return false;

    try {
      console.log("Actualizando orden...", data);
      await CategoriasService.actualizar(selectedOrden.id_orden, data);

      // Recargar la tabla inmediatamente después de actualizar
      console.log("Recargando tabla después de actualizar...");
      await forceRefresh();
      console.log("Tabla recargada después de actualizar");

      toast.success(
        "Orden de compra actualizada correctamente. Tabla actualizada."
      );
      return true;
    } catch (error: any) {
      console.error("Error updating orden:", error);
      toast.error(
        error.response?.data?.error || "Error al actualizar la orden de compra"
      );
      return false;
    }
  };

  // Usar las acciones definidas en el archivo de configuración
  const actions = useCategoriasActions({
    ordenes,
    setSelectedOrden,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    setSelectedOrdenId,
    deleteItem,
  });

  return (
    <div className="container mx-auto py-0 space-y-4 p-3 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Gestión de Órdenes de Compra
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administra las órdenes de compra de tu sistema.
          </p>
        </div>

        <div className="flex gap-2">
          {/* <PermisoComponente permisos="ordenes.create"> */}
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Orden de Compra
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
      <GenericDataTable<OrdenCompraItem>
        columns={columns}
        data={ordenes}
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
        idField="id_orden"
        pageTitle="Órdenes"
      />

      {/* Modal para crear orden */}
      <OrdenForm
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
        onSubmit={handleCreateOrden}
        mode="create"
      />

      {/* Modal para editar orden */}
      <OrdenForm
        isOpen={isEditModalOpen}
        onClose={() => {
          console.log("Cerrando modal de edición...");
          setIsEditModalOpen(false);
          setSelectedOrden(null);
          // Forzar recarga de la tabla cuando se cierre el modal
          setTimeout(() => {
            console.log("Recarga desde modal de edición...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleUpdateOrden}
        mode="edit"
      />

      {/* Modal para ver detalles de orden */}
      <OrdenDetails
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrdenId(null);
        }}
        ordenId={selectedOrdenId}
      />
    </div>
  );
}
