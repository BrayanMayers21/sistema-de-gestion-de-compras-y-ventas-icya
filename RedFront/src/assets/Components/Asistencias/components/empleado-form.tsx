"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { EmpleadosService } from "../services/empleados-service";
import type {
  CreateEmpleadoData,
  UpdateEmpleadoData,
  EmpleadoItem,
  GeneroOption,
  CargoOption,
} from "../type/type";

// Schema de validación para crear/editar empleado
const empleadoSchema = z.object({
  // Datos de persona
  dni: z
    .string()
    .min(8, "El DNI debe tener 8 dígitos")
    .max(8, "El DNI debe tener 8 dígitos")
    .regex(/^\d+$/, "El DNI debe contener solo números"),
  fecha_nacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  primer_apell: z
    .string()
    .min(1, "El primer apellido es obligatorio")
    .max(45, "Máximo 45 caracteres"),
  segundo_apell: z
    .string()
    .min(1, "El segundo apellido es obligatorio")
    .max(45, "Máximo 45 caracteres"),
  nombres: z
    .string()
    .min(1, "Los nombres son obligatorios")
    .max(45, "Máximo 45 caracteres"),
  correo: z
    .string()
    .email("Correo inválido")
    .max(100, "Máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
  telefono: z
    .string()
    .max(15, "Máximo 15 caracteres")
    .optional()
    .or(z.literal("")),
  direccion: z.string().optional().or(z.literal("")),
  fotografia: z.string().optional().or(z.literal("")),
  fk_idgeneros: z.number().min(1, "Debe seleccionar un género"),

  // Datos de empleado
  sueldo: z
    .number({ invalid_type_error: "El sueldo debe ser un número" })
    .min(0, "El sueldo debe ser mayor o igual a 0"),
  cuenta_bcp: z
    .string()
    .max(45, "Máximo 45 caracteres")
    .optional()
    .or(z.literal("")),
  fk_idcargos_empleados: z.number().min(1, "Debe seleccionar un cargo"),
});

type EmpleadoFormData = z.infer<typeof empleadoSchema>;

interface EmpleadoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEmpleadoData | UpdateEmpleadoData) => Promise<boolean>;
  mode: "create" | "edit";
  empleado?: EmpleadoItem | null;
}

export function EmpleadoForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
  empleado,
}: EmpleadoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generos, setGeneros] = useState<GeneroOption[]>([]);
  const [cargos, setCargos] = useState<CargoOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const form = useForm<EmpleadoFormData>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: {
      dni: "",
      fecha_nacimiento: "",
      primer_apell: "",
      segundo_apell: "",
      nombres: "",
      correo: "",
      telefono: "",
      direccion: "",
      fotografia: "",
      fk_idgeneros: 0,
      sueldo: 0,
      cuenta_bcp: "",
      fk_idcargos_empleados: 0,
    },
  });

  // Cargar géneros y cargos
  useEffect(() => {
    const cargarOpciones = async () => {
      setLoadingOptions(true);
      try {
        const [generosRes, cargosRes] = await Promise.all([
          EmpleadosService.obtenerGeneros(),
          EmpleadosService.obtenerCargos(),
        ]);
        setGeneros(generosRes.data || []);
        setCargos(cargosRes.data || []);
      } catch (error) {
        console.error("Error cargando opciones:", error);
        toast.error("Error al cargar las opciones de selección");
      } finally {
        setLoadingOptions(false);
      }
    };

    if (isOpen) {
      cargarOpciones();
    }
  }, [isOpen]);

  // Cargar datos del empleado en modo edición
  useEffect(() => {
    if (isOpen && mode === "edit" && empleado) {
      // Cargar los datos del empleado completo si es necesario
      const cargarEmpleado = async () => {
        try {
          const id = empleado.idempleados;
          if (id) {
            const response = await EmpleadosService.obtenerPorId(id);
            const emp = response.data;
            if (emp) {
              form.reset({
                dni: emp.dni || "",
                fecha_nacimiento: emp.fecha_nacimiento
                  ? emp.fecha_nacimiento.split("T")[0]
                  : "",
                primer_apell: emp.primer_apell || "",
                segundo_apell: emp.segundo_apell || "",
                nombres: emp.nombres || "",
                correo: emp.correo || "",
                telefono: emp.telefono || "",
                direccion: emp.direccion || "",
                fotografia: emp.fotografia || "",
                fk_idgeneros: emp.fk_idgeneros || emp.idgeneros || 0,
                sueldo: emp.sueldo || 0,
                cuenta_bcp: emp.cuenta_bcp || "",
                fk_idcargos_empleados:
                  emp.fk_idcargos_empleados || emp.idcargos_empleados || 0,
              });
            }
          }
        } catch (error) {
          console.error("Error cargando empleado:", error);
          toast.error("Error al cargar los datos del empleado");
        }
      };

      cargarEmpleado();
    } else if (isOpen && mode === "create") {
      form.reset({
        dni: "",
        fecha_nacimiento: "",
        primer_apell: "",
        segundo_apell: "",
        nombres: "",
        correo: "",
        telefono: "",
        direccion: "",
        fotografia: "",
        fk_idgeneros: 0,
        sueldo: 0,
        cuenta_bcp: "",
        fk_idcargos_empleados: 0,
      });
    }
  }, [isOpen, mode, empleado, form]);

  const handleSubmit = async (data: EmpleadoFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Enviando formulario de empleado...", data);
      const success = await onSubmit(data);
      console.log("Resultado del envío:", success);

      if (success) {
        console.log(
          "Empleado procesado exitosamente, reseteando formulario..."
        );
        form.reset();
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al procesar el empleado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {mode === "create" ? "Nuevo Empleado" : "Editar Empleado"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Complete todos los campos para crear un nuevo empleado."
              : "Modifique los campos necesarios para actualizar el empleado."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 p-1"
            >
              {/* Datos Personales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5" />
                    Datos Personales
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DNI *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="12345678"
                            {...field}
                            disabled={loadingOptions}
                            maxLength={8}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fecha_nacimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Nacimiento *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Juan Carlos"
                            {...field}
                            disabled={loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primer_apell"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primer Apellido *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Pérez"
                            {...field}
                            disabled={loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="segundo_apell"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Segundo Apellido *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="García"
                            {...field}
                            disabled={loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fk_idgeneros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género *</FormLabel>
                        <Select
                          disabled={loadingOptions}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un género" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {generos.map((genero) => (
                              <SelectItem
                                key={genero.idgeneros}
                                value={genero.idgeneros.toString()}
                              >
                                {genero.nom_genero}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="correo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            {...field}
                            disabled={loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="987654321"
                            {...field}
                            disabled={loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="direccion"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Av. Principal 123"
                            {...field}
                            disabled={loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Datos Laborales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase className="w-5 h-5" />
                    Datos Laborales
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fk_idcargos_empleados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo *</FormLabel>
                        <Select
                          disabled={loadingOptions}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un cargo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cargos.map((cargo) => (
                              <SelectItem
                                key={cargo.idcargos_empleados}
                                value={cargo.idcargos_empleados.toString()}
                              >
                                {cargo.nom_cargo_empleado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sueldo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sueldo *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            disabled={loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cuenta_bcp"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Cuenta BCP</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="19312345678901"
                            {...field}
                            disabled={loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="flex gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting || loadingOptions}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === "create" ? "Crear Empleado" : "Actualizar Empleado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
