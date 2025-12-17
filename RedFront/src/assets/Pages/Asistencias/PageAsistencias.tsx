"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, List } from "lucide-react";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenericDataTable from "../../Components/Tabla_general/generic-data-table";
import { useGenericList } from "../../Components/Tabla_general/type/use-generic-list";
import { AsistenciasService } from "../../Components/Asistencias/services/asistencias-service";
import { AsistenciaForm } from "../../Components/Asistencias/components/asistencia-form";
import { AsistenciaDetails } from "../../Components/Asistencias/components/asistencia-details";
import { AsistenciaCalendario } from "../../Components/Asistencias/components/asistencia-calendario";
import {
  asistenciasColumns,
  useAsistenciasActions,
} from "../../Components/Asistencias/config";
import type {
  AsistenciaItem,
  CreateAsistenciaIndividual,
  CreateAsistenciaMasiva,
  UpdateAsistenciaIndividual,
} from "../../Components/Asistencias/type/type";

export default function PageAsistencias() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAsistencia, setSelectedAsistencia] =
    useState<AsistenciaItem | null>(null);
  const [formMode, setFormMode] = useState<"individual" | "masiva">("masiva");
  const [activeTab, setActiveTab] = useState("calendario");

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Gestión de Asistencias - REDVEL";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const {
    items: asistencias,
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
  } = useGenericList<AsistenciaItem>({
    endpoint: "/api/asistencias-listar",
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
  const columns = asistenciasColumns;

  // Funciones para manejar formularios
  const handleCreateAsistencia = async (
    data: CreateAsistenciaIndividual | CreateAsistenciaMasiva
  ): Promise<boolean> => {
    try {
      console.log("=== handleCreateAsistencia ===");
      console.log("Datos recibidos:", data);

      const result = await AsistenciasService.registrar(data);
      console.log("Resultado del registro:", result);

      // Recargar la tabla inmediatamente después de crear
      console.log("Recargando tabla...");
      await forceRefresh();
      console.log("Tabla recargada exitosamente");

      // Determinar mensaje según el tipo de registro
      if ("empleados" in data) {
        const responseData = result.data as any;
        const totalRegistradas = responseData?.total_registradas || 0;
        const yaExistentes = responseData?.ya_existentes || 0;

        if (totalRegistradas > 0) {
          toast.success(
            `${totalRegistradas} asistencia${
              totalRegistradas > 1 ? "s" : ""
            } registrada${totalRegistradas > 1 ? "s" : ""} correctamente`
          );
        }

        if (yaExistentes > 0) {
          toast(
            `${yaExistentes} registro${yaExistentes > 1 ? "s" : ""} ya existía${
              yaExistentes > 1 ? "n" : ""
            }`,
            { icon: "ℹ️" }
          );
        }

        if (totalRegistradas === 0 && yaExistentes === 0) {
          toast("No se registraron asistencias", { icon: "⚠️" });
        }
      } else {
        toast.success("Asistencia registrada correctamente");
      }

      return true;
    } catch (error: any) {
      console.error("=== ERROR en handleCreateAsistencia ===");
      console.error("Error completo:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error al registrar la asistencia";

      const errorDetails = error.response?.data?.errors
        ? JSON.stringify(error.response.data.errors, null, 2)
        : "";

      console.error("Mensaje de error:", errorMessage);
      if (errorDetails) {
        console.error("Detalles de validación:", errorDetails);
      }

      toast.error(errorMessage);
      return false;
    }
  };

  const handleUpdateAsistencia = async (
    data: CreateAsistenciaIndividual | CreateAsistenciaMasiva
  ): Promise<boolean> => {
    if (!selectedAsistencia) return false;

    const id = selectedAsistencia.idasistencias_empleados;
    if (!id) return false;

    try {
      console.log("Actualizando asistencia...", data);
      await AsistenciasService.actualizar(
        id,
        data as UpdateAsistenciaIndividual
      );

      // Recargar la tabla inmediatamente después de actualizar
      console.log("Recargando tabla después de actualizar...");
      await forceRefresh();
      console.log("Tabla recargada después de actualizar");

      toast.success("Asistencia actualizada correctamente");
      return true;
    } catch (error: any) {
      console.error("Error updating asistencia:", error);
      toast.error(
        error.response?.data?.error || "Error al actualizar la asistencia"
      );
      return false;
    }
  };

  // Usar las acciones definidas en el archivo de configuración
  const actions = useAsistenciasActions({
    asistencias,
    setSelectedAsistencia,
    setIsEditModalOpen,
    setIsDetailModalOpen,
    deleteItem,
  });

  return (
    <div className="container mx-auto py-0 space-y-4 p-3 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Gestión de Asistencias
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Registra y administra la asistencia de los empleados.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              setFormMode("masiva");
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Asistencia
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Vista Calendario
          </TabsTrigger>
          <TabsTrigger value="tabla" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Vista Tabla
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendario" className="mt-6">
          <AsistenciaCalendario onUpdate={forceRefresh} />
        </TabsContent>

        <TabsContent value="tabla" className="mt-6">
          <GenericDataTable<AsistenciaItem>
            columns={columns}
            data={asistencias}
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
            idField="idasistencias_empleados"
            pageTitle="Asistencias"
          />
        </TabsContent>
      </Tabs>

      {/* Modal para registrar asistencia */}
      <AsistenciaForm
        isOpen={isAddModalOpen}
        onClose={() => {
          console.log("Cerrando modal de registro...");
          setIsAddModalOpen(false);
          setTimeout(() => {
            console.log("Recarga desde modal de registro...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleCreateAsistencia}
        mode={formMode}
      />

      {/* Modal para editar asistencia */}
      <AsistenciaForm
        isOpen={isEditModalOpen}
        onClose={() => {
          console.log("Cerrando modal de edición...");
          setIsEditModalOpen(false);
          setSelectedAsistencia(null);
          setTimeout(() => {
            console.log("Recarga desde modal de edición...");
            forceRefresh();
          }, 200);
        }}
        onSubmit={handleUpdateAsistencia}
        mode="individual"
      />

      {/* Modal para ver detalles de asistencia */}
      <AsistenciaDetails
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAsistencia(null);
        }}
        asistencia={selectedAsistencia}
      />
    </div>
  );
}
