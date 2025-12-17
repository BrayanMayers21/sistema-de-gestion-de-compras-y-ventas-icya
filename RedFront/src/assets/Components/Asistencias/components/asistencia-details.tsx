"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CalendarDays, User, Briefcase, Info } from "lucide-react";
import toast from "react-hot-toast";
import { AsistenciasService } from "../services/asistencias-service";
import type { AsistenciaItem } from "../type/type";

interface AsistenciaDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  asistencia: AsistenciaItem | null;
}

export function AsistenciaDetails({
  isOpen,
  onClose,
  asistencia,
}: AsistenciaDetailsProps) {
  const [asistenciaDetalle, setAsistenciaDetalle] =
    useState<AsistenciaItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDetallesAsistencia = async () => {
      if (!asistencia || !isOpen) return;

      const id = asistencia.idasistencias_empleados;
      if (!id) return;

      setLoading(true);
      try {
        const response = await AsistenciasService.mostrar(id);

        if (response.data) {
          setAsistenciaDetalle(response.data);
        }
      } catch (error) {
        console.error("Error cargando detalles de asistencia:", error);
        toast.error("Error al cargar los detalles de la asistencia");
      } finally {
        setLoading(false);
      }
    };

    if (asistencia && isOpen) {
      setAsistenciaDetalle(asistencia);
      const id = asistencia.idasistencias_empleados;
      if (id) {
        cargarDetallesAsistencia();
      }
    }
  }, [asistencia, isOpen]);

  const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return "Sin fecha";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      ASISTIO: { bg: "bg-green-100", text: "text-green-800" },
      FALTA: { bg: "bg-red-100", text: "text-red-800" },
      TARDANZA: { bg: "bg-yellow-100", text: "text-yellow-800" },
      JUSTIFICADO: { bg: "bg-blue-100", text: "text-blue-800" },
    };

    const badge = badges[estado] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
      >
        {estado}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Detalles de Asistencia
          </DialogTitle>
          <DialogDescription>
            Información completa del registro de asistencia.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Cargando detalles...</span>
            </div>
          ) : asistenciaDetalle ? (
            <div className="space-y-6">
              {/* Información de Asistencia */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Información de Asistencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Fecha de Asistencia
                    </label>
                    <p className="text-base font-medium">
                      {formatearFecha(asistenciaDetalle.fecha_asistio)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Estado
                    </label>
                    <div>{getEstadoBadge(asistenciaDetalle.estado)}</div>
                  </div>

                  {asistenciaDetalle.observacion && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Observación
                      </label>
                      <p className="text-base">
                        {asistenciaDetalle.observacion}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Información del Empleado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información del Empleado
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Nombres Completos
                    </label>
                    <p className="text-base font-medium">
                      {`${asistenciaDetalle.nombres || ""} ${
                        asistenciaDetalle.primer_apell || ""
                      } ${asistenciaDetalle.segundo_apell || ""}`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      DNI
                    </label>
                    <p className="text-base font-medium">
                      {asistenciaDetalle.dni || "No especificado"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Género
                    </label>
                    <p className="text-base">
                      {asistenciaDetalle.nom_genero || "No especificado"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Correo
                    </label>
                    <p className="text-base">
                      {asistenciaDetalle.correo || "No especificado"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Celular
                    </label>
                    <p className="text-base">
                      {asistenciaDetalle.celular || "No especificado"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Información Laboral */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Información Laboral
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Cargo
                    </label>
                    <p className="text-base font-medium">
                      {asistenciaDetalle.nom_cargo_empleado ||
                        "No especificado"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Sueldo
                    </label>
                    <p className="text-base font-medium text-green-700">
                      S/.{" "}
                      {asistenciaDetalle.sueldo
                        ? Number(asistenciaDetalle.sueldo).toLocaleString(
                            "es-PE",
                            {
                              minimumFractionDigits: 2,
                            }
                          )
                        : "0.00"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Cuenta BCP
                    </label>
                    <p className="text-base font-mono">
                      {asistenciaDetalle.cuenta_bcp || "Sin cuenta"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                No se pudieron cargar los detalles de la asistencia.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
