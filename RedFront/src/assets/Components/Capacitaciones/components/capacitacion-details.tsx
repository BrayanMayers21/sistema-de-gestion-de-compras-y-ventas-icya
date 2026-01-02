"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  GraduationCap,
  Info,
  Users,
  Building2,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { CapacitacionesService } from "../services/capacitaciones-service";
import type { Capacitacion } from "../type/type";

interface CapacitacionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  capacitacion: Capacitacion | null;
}

export function CapacitacionDetails({
  isOpen,
  onClose,
  capacitacion,
}: CapacitacionDetailsProps) {
  const [capacitacionDetalle, setCapacitacionDetalle] =
    useState<Capacitacion | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDetallesCapacitacion = async () => {
      if (!capacitacion || !isOpen) return;

      const id = capacitacion.id_capacitacion;
      if (!id) return;

      setLoading(true);
      try {
        const response = await CapacitacionesService.mostrar(id);

        if (response.data) {
          setCapacitacionDetalle(response.data);
        }
      } catch (error) {
        console.error("Error cargando detalles de la capacitación:", error);
        toast.error("Error al cargar los detalles de la capacitación");
      } finally {
        setLoading(false);
      }
    };

    if (capacitacion && isOpen) {
      setCapacitacionDetalle(capacitacion);
      const id = capacitacion.id_capacitacion;
      if (id) {
        cargarDetallesCapacitacion();
      }
    }
  }, [capacitacion, isOpen]);

  const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return "Sin fecha";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTipoBadgeColor = (tipo: string) => {
    const colores: Record<string, string> = {
      induccion: "bg-blue-100 text-blue-800",
      capacitacion: "bg-green-100 text-green-800",
      entrenamiento: "bg-purple-100 text-purple-800",
      charla: "bg-yellow-100 text-yellow-800",
      simulacro: "bg-red-100 text-red-800",
      otros: "bg-gray-100 text-gray-800",
    };
    return colores[tipo] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-5xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Detalles de la Capacitación
          </DialogTitle>
          <DialogDescription>
            Información completa de la capacitación y sus asistentes.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Cargando detalles...</span>
            </div>
          ) : capacitacionDetalle ? (
            <div className="space-y-6">
              {/* Información General */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Código</p>
                    <p className="font-medium text-blue-600">
                      {capacitacionDetalle.codigo}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Fecha
                    </p>
                    <p className="font-medium">
                      {formatearFecha(capacitacionDetalle.fecha_capacitacion)}
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <p className="text-sm text-muted-foreground">Tema</p>
                    <p className="font-medium">
                      {capacitacionDetalle.tema_capacitacion}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Tipo de Actividad
                    </p>
                    <Badge
                      className={getTipoBadgeColor(
                        capacitacionDetalle.tipo_actividad
                      )}
                    >
                      {capacitacionDetalle.tipo_actividad
                        .charAt(0)
                        .toUpperCase() +
                        capacitacionDetalle.tipo_actividad.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Capacitador
                    </p>
                    <p className="font-medium">
                      {capacitacionDetalle.capacitador}
                    </p>
                  </div>

                  {capacitacionDetalle.num_horas && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Duración
                      </p>
                      <p className="font-medium">
                        {capacitacionDetalle.num_horas} horas
                      </p>
                    </div>
                  )}

                  {capacitacionDetalle.lugar_capacitacion && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Lugar
                      </p>
                      <p className="font-medium">
                        {capacitacionDetalle.lugar_capacitacion}
                      </p>
                    </div>
                  )}

                  {capacitacionDetalle.observaciones && (
                    <div className="space-y-2 md:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Observaciones
                      </p>
                      <p className="text-sm">
                        {capacitacionDetalle.observaciones}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Datos del Empleador */}
              {(capacitacionDetalle.razon_social ||
                capacitacionDetalle.ruc ||
                capacitacionDetalle.domicilio) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Datos del Empleador
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {capacitacionDetalle.razon_social && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Razón Social
                        </p>
                        <p className="font-medium">
                          {capacitacionDetalle.razon_social}
                        </p>
                      </div>
                    )}

                    {capacitacionDetalle.ruc && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">RUC</p>
                        <p className="font-medium">
                          {capacitacionDetalle.ruc}
                        </p>
                      </div>
                    )}

                    {capacitacionDetalle.domicilio && (
                      <div className="space-y-2 md:col-span-2">
                        <p className="text-sm text-muted-foreground">
                          Domicilio
                        </p>
                        <p className="font-medium">
                          {capacitacionDetalle.domicilio}
                        </p>
                      </div>
                    )}

                    {capacitacionDetalle.actividad_economica && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Actividad Económica
                        </p>
                        <p className="font-medium">
                          {capacitacionDetalle.actividad_economica}
                        </p>
                      </div>
                    )}

                    {capacitacionDetalle.num_trabajadores !== undefined && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          N° Trabajadores
                        </p>
                        <p className="font-medium">
                          {capacitacionDetalle.num_trabajadores}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Asistentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Asistentes ({capacitacionDetalle.asistentes?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {capacitacionDetalle.asistentes &&
                  capacitacionDetalle.asistentes.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>N°</TableHead>
                          <TableHead>Nombre</TableHead>
                          <TableHead>DNI</TableHead>
                          <TableHead>Área</TableHead>
                          <TableHead>Cargo</TableHead>
                          <TableHead className="text-center">
                            Asistió
                          </TableHead>
                          <TableHead>Observaciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {capacitacionDetalle.asistentes.map((asistente, idx) => (
                          <TableRow key={asistente.id_asistente || idx}>
                            <TableCell className="font-medium">
                              {idx + 1}
                            </TableCell>
                            <TableCell>
                              {asistente.nombre_completo || "N/A"}
                            </TableCell>
                            <TableCell>{asistente.dni || "N/A"}</TableCell>
                            <TableCell>{asistente.area || "N/A"}</TableCell>
                            <TableCell>{asistente.cargo || "N/A"}</TableCell>
                            <TableCell className="text-center">
                              {asistente.asistio ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 inline" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600 inline" />
                              )}
                            </TableCell>
                            <TableCell>
                              {asistente.observaciones_asistente || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No hay asistentes registrados
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                No se pudieron cargar los detalles de la capacitación.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
