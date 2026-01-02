"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Trash2, GraduationCap, Users } from "lucide-react";
import toast from "react-hot-toast";
import { CapacitacionesService } from "../services/capacitaciones-service";
import type {
  CreateCapacitacionData,
  UpdateCapacitacionData,
  Capacitacion,
  EmpleadoOption,
  TipoActividadOption,
} from "../type/type";

// Schema de validación para asistente
const asistenteSchema = z.object({
  id_asistente: z.number().optional(),
  fk_idempleados: z.number().min(1, "Debe seleccionar un empleado"),
  area: z.string().optional().or(z.literal("")),
  asistio: z.boolean(),
  observaciones_asistente: z.string().optional().or(z.literal("")),
});

// Schema de validación para capacitación
const capacitacionSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  razon_social: z.string().optional().or(z.literal("")),
  ruc: z.string().max(11, "Máximo 11 dígitos").optional().or(z.literal("")),
  domicilio: z.string().optional().or(z.literal("")),
  actividad_economica: z.string().optional().or(z.literal("")),
  num_trabajadores: z
    .number({ invalid_type_error: "Debe ser un número" })
    .optional()
    .or(z.literal(0)),
  tipo_actividad: z.string().min(1, "Debe seleccionar un tipo de actividad"),
  fecha_capacitacion: z.string().min(1, "La fecha es obligatoria"),
  tema_capacitacion: z
    .string()
    .min(1, "El tema es obligatorio")
    .max(255, "Máximo 255 caracteres"),
  capacitador: z
    .string()
    .min(1, "El capacitador es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  num_horas: z
    .number({ invalid_type_error: "Debe ser un número" })
    .optional()
    .or(z.literal(0)),
  lugar_capacitacion: z.string().optional().or(z.literal("")),
  fk_idempleados: z.number().min(1, "Debe seleccionar un responsable"),
  observaciones: z.string().optional().or(z.literal("")),
  asistentes: z
    .array(asistenteSchema)
    .min(1, "Debe agregar al menos un asistente"),
});

type CapacitacionFormData = z.infer<typeof capacitacionSchema>;

interface CapacitacionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateCapacitacionData | UpdateCapacitacionData
  ) => Promise<boolean>;
  mode: "create" | "edit";
  capacitacion?: Capacitacion | null;
}

export function CapacitacionForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
  capacitacion,
}: CapacitacionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [empleados, setEmpleados] = useState<EmpleadoOption[]>([]);
  const [tiposActividad, setTiposActividad] = useState<TipoActividadOption[]>(
    []
  );
  const [loadingOptions, setLoadingOptions] = useState(true);

  const form = useForm<CapacitacionFormData>({
    resolver: zodResolver(capacitacionSchema),
    defaultValues: {
      codigo: "",
      razon_social: "",
      ruc: "",
      domicilio: "",
      actividad_economica: "",
      num_trabajadores: 0,
      tipo_actividad: "",
      fecha_capacitacion: "",
      tema_capacitacion: "",
      capacitador: "",
      num_horas: 0,
      lugar_capacitacion: "",
      fk_idempleados: 0,
      observaciones: "",
      asistentes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "asistentes",
  });

  // Cargar empleados y tipos de actividad
  useEffect(() => {
    const cargarOpciones = async () => {
      setLoadingOptions(true);
      try {
        const [empleadosRes, tiposRes] = await Promise.all([
          CapacitacionesService.obtenerEmpleados(),
          CapacitacionesService.obtenerTiposActividad(),
        ]);
        setEmpleados(empleadosRes.data || []);
        setTiposActividad(tiposRes.data || []);
      } catch (error) {
        console.error("Error cargando opciones:", error);
        toast.error("Error al cargar las opciones");
      } finally {
        setLoadingOptions(false);
      }
    };

    if (isOpen) {
      cargarOpciones();
    }
  }, [isOpen]);

  // Cargar datos de la capacitación en modo edición
  useEffect(() => {
    if (isOpen && mode === "edit" && capacitacion) {
      const cargarCapacitacion = async () => {
        try {
          const id = capacitacion.id_capacitacion;
          if (id) {
            const response = await CapacitacionesService.mostrar(id);
            if (response.data) {
              const data = response.data;
              form.reset({
                codigo: data.codigo || "",
                razon_social: data.razon_social || "",
                ruc: data.ruc || "",
                domicilio: data.domicilio || "",
                actividad_economica: data.actividad_economica || "",
                num_trabajadores: data.num_trabajadores || 0,
                tipo_actividad: data.tipo_actividad || "",
                fecha_capacitacion: data.fecha_capacitacion
                  ? new Date(data.fecha_capacitacion)
                      .toISOString()
                      .split("T")[0]
                  : "",
                tema_capacitacion: data.tema_capacitacion || "",
                capacitador: data.capacitador || "",
                num_horas: data.num_horas || 0,
                lugar_capacitacion: data.lugar_capacitacion || "",
                fk_idempleados: data.fk_idempleados || 0,
                observaciones: data.observaciones || "",
                asistentes:
                  data.asistentes?.map((a) => ({
                    id_asistente: a.id_asistente,
                    fk_idempleados: a.fk_idempleados,
                    area: a.area || "",
                    asistio: a.asistio ?? true,
                    observaciones_asistente: a.observaciones_asistente || "",
                  })) || [],
              });
            }
          }
        } catch (error) {
          console.error("Error cargando capacitación:", error);
          toast.error("Error al cargar los datos de la capacitación");
        }
      };

      cargarCapacitacion();
    } else if (isOpen && mode === "create") {
      form.reset({
        codigo: "",
        razon_social: "",
        ruc: "",
        domicilio: "",
        actividad_economica: "",
        num_trabajadores: 0,
        tipo_actividad: "",
        fecha_capacitacion: "",
        tema_capacitacion: "",
        capacitador: "",
        num_horas: 0,
        lugar_capacitacion: "",
        fk_idempleados: 0,
        observaciones: "",
        asistentes: [],
      });
    }
  }, [isOpen, mode, capacitacion, form]);

  const handleSubmit = async (data: CapacitacionFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Enviando formulario de capacitación...", data);
      const success = await onSubmit(data);
      console.log("Resultado del envío:", success);

      if (success) {
        console.log("Capacitación procesada exitosamente, reseteando...");
        form.reset();
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al procesar la capacitación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const agregarAsistente = () => {
    append({
      fk_idempleados: 0,
      area: "",
      asistio: true,
      observaciones_asistente: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            {mode === "create" ? "Nueva Capacitación" : "Editar Capacitación"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Complete los datos para registrar una nueva capacitación con sus asistentes."
              : "Modifique los datos de la capacitación y sus asistentes."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Información Básica
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código *</FormLabel>
                        <FormControl>
                          <Input placeholder="CAP-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fecha_capacitacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipo_actividad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Actividad *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposActividad.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
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
                    name="tema_capacitacion"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 lg:col-span-3">
                        <FormLabel>Tema *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Seguridad e higiene laboral"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacitador"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacitador *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre del capacitador"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="num_horas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            placeholder="4"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lugar_capacitacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lugar</FormLabel>
                        <FormControl>
                          <Input placeholder="Sala de reuniones" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fk_idempleados"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 lg:col-span-3">
                        <FormLabel>Responsable *</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione responsable" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {empleados.map((emp) => (
                              <SelectItem
                                key={emp.idempleados}
                                value={emp.idempleados.toString()}
                              >
                                {emp.nombre_completo} - {emp.cargo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Datos del Empleador */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Datos del Empleador (Opcional)
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="razon_social"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Razón Social</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre de la empresa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ruc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RUC</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="20123456789"
                            maxLength={11}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="domicilio"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Domicilio</FormLabel>
                        <FormControl>
                          <Input placeholder="Dirección" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="actividad_economica"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actividad Económica</FormLabel>
                        <FormControl>
                          <Input placeholder="Construcción" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="num_trabajadores"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N° Trabajadores</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="50"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : 0
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Asistentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Asistentes *
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={agregarAsistente}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Asistente
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay asistentes agregados. Haga clic en "Agregar
                      Asistente" para empezar.
                    </p>
                  ) : (
                    fields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name={`asistentes.${index}.fk_idempleados`}
                            render={({ field }) => (
                              <FormItem className="lg:col-span-2">
                                <FormLabel>Empleado *</FormLabel>
                                <Select
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
                                  value={field.value?.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccione empleado" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {empleados.map((emp) => (
                                      <SelectItem
                                        key={emp.idempleados}
                                        value={emp.idempleados.toString()}
                                      >
                                        {emp.nombre_completo} ({emp.dni})
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
                            name={`asistentes.${index}.area`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Área</FormLabel>
                                <FormControl>
                                  <Input placeholder="Área" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`asistentes.${index}.asistio`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-end space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Asistió
                                </FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`asistentes.${index}.observaciones_asistente`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2 lg:col-span-3">
                                <FormLabel>Observaciones</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Observaciones del asistente"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                  {form.formState.errors.asistentes && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.asistentes.message}
                    </p>
                  )}
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
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : mode === "create" ? (
              "Crear Capacitación"
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
