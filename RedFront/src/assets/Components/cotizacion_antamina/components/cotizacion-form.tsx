"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Trash2, Calculator } from "lucide-react";
import toast from "react-hot-toast";
import type {
  CreateCotizacionData,
  UpdateCotizacionData,
  ProductoOption,
} from "../type/cotizacion-type";
import { CotizacionAntaminaService } from "../services/cotizacion-service";

// Schema de validación para detalles de cotización
const detalleCotizacionSchema = z.object({
  iddetalle_cotizacion_antamina: z.number().optional(),
  cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
  precio_unitario: z
    .number()
    .min(0.01, "El precio unitario debe ser mayor a 0"),
  sub_total: z.number().min(0, "El subtotal debe ser mayor o igual a 0"),
  marca: z
    .string()
    .max(100, "Máximo 100 caracteres")
    .or(z.literal(""))
    .optional(),
  fk_id_producto: z.number().min(1, "Debe seleccionar un producto"),
});

// Schema de validación para el formulario de cotización
const cotizacionSchema = z.object({
  fecha_cot: z.string().optional(),
  numero_cot: z.string().optional(),
  cliente: z
    .string()
    .min(1, "El cliente es obligatorio")
    .max(255, "Máximo 255 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional(),
  detalles: z
    .array(detalleCotizacionSchema)
    .min(1, "Debe agregar al menos un detalle"),
});

type CotizacionFormData = z.infer<typeof cotizacionSchema>;

interface CotizacionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateCotizacionData | UpdateCotizacionData
  ) => Promise<boolean>;
  mode: "create" | "edit";
  cotizacionId?: number;
}

export function CotizacionForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
  cotizacionId,
}: CotizacionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productos, setProductos] = useState<ProductoOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [costoTotal, setCostoTotal] = useState(0);

  const form = useForm<CotizacionFormData>({
    resolver: zodResolver(cotizacionSchema),
    defaultValues: {
      fecha_cot: "",
      numero_cot: "",
      cliente: "",
      descripcion: "",
      detalles: [
        {
          cantidad: 1,
          precio_unitario: 0,
          sub_total: 0,
          marca: "",
          fk_id_producto: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detalles",
  });

  // Cargar productos y datos si es modo edición
  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingOptions(true);
      try {
        // Cargar productos
        const productosRes = await CotizacionAntaminaService.obtenerProductos();
        if (productosRes.success && productosRes.data) {
          setProductos(productosRes.data);
        }

        // Si es modo edición, cargar la cotización
        if (mode === "edit" && cotizacionId) {
          const cotizacionRes = await CotizacionAntaminaService.mostrar(
            cotizacionId
          );
          if (cotizacionRes.success && cotizacionRes.data) {
            const cotizacion = cotizacionRes.data;
            form.reset({
              fecha_cot: cotizacion.fecha_cot || "",
              numero_cot: cotizacion.numero_cot || "",
              cliente: cotizacion.cliente,
              descripcion: cotizacion.descripcion || "",
              detalles:
                cotizacion.detalles?.map((detalle) => ({
                  iddetalle_cotizacion_antamina:
                    detalle.iddetalle_cotizacion_antamina,
                  cantidad: detalle.cantidad,
                  precio_unitario: detalle.precio_unitario,
                  sub_total: detalle.sub_total,
                  marca: detalle.marca || "",
                  fk_id_producto: detalle.fk_id_producto,
                })) || [],
            });
            calcularTotal();
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar los datos del formulario");
      } finally {
        setLoadingOptions(false);
      }
    };

    if (isOpen) {
      cargarDatos();
    }
  }, [isOpen, mode, cotizacionId, form]);

  // Calcular subtotal de un detalle
  const calcularSubtotalDetalle = (index: number) => {
    const cantidad = form.getValues(`detalles.${index}.cantidad`) || 0;
    const precioUnitario =
      form.getValues(`detalles.${index}.precio_unitario`) || 0;
    const subtotal = cantidad * precioUnitario;
    form.setValue(`detalles.${index}.sub_total`, subtotal);
    calcularTotal();
  };

  // Calcular costo total
  const calcularTotal = () => {
    const detalles = form.getValues("detalles") || [];
    const total = detalles.reduce(
      (sum, detalle) => sum + (detalle.sub_total || 0),
      0
    );
    setCostoTotal(total);
  };

  // Agregar nuevo detalle
  const agregarDetalle = () => {
    append({
      cantidad: 1,
      precio_unitario: 0,
      sub_total: 0,
      marca: "",
      fk_id_producto: 0,
    });
  };

  // Eliminar detalle
  const eliminarDetalle = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      calcularTotal();
    } else {
      toast.error("Debe haber al menos un detalle");
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && mode === "create") {
      form.reset({
        fecha_cot: "",
        numero_cot: "",
        cliente: "",
        descripcion: "",
        detalles: [
          {
            cantidad: 1,
            precio_unitario: 0,
            sub_total: 0,
            marca: "",
            fk_id_producto: 0,
          },
        ],
      });
      setCostoTotal(0);
    }
  }, [isOpen, mode, form]);

  const handleSubmit = async (data: CotizacionFormData) => {
    setIsSubmitting(true);
    try {
      // Validar que todos los productos estén seleccionados
      const productosNoSeleccionados = data.detalles.filter(
        (detalle) => detalle.fk_id_producto === 0
      );

      if (productosNoSeleccionados.length > 0) {
        toast.error("Debe seleccionar un producto para todos los detalles");
        setIsSubmitting(false);
        return;
      }

      // Preparar datos según el modo
      let dataToSubmit: any = { ...data };

      if (mode === "create") {
        // En modo crear, remover campos que se generan automáticamente
        delete dataToSubmit.fecha_cot;
        delete dataToSubmit.numero_cot;
      }

      const success = await onSubmit(dataToSubmit);

      if (success) {
        form.reset();
        setCostoTotal(0);
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al procesar la cotización");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Nueva Cotización Antamina"
              : "Editar Cotización Antamina"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Complete todos los campos para crear una nueva cotización."
              : "Modifique los campos necesarios para actualizar la cotización."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 p-1"
            >
              {/* Información General */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información General</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mode === "edit" && (
                    <>
                      <FormField
                        control={form.control}
                        name="numero_cot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Cotización</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Número de cotización"
                                className="bg-gray-100 cursor-not-allowed"
                                readOnly
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fecha_cot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Cotización *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="cliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción de la cotización (opcional)"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Detalles de Productos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    Detalles de Productos
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={agregarDetalle}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Producto
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <Card
                      key={field.id}
                      className="p-4 border-l-4 border-l-blue-500"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-sm">
                          Producto #{index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => eliminarDetalle(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.fk_id_producto`}
                          render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                              <FormLabel>Producto *</FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(Number(value))
                                }
                                value={
                                  field.value > 0
                                    ? field.value.toString()
                                    : undefined
                                }
                                disabled={loadingOptions}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un producto" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {productos.map((producto) => (
                                    <SelectItem
                                      key={producto.id_producto}
                                      value={producto.id_producto.toString()}
                                    >
                                      {producto.codigo} - {producto.nombre}
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
                          name={`detalles.${index}.cantidad`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cantidad *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value));
                                    calcularSubtotalDetalle(index);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detalles.${index}.precio_unitario`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Precio Unitario *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(Number(e.target.value));
                                    calcularSubtotalDetalle(index);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detalles.${index}.sub_total`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subtotal</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  readOnly
                                  className="bg-gray-50 font-semibold"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detalles.${index}.marca`}
                          render={({ field }) => (
                            <FormItem className="lg:col-span-5">
                              <FormLabel>Marca (Opcional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Marca del producto"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Total */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Resumen Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <span className="text-lg font-semibold text-blue-900">
                      Costo Total:
                    </span>
                    <span className="text-2xl font-bold text-blue-700">
                      S/. {costoTotal.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>

          <DialogFooter className="flex gap-4 pt-6 border-t px-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isSubmitting || loadingOptions}
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {mode === "create" ? "Crear Cotización" : "Actualizar Cotización"}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
