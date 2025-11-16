"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import { PermisoComponente } from "@/assets/Auth/PermisoComponente";
import { useGenericList } from "../Tabla_general/type/use-generic-list";
import type { Categoria, CreateCategoriaData } from "./type/type";
import GenericDataTable from "../Tabla_general/generic-data-table";
import { categoriasColumns, useCategoriasActions } from "./config";
import { CategoriaForm } from "./components/categoria-form";
import { CategoriaDetail } from "./components/categoria-detail";
import { CategoriasService } from "./services/categorias-service";
import toast from "react-hot-toast";

export default function CategoriasPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null
  );
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(
    null
  );

  const {
    items: categorias,
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
  } = useGenericList<Categoria>({
    endpoint: "/api/categorias-listar",
    enableCache: true,
  });

  // Usar las columnas definidas en el archivo de configuración
  const columns = categoriasColumns;

  // Funciones para manejar formularios
  const handleCreateCategoria = async (
    data: CreateCategoriaData
  ): Promise<boolean> => {
    try {
      await CategoriasService.crear(data);
      toast.success("Categoría creada correctamente");
      refetch();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al crear la categoría");
      return false;
    }
  };

  const handleUpdateCategoria = async (
    data: CreateCategoriaData
  ): Promise<boolean> => {
    if (!selectedCategoria) return false;

    try {
      await CategoriasService.actualizar(selectedCategoria.id_categoria, data);
      toast.success("Categoría actualizada correctamente");
      refetch();
      return true;
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Error al actualizar la categoría"
      );
      return false;
    }
  };

  // Usar las acciones definidas en el archivo de configuración
  const actions = useCategoriasActions({
    categorias,
    setSelectedCategoria,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    setSelectedCategoriaId,
    deleteItem,
  });

  return (
    <div className="container mx-auto py-0 space-y-4 p-3 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Gestión de Categorías
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administra las categorías de tu sistema.
          </p>
        </div>

        <div className="flex gap-2">
          {/* <PermisoComponente permisos="categorias.create"> */}
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          {/* </PermisoComponente> */}
        </div>
      </div>
      {/* Tabla genérica */}
      <GenericDataTable<Categoria>
        columns={columns}
        data={categorias}
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
        idField="id_categoria"
        pageTitle="Categorías"
      />

      {/* Modal para crear categoría */}
      <CategoriaForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCategoria}
        mode="create"
      />

      {/* Modal para editar categoría */}
      <CategoriaForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategoria(null);
        }}
        onSubmit={handleUpdateCategoria}
        categoria={selectedCategoria}
        mode="edit"
      />

      {/* Modal para ver detalles de categoría */}
      <CategoriaDetail
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCategoriaId(null);
        }}
        categoriaId={selectedCategoriaId}
      />
    </div>
  );
}
