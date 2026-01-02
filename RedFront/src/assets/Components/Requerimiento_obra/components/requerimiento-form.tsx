"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { RequerimientosService } from "../services/requerimiento-service";
import type {
  ObraOption,
  ProductoOption,
  CreateRequerimientoObraData,
} from "../type/type";

// Schema de validación para el formulario de requerimiento de obra
const detalleSchema = z.object({
  fk_id_producto: z.number().min(1, "Debe seleccionar un producto"),
  cantidad: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
  marca: z.string().optional().or(z.literal("")),
  color: z.string().optional().or(z.literal("")),
  tipo: z.string().optional().or(z.literal("")),
  calidad: z.string().optional().or(z.literal("")),
  medida: z.string().optional().or(z.literal("")),
  observaciones: z.string().optional().or(z.literal("")),
});

const requerimientoSchema = z.object({
  fk_idobras: z.number().min(1, "Debe seleccionar una obra"),
  numero_requerimiento: z
    .string()
    .min(1, "El número de requerimiento es obligatorio"),
  fecha_requerimiento: z
    .string()
    .min(1, "La fecha de requerimiento es obligatoria"),
  fecha_atencion: z.string().optional().or(z.literal("")),
  lugar_entrega: z.string().optional().or(z.literal("")),
  residente_obra: z.string().min(1, "El residente de obra es obligatorio"),
  justificacion: z.string().optional().or(z.literal("")),
  detalles: z.array(detalleSchema).min(1, "Debe agregar al menos un producto"),
});

type RequerimientoFormData = z.infer<typeof requerimientoSchema>;

interface RequerimientoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRequerimientoObraData) => Promise<boolean>;
  mode: "create" | "edit";
}

export function RequerimientoForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
}: RequerimientoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [obras, setObras] = useState<ObraOption[]>([]);
  const [productos, setProductos] = useState<ProductoOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const form = useForm<RequerimientoFormData>({
    resolver: zodResolver(requerimientoSchema),
    defaultValues: {
      fk_idobras: 0,
      numero_requerimiento: "",
      fecha_requerimiento: new Date().toISOString().split("T")[0],
      fecha_atencion: "",
      lugar_entrega: "",
      residente_obra: "",
      justificacion: "",
      detalles: [
        {
          fk_id_producto: 0,
          cantidad: 1,
          marca: "",
          color: "",
          tipo: "",
          calidad: "",
          medida: "",
          observaciones: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "detalles",
  });

  // Cargar opciones para los selects
  useEffect(() => {
    const cargarOpciones = async () => {
      setLoadingOptions(true);
      try {
        const [obrasRes, productosRes] = await Promise.all([
          RequerimientosService.obtenerObras(),
          RequerimientosService.obtenerProductos(),
        ]);

        setObras(obrasRes.data || []);
        setProductos(productosRes.data || []);
      } catch (error) {
        console.error("Error cargando opciones:", error);
        toast.error("Error al cargar las opciones del formulario");
      } finally {
        setLoadingOptions(false);
      }
    };

    if (isOpen) {
      cargarOpciones();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        fk_idobras: 0,
        numero_requerimiento: "",
        fecha_requerimiento: new Date().toISOString().split("T")[0],
        fecha_atencion: "",
        lugar_entrega: "",
        residente_obra: "",
        justificacion: "",
        detalles: [
          {
            fk_id_producto: 0,
            cantidad: 1,
            marca: "",
            color: "",
            tipo: "",
            calidad: "",
            medida: "",
            observaciones: "",
          },
        ],
      });
    }
  }, [isOpen, form]);

  const handleSubmit = async (data: RequerimientoFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Enviando requerimiento al padre...");
      const success = await onSubmit(data);
      console.log("Resultado del envío:", success);

      if (success) {
        console.log(
          "Requerimiento procesado exitosamente, reseteando formulario..."
        );
        form.reset();
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al procesar el requerimiento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold ">
            {mode === "create"
              ? "Crear Nuevo Requerimiento de Obra"
              : "Editar Requerimiento de Obra"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Complete los datos del requerimiento de obra con las especificaciones técnicas de los materiales necesarios."
              : "Modifique los datos del requerimiento de obra según sea necesario."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 p-2"
          >
            <div className="max-h-[75vh] overflow-y-auto pr-4 space-y-8">
              {/* Información General */}
              <div className="rounded-lg p-8 border border-blue-200">
                <h3 className="text-lg font-semibold  mb-4 flex items-center">
                  <div className="w-2 h-2  rounded-full mr-3"></div>
                  Información General del Requerimiento
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Obra */}
                  <FormField
                    control={form.control}
                    name="fk_idobras"
                    render={({ field }) => {
                      const [searchObra, setSearchObra] = useState("");

                      const obrasFiltradas = obras.filter((obra) => {
                        const nombre = obra.nom_obra || "";
                        const codigo = obra.codigo || "";
                        const searchTerm = searchObra.toLowerCase();

                        return (
                          nombre.toLowerCase().includes(searchTerm) ||
                          codigo.toLowerCase().includes(searchTerm)
                        );
                      });

                      return (
                        <FormItem>
                          <FormLabel className="text-sm font-medium ">
                            Obra *
                          </FormLabel>
                          <Select
                            disabled={loadingOptions}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field.value ? String(field.value) : ""}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Seleccionar obra" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <div className="p-2 border-b">
                                <Input
                                  placeholder="🔍 Buscar obra..."
                                  value={searchObra}
                                  onChange={(e) =>
                                    setSearchObra(e.target.value)
                                  }
                                  className="h-9"
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                {obrasFiltradas.length > 0 ? (
                                  obrasFiltradas.map((obra) => (
                                    <SelectItem
                                      key={obra.idobras}
                                      value={String(obra.idobras)}
                                    >
                                      <div className="flex flex-col">
                                        <span className="font-medium">
                                          {obra.nom_obra || "Sin nombre"}
                                        </span>
                                        <span className="text-xs ">
                                          Código: {obra.codigo || "N/A"}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-4 text-center text-sm ">
                                    No se encontraron obras
                                  </div>
                                )}
                              </div>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {/* Número de Requerimiento */}
                  <FormField
                    control={form.control}
                    name="numero_requerimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium ">
                          N° Requerimiento *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: REQ-2025-001"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Residente de Obra */}
                  <FormField
                    control={form.control}
                    name="residente_obra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium ">
                          Residente de Obra *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre del residente"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fecha Requerimiento */}
                  <FormField
                    control={form.control}
                    name="fecha_requerimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium ">
                          Fecha Requerimiento *
                        </FormLabel>
                        <FormControl>
                          <Input type="date" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fecha Atención */}
                  <FormField
                    control={form.control}
                    name="fecha_atencion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium ">
                          Fecha Atención
                        </FormLabel>
                        <FormControl>
                          <Input type="date" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lugar de Entrega */}
                  <FormField
                    control={form.control}
                    name="lugar_entrega"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium ">
                          Lugar de Entrega
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dirección de entrega"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Justificación */}
                  <FormField
                    control={form.control}
                    name="justificacion"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 lg:col-span-3">
                        <FormLabel className="text-sm font-medium ">
                          Justificación
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Justificación del requerimiento..."
                            className="resize-none min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Detalles de productos */}
              <div className=" rounded-lg p-8 border border-green-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold  flex items-center">
                    <div className="w-2 h-2  rounded-full mr-3"></div>
                    Productos del Requerimiento *
                  </h3>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className=" rounded-xl p-8 shadow-sm border-2 border-gray-100 hover:border-gray-200 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold  flex items-center">
                          <span className="  text-sm font-medium px-3 py-1 rounded-full mr-3">
                            #{index + 1}
                          </span>
                          Producto {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(index)}
                            disabled={isSubmitting}
                            className="bg-red-500 hover:bg-red-600 shadow-sm"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Producto */}
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.fk_id_producto`}
                          render={({ field }) => {
                            const [searchProducto, setSearchProducto] =
                              useState("");

                            const productosFiltrados = productos.filter(
                              (producto) => {
                                const nombre = producto.nombre || "";
                                const codigo = producto.codigo || "";
                                const searchTerm = searchProducto.toLowerCase();

                                return (
                                  nombre.toLowerCase().includes(searchTerm) ||
                                  codigo.toLowerCase().includes(searchTerm)
                                );
                              }
                            );

                            return (
                              <FormItem className="md:col-span-2">
                                <FormLabel className="text-sm font-medium ">
                                  Producto *
                                </FormLabel>
                                <Select
                                  disabled={loadingOptions}
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
                                  value={field.value ? String(field.value) : ""}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-11">
                                      <SelectValue placeholder="Seleccionar producto" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <div className="p-2 border-b">
                                      <Input
                                        placeholder="Buscar producto..."
                                        value={searchProducto}
                                        onChange={(e) =>
                                          setSearchProducto(e.target.value)
                                        }
                                        className="h-9"
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.stopPropagation()}
                                      />
                                    </div>
                                    <div className="max-h-[200px] overflow-y-auto">
                                      {productosFiltrados.length > 0 ? (
                                        productosFiltrados.map((producto) => (
                                          <SelectItem
                                            key={producto.id_producto}
                                            value={String(producto.id_producto)}
                                          >
                                            <div className="flex flex-col">
                                              <span className="font-medium">
                                                {producto.nombre ||
                                                  "Sin nombre"}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                Código:{" "}
                                                {producto.codigo || "N/A"}
                                              </span>
                                            </div>
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <div className="p-4 text-center text-sm text-gray-500">
                                          No se encontraron productos
                                        </div>
                                      )}
                                    </div>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        {/* Cantidad */}
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.cantidad`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium ">
                                Cantidad *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  placeholder="Cantidad"
                                  className="h-11"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Marca */}
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.marca`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium ">
                                Marca
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Marca"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Color */}
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.color`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium ">
                                Color
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Color"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Tipo */}
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.tipo`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium ">
                                Tipo
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Tipo"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Calidad */}
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.calidad`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium ">
                                Calidad
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Calidad"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Medida */}
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.medida`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium ">
                                Medida
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Medida"
                                  className="h-11"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Observaciones del detalle */}
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name={`detalles.${index}.observaciones`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium ">
                                💭 Observaciones del Producto
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Observaciones específicas de este producto..."
                                  className="resize-none min-h-[80px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() =>
                      append({
                        fk_id_producto: 0,
                        cantidad: 1,
                        marca: "",
                        color: "",
                        tipo: "",
                        calidad: "",
                        medida: "",
                        observaciones: "",
                      })
                    }
                    disabled={loadingOptions}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                  >
                    <Plus className="w-auto h-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 h-12 border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || loadingOptions}
                  className="flex-1 h-12 shadow-lg"
                >
                  {isSubmitting && (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  )}
                  {mode === "create"
                    ? "Crear Requerimiento"
                    : "Actualizar Requerimiento"}
                </Button>
              </div>
            </div>

            {/* Botones */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
