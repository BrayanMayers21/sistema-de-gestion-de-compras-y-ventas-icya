"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGenericList } from "../Tabla_general/type/use-generic-list";
import GenericDataTable from "../Tabla_general/generic-data-table";
import { productosColumns, useProductosActions } from "./config";
import { ProductoForm } from "./components/producto-form";
import { ProductoDetails } from "./components/producto-details";
import { ProductosService } from "./services/productos-service";
import type {
  ProductoItem,
  CreateProductoData,
  UpdateProductoData,
} from "./type/type";
import toast from "react-hot-toast";

export default function ProductosPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoItem | null>(
    null
  );

  const {
    items: productos,
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
  } = useGenericList<ProductoItem>({
    endpoint: "/api/productos-materiales",
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
  const columns = productosColumns;

  // Funciones para manejar formularios
  const handleCreateProducto = async (
    data: CreateProductoData | UpdateProductoData
  ): Promise<boolean> => {
    try {
      console.log("Creando producto...", data);
      const result = await ProductosService.crear(data as CreateProductoData);
      console.log("Producto creado exitosamente:", result);

      // Recargar la tabla inmediatamente después de crear
      console.log("Recargando tabla...");
      await forceRefresh();
      console.log("Tabla recargada exitosamente");

      toast.success("Producto creado correctamente. Tabla actualizada.");
      return true;
    } catch (error: any) {
      console.error("Error creating producto:", error);
      toast.error(error.response?.data?.error || "Error al crear el producto");
      return false;
    }
  };

  const handleUpdateProducto = async (
    data: CreateProductoData | UpdateProductoData
  ): Promise<boolean> => {
    if (!selectedProducto || !selectedProducto.id_producto) return false;

    try {
      console.log("Actualizando producto...", data);
      await ProductosService.actualizar(
        selectedProducto.id_producto,
        data as UpdateProductoData
      );

      // Recargar la tabla inmediatamente después de actualizar
      console.log("Recargando tabla después de actualizar...");
      await forceRefresh();
      console.log("Tabla recargada después de actualizar");

      toast.success("Producto actualizado correctamente. Tabla actualizada.");
      return true;
    } catch (error: any) {
      console.error("Error updating producto:", error);
      toast.error(
        error.response?.data?.error || "Error al actualizar el producto"
      );
      return false;
    }
  };

  // Usar las acciones definidas en el archivo de configuración
  const actions = useProductosActions({
    productos,
    setSelectedProducto,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    deleteItem,
  });

  return (
    <div className="container mx-auto py-0 space-y-4 p-3 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Gestión de Productos
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administra los productos y materiales de tu sistema.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
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
      <GenericDataTable<ProductoItem>
        columns={columns}
        data={productos}
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
        idField="id_producto"
        pageTitle="Productos"
      />

      {/* TODO: Crear modales para productos */}
      {/* Modal para crear producto */}
      <ProductoForm
        isOpen={isAddModalOpen}
        onClose={() => {
          console.log("Cerrando modal de creación...");
          setIsAddModalOpen(false);
          setTimeout(() => {
            console.log("Recarga desde modal de creación...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleCreateProducto}
        mode="create"
      />

      {/* Modal para editar producto */}
      <ProductoForm
        isOpen={isEditModalOpen}
        onClose={() => {
          console.log("Cerrando modal de edición...");
          setIsEditModalOpen(false);
          setSelectedProducto(null);
          setTimeout(() => {
            console.log("Recarga desde modal de edición...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleUpdateProducto}
        mode="edit"
        producto={selectedProducto}
      />

      {/* Modal para ver detalles de producto */}
      <ProductoDetails
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProducto(null);
        }}
        producto={selectedProducto}
      />
    </div>
  );
}
