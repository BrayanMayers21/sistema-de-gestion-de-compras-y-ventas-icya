"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import GenericDataTable from "../../Components/Tabla_general/generic-data-table";
import { useGenericList } from "../../Components/Tabla_general/type/use-generic-list";
import { EmpleadosService } from "../../Components/Empleados/services/empleados-service";
import { EmpleadoForm } from "../../Components/Empleados/components/empleado-form";
import { EmpleadoDetails } from "../../Components/Empleados/components/empleado-details";
import {
  empleadosColumns,
  useEmpleadosActions,
} from "../../Components/Empleados/config";
import type {
  EmpleadoItem,
  CreateEmpleadoData,
  UpdateEmpleadoData,
} from "../../Components/Empleados/type/type";

export default function PageEmpleados() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<EmpleadoItem | null>(
    null
  );

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Gestión de Empleados - REDVEL";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const {
    items: empleados,
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
  } = useGenericList<EmpleadoItem>({
    endpoint: "/api/empleados-listar",
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
  const columns = empleadosColumns;

  // Funciones para manejar formularios
  const handleCreateEmpleado = async (
    data: CreateEmpleadoData | UpdateEmpleadoData
  ): Promise<boolean> => {
    try {
      console.log("Creando empleado...", data);
      const result = await EmpleadosService.crear(data as CreateEmpleadoData);
      console.log("Empleado creado exitosamente:", result);

      // Recargar la tabla inmediatamente después de crear
      console.log("Recargando tabla...");
      await forceRefresh();
      console.log("Tabla recargada exitosamente");

      toast.success("Empleado creado correctamente. Tabla actualizada.");
      return true;
    } catch (error: any) {
      console.error("Error creating empleado:", error);
      toast.error(error.response?.data?.error || "Error al crear el empleado");
      return false;
    }
  };

  const handleUpdateEmpleado = async (
    data: CreateEmpleadoData | UpdateEmpleadoData
  ): Promise<boolean> => {
    if (!selectedEmpleado) return false;

    const id = selectedEmpleado.idempleados;
    if (!id) return false;

    try {
      console.log("Actualizando empleado...", data);
      await EmpleadosService.actualizar(id, data as UpdateEmpleadoData);

      // Recargar la tabla inmediatamente después de actualizar
      console.log("Recargando tabla después de actualizar...");
      await forceRefresh();
      console.log("Tabla recargada después de actualizar");

      toast.success("Empleado actualizado correctamente. Tabla actualizada.");
      return true;
    } catch (error: any) {
      console.error("Error updating empleado:", error);
      toast.error(
        error.response?.data?.error || "Error al actualizar el empleado"
      );
      return false;
    }
  };

  // Usar las acciones definidas en el archivo de configuración
  const actions = useEmpleadosActions({
    empleados,
    setSelectedEmpleado,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    deleteItem,
  });

  return (
    <div className="container mx-auto py-0 space-y-4 p-3 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Gestión de Empleados
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administra los empleados de tu empresa.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Empleado
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
      <GenericDataTable<EmpleadoItem>
        columns={columns}
        data={empleados}
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
        idField="idempleados"
        pageTitle="Empleados"
      />

      {/* Modal para crear empleado */}
      <EmpleadoForm
        isOpen={isAddModalOpen}
        onClose={() => {
          console.log("Cerrando modal de creación...");
          setIsAddModalOpen(false);
          setTimeout(() => {
            console.log("Recarga desde modal de creación...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleCreateEmpleado}
        mode="create"
      />

      {/* Modal para editar empleado */}
      <EmpleadoForm
        isOpen={isEditModalOpen}
        onClose={() => {
          console.log("Cerrando modal de edición...");
          setIsEditModalOpen(false);
          setSelectedEmpleado(null);
          setTimeout(() => {
            console.log("Recarga desde modal de edición...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleUpdateEmpleado}
        mode="edit"
        empleado={selectedEmpleado}
      />

      {/* Modal para ver detalles de empleado */}
      <EmpleadoDetails
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEmpleado(null);
        }}
        empleado={selectedEmpleado}
      />
    </div>
  );
}
