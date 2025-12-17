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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User, Briefcase, Info, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { EmpleadosService } from "../services/empleados-service";
import type { EmpleadoItem } from "../type/type";

interface EmpleadoDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  empleado: EmpleadoItem | null;
}

export function EmpleadoDetails({
  isOpen,
  onClose,
  empleado,
}: EmpleadoDetailsProps) {
  const [empleadoDetalle, setEmpleadoDetalle] = useState<EmpleadoItem | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDetallesEmpleado = async () => {
      if (!empleado || !isOpen) return;

      const id = empleado.idempleados;
      if (!id) return;

      setLoading(true);
      try {
        const response = await EmpleadosService.obtenerPorId(id);

        if (response.data) {
          setEmpleadoDetalle(response.data);
        }
      } catch (error) {
        console.error("Error cargando detalles del empleado:", error);
        toast.error("Error al cargar los detalles del empleado");
      } finally {
        setLoading(false);
      }
    };

    // Si ya tenemos el empleado completo, usarlo directamente
    if (empleado && isOpen) {
      setEmpleadoDetalle(empleado);
      // Opcional: cargar datos actualizados del servidor
      const id = empleado.idempleados;
      if (id) {
        cargarDetallesEmpleado();
      }
    }
  }, [empleado, isOpen]);

  const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return "Sin fecha";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calcularEdad = (fechaNacimiento: string | undefined) => {
    if (!fechaNacimiento) return "N/A";
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Detalles del Empleado
          </DialogTitle>
          <DialogDescription>
            Información completa del empleado.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Cargando detalles...</span>
            </div>
          ) : empleadoDetalle ? (
            <div className="space-y-6">
              {/* Información Personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Nombre Completo
                    </label>
                    <p className="text-lg font-semibold">
                      {`${empleadoDetalle.nombres} ${empleadoDetalle.primer_apell} ${empleadoDetalle.segundo_apell}`}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      DNI
                    </label>
                    <p className="text-lg font-mono font-semibold">
                      {empleadoDetalle.dni || "Sin DNI"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Género
                    </label>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {empleadoDetalle.nom_genero}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Fecha de Nacimiento
                    </label>
                    <p className="font-medium">
                      {formatearFecha(empleadoDetalle.fecha_nacimiento)}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({calcularEdad(empleadoDetalle.fecha_nacimiento)} años)
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Correo Electrónico
                    </label>
                    <p className="font-medium">
                      {empleadoDetalle.correo || "Sin correo"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Teléfono
                    </label>
                    <p className="font-medium">
                      {empleadoDetalle.telefono || "Sin teléfono"}
                    </p>
                  </div>

                  {empleadoDetalle.direccion && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Dirección
                      </label>
                      <p className="font-medium">{empleadoDetalle.direccion}</p>
                    </div>
                  )}
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
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-base px-3 py-1">
                      {empleadoDetalle.nom_cargo_empleado}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Sueldo
                    </label>
                    <p className="text-lg font-bold text-green-700">
                      S/.{" "}
                      {Number(empleadoDetalle.sueldo).toLocaleString("es-PE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Fecha de Registro
                    </label>
                    <p className="font-medium">
                      {formatearFecha(empleadoDetalle.fecha_registro_empleado)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      Cuenta BCP
                    </label>
                    <p className="font-mono font-medium">
                      {empleadoDetalle.cuenta_bcp || "Sin cuenta registrada"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                No se pudieron cargar los detalles del empleado.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
