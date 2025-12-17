"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CalendarDays, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmpleadosService } from "../services/empleados-service";
import type { EmpleadoItem } from "../type/type";
import type {
  CreateAsistenciaIndividual,
  CreateAsistenciaMasiva,
} from "../type/type";

// Schema para registro individual
const asistenciaIndividualSchema = z.object({
  fecha_asistio: z.string().min(1, "La fecha es obligatoria"),
  estado: z.enum(["ASISTIO", "FALTA", "TARDANZA", "JUSTIFICADO"], {
    required_error: "El estado es obligatorio",
  }),
  observacion: z.string().optional(),
  fk_idempleados: z.number().min(1, "Debe seleccionar un empleado"),
});

// Schema para registro masivo (sin validar empleados aquí, se valida aparte)
const asistenciaMasivaSchema = z
  .object({
    fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fecha_fin: z.string().min(1, "La fecha de fin es obligatoria"),
    estado: z.enum(["ASISTIO", "FALTA", "TARDANZA", "JUSTIFICADO"], {
      required_error: "El estado es obligatorio",
    }),
    observacion: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.fecha_inicio || !data.fecha_fin) return true;
      return new Date(data.fecha_fin) >= new Date(data.fecha_inicio);
    },
    {
      message:
        "La fecha de fin debe ser posterior o igual a la fecha de inicio",
      path: ["fecha_fin"],
    }
  );

type AsistenciaIndividualFormData = z.infer<typeof asistenciaIndividualSchema>;
type AsistenciaMasivaFormData = z.infer<typeof asistenciaMasivaSchema>;

interface AsistenciaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateAsistenciaIndividual | CreateAsistenciaMasiva
  ) => Promise<boolean>;
  mode: "individual" | "masiva";
}

export function AsistenciaForm({
  isOpen,
  onClose,
  onSubmit,
  mode: initialMode,
}: AsistenciaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [empleados, setEmpleados] = useState<EmpleadoItem[]>([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(true);
  const [selectedEmpleados, setSelectedEmpleados] = useState<number[]>([]);
  const [mode, setMode] = useState<"individual" | "masiva">(initialMode);

  const formIndividual = useForm<AsistenciaIndividualFormData>({
    resolver: zodResolver(asistenciaIndividualSchema),
    defaultValues: {
      fecha_asistio: "",
      estado: "ASISTIO",
      observacion: "",
      fk_idempleados: 0,
    },
  });

  const formMasiva = useForm<AsistenciaMasivaFormData>({
    resolver: zodResolver(asistenciaMasivaSchema),
    defaultValues: {
      fecha_inicio: "",
      fecha_fin: "",
      estado: "ASISTIO",
      observacion: "",
    },
    mode: "onChange", // Validar en tiempo real
  });

  // Cargar empleados
  useEffect(() => {
    const cargarEmpleados = async () => {
      setLoadingEmpleados(true);
      try {
        const response = await EmpleadosService.listar({
          Limite_inferior: 0,
          Limite_Superior: 1000,
        });
        setEmpleados(response.data || []);
      } catch (error) {
        console.error("Error cargando empleados:", error);
        toast.error("Error al cargar los empleados");
      } finally {
        setLoadingEmpleados(false);
      }
    };

    if (isOpen) {
      cargarEmpleados();
    }
  }, [isOpen]);

  // Reset form cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      formIndividual.reset({
        fecha_asistio: "",
        estado: "ASISTIO",
        observacion: "",
        fk_idempleados: 0,
      });
      formMasiva.reset({
        fecha_inicio: "",
        fecha_fin: "",
        estado: "ASISTIO",
        observacion: "",
      });
      setSelectedEmpleados([]);
    }
  }, [isOpen, formIndividual, formMasiva]);

  // Reset solo cuando cambia el modo (tabs)
  useEffect(() => {
    if (isOpen && mode) {
      setSelectedEmpleados([]);
    }
  }, [mode, isOpen]);

  const handleSubmitIndividual = async (data: AsistenciaIndividualFormData) => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit(data);
      if (success) {
        formIndividual.reset();
        setTimeout(() => onClose(), 100);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al registrar la asistencia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitMasiva = async (data: AsistenciaMasivaFormData) => {
    // Validar que haya empleados seleccionados
    if (selectedEmpleados.length === 0) {
      toast.error("Debe seleccionar al menos un empleado");
      return;
    }

    // Validar que las fechas sean correctas
    if (new Date(data.fecha_fin) < new Date(data.fecha_inicio)) {
      toast.error("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataWithEmpleados = {
        ...data,
        empleados: selectedEmpleados,
      };

      const success = await onSubmit(dataWithEmpleados);

      if (success) {
        formMasiva.reset();
        setSelectedEmpleados([]);
        setTimeout(() => onClose(), 100);
      }
    } catch (error) {
      console.error("Error en handleSubmitMasiva:", error);
      toast.error("Error al registrar las asistencias");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEmpleado = (idEmpleado: number) => {
    setSelectedEmpleados((prev) =>
      prev.includes(idEmpleado)
        ? prev.filter((id) => id !== idEmpleado)
        : [...prev, idEmpleado]
    );
  };

  const seleccionarTodos = () => {
    if (selectedEmpleados.length === empleados.length) {
      setSelectedEmpleados([]);
    } else {
      setSelectedEmpleados(empleados.map((e) => e.idempleados));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Registro Rápido de Asistencia
          </DialogTitle>
          <DialogDescription>
            Selecciona trabajadores y fechas para registrar asistencia masiva
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "individual" | "masiva")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Registro Individual</TabsTrigger>
            <TabsTrigger value="masiva">Registro Masivo</TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-[60vh] pr-4 mt-4">
            {/* REGISTRO INDIVIDUAL */}
            <TabsContent value="individual" className="space-y-4">
              <Form {...formIndividual}>
                <form
                  onSubmit={formIndividual.handleSubmit(handleSubmitIndividual)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={formIndividual.control}
                      name="fecha_asistio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Asistencia</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formIndividual.control}
                      name="fk_idempleados"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empleado</FormLabel>
                          <Select
                            disabled={loadingEmpleados}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field.value ? String(field.value) : ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar empleado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {empleados.map((empleado) => (
                                <SelectItem
                                  key={empleado.idempleados}
                                  value={String(empleado.idempleados)}
                                >
                                  {`${empleado.nombres} ${empleado.primer_apell} ${empleado.segundo_apell}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={formIndividual.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ASISTIO">Asistió</SelectItem>
                            <SelectItem value="FALTA">Falta</SelectItem>
                            <SelectItem value="TARDANZA">Tardanza</SelectItem>
                            <SelectItem value="JUSTIFICADO">
                              Justificado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formIndividual.control}
                    name="observacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observación (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe alguna observación..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </TabsContent>

            {/* REGISTRO MASIVO */}
            <TabsContent value="masiva" className="space-y-4">
              <Form {...formMasiva}>
                <form
                  onSubmit={formMasiva.handleSubmit(handleSubmitMasiva)}
                  className="space-y-4"
                >
                  {/* Rango de Fechas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={formMasiva.control}
                      name="fecha_inicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Inicio</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={formMasiva.control}
                      name="fecha_fin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Fin</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={formMasiva.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ASISTIO">Asistió</SelectItem>
                            <SelectItem value="FALTA">Falta</SelectItem>
                            <SelectItem value="TARDANZA">Tardanza</SelectItem>
                            <SelectItem value="JUSTIFICADO">
                              Justificado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formMasiva.control}
                    name="observacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observación (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe alguna observación..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Selección de Trabajadores */}
                  <div className="space-y-3 border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Seleccionar Trabajadores
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={seleccionarTodos}
                      >
                        {selectedEmpleados.length === empleados.length
                          ? "Deseleccionar todos"
                          : "Seleccionar todos"}
                      </Button>
                    </div>

                    <ScrollArea className="h-[200px] border rounded p-3">
                      {loadingEmpleados ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span className="ml-2">Cargando empleados...</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {empleados.map((empleado) => (
                            <div
                              key={empleado.idempleados}
                              className="flex items-center space-x-3 p-2 hover:bg-accent rounded"
                            >
                              <Checkbox
                                checked={selectedEmpleados.includes(
                                  empleado.idempleados
                                )}
                                onCheckedChange={() =>
                                  toggleEmpleado(empleado.idempleados)
                                }
                              />
                              <div className="flex-1">
                                <p className="font-medium">
                                  {`${empleado.nombres} ${empleado.primer_apell} ${empleado.segundo_apell}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {empleado.nom_cargo_empleado}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground">
                        {selectedEmpleados.length} empleado(s) seleccionado(s)
                      </p>

                      {selectedEmpleados.length === 0 && (
                        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                          ⚠️ Debes seleccionar al menos un empleado para
                          continuar
                        </p>
                      )}
                    </div>

                    {/* Validación de fechas visual */}
                    {mode === "masiva" &&
                      formMasiva.watch("fecha_inicio") &&
                      formMasiva.watch("fecha_fin") &&
                      new Date(formMasiva.watch("fecha_fin")) <
                        new Date(formMasiva.watch("fecha_inicio")) && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                          ⚠️ <strong>Error:</strong> La fecha de fin no puede
                          ser anterior a la fecha de inicio
                        </div>
                      )}
                  </div>
                </form>
              </Form>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="flex gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => {
              console.log("\n\n🔵 BOTÓN REGISTRAR CLICKEADO");
              console.log("Modo actual:", mode);
              console.log("isSubmitting:", isSubmitting);

              if (mode === "individual") {
                console.log("Modo individual - ejecutando submit");
                formIndividual.handleSubmit(handleSubmitIndividual)();
              } else {
                console.log("Modo masivo - validando datos...");

                // Validar fechas antes de enviar
                const fechaInicio = formMasiva.getValues("fecha_inicio");
                const fechaFin = formMasiva.getValues("fecha_fin");
                const estado = formMasiva.getValues("estado");
                const observacion = formMasiva.getValues("observacion");

                console.log("Valores del formulario:");
                console.log("  - fecha_inicio:", fechaInicio);
                console.log("  - fecha_fin:", fechaFin);
                console.log("  - estado:", estado);
                console.log("  - observacion:", observacion);
                console.log("  - empleados seleccionados:", selectedEmpleados);

                if (!fechaInicio || !fechaFin) {
                  console.error("❌ Faltan fechas");
                  toast.error("Debe completar las fechas de inicio y fin");
                  return;
                }

                if (selectedEmpleados.length === 0) {
                  console.error("❌ No hay empleados seleccionados");
                  toast.error("Debe seleccionar al menos un empleado");
                  return;
                }

                if (new Date(fechaFin) < new Date(fechaInicio)) {
                  console.error("❌ Fechas en orden incorrecto");
                  toast.error(
                    "La fecha de fin no puede ser anterior a la fecha de inicio"
                  );
                  return;
                }

                console.log(
                  "✅ Validaciones pasadas, ejecutando handleSubmit..."
                );
                formMasiva.handleSubmit(handleSubmitMasiva)();
              }
            }}
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              <>Registrar Asistencia</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
