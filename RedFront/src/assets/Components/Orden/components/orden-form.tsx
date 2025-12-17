"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Plus,
  Trash2,
  Calculator,
  Upload,
  FileText,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import type {
  CreateOrdenCompraData,
  ProveedorOption,
  TipoOrdenOption,
  ProductoOption,
  CodigoContableOption,
} from "../type/type";
import { CategoriasService } from "../services/ordenCompra-service";

// Schema de validación para archivos adjuntos
const archivoSchema = z.object({
  archivo: z.any().optional(), // El archivo File será validado manualmente
  tipo_archivo: z.enum(
    ["cotizacion", "factura", "guia", "reporte servicio", "acta de contrato"],
    {
      errorMap: () => ({ message: "Seleccione un tipo de archivo válido" }),
    }
  ),
  fecha_archivo: z.string().optional(), // Fecha opcional
});

// Schema de validación para el formulario de orden de compra
const ordenDetalleSchema = z.object({
  cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
  precio_unitario: z
    .number()
    .min(0.01, "El precio unitario debe ser mayor a 0"),
  subtotal_detalle: z.number().min(0, "El subtotal debe ser mayor o igual a 0"),
  fk_id_producto: z.number().min(1, "Debe seleccionar un producto"),
});

const ordenCompraSchema = z.object({
  fecha_emision: z.string().min(1, "La fecha de emisión es obligatoria"),
  fecha_entrega: z.string().min(1, "La fecha de entrega es obligatoria"),
  lugar_entrega: z
    .string()
    .min(1, "El lugar de entrega es obligatorio")
    .max(255, "Máximo 255 caracteres"),
  estado: z.enum(["pendiente", "pagado", "rechazado"], {
    errorMap: () => ({ message: "Seleccione un estado válido" }),
  }),
  subtotal: z.number().min(0, "El subtotal debe ser mayor o igual a 0"),
  igv: z.number().min(0, "El IGV debe ser mayor o igual a 0"),
  adelanto: z.number().min(0, "El adelanto debe ser mayor o igual a 0"),
  total: z.number().min(0, "El total debe ser mayor o igual a 0"),
  incluir_igv: z.boolean(),
  observaciones: z.string().max(500, "Máximo 500 caracteres").optional(),
  fk_idobras: z.number().min(1, "Debe seleccionar una obra"),
  fk_idtipo_orden: z.number().min(1, "Debe seleccionar un tipo de orden"),
  fk_id_proveedor: z.number().min(1, "Debe seleccionar un proveedor"),
  detalles: z
    .array(ordenDetalleSchema)
    .min(1, "Debe agregar al menos un detalle"),
  archivos: z.array(archivoSchema).optional(),
});

type OrdenCompraFormData = z.infer<typeof ordenCompraSchema>;

interface OrdenFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrdenCompraData) => Promise<boolean>;
  mode: "create" | "edit";
}

export function OrdenForm({ isOpen, onClose, onSubmit, mode }: OrdenFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proveedores, setProveedores] = useState<ProveedorOption[]>([]);
  const [tiposOrden, setTiposOrden] = useState<TipoOrdenOption[]>([]);
  const [productos, setProductos] = useState<ProductoOption[]>([]);
  const [codigosContables, setCodigosContables] = useState<
    CodigoContableOption[]
  >([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Estado para manejar los archivos adjuntos
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<
    Array<{
      archivo: File | null;
      tipo_archivo: string;
      fecha_archivo: string;
    }>
  >([]);

  const form = useForm<OrdenCompraFormData>({
    resolver: zodResolver(ordenCompraSchema),
    defaultValues: {
      fecha_emision: new Date().toISOString().split("T")[0],
      fecha_entrega: new Date().toISOString().split("T")[0],
      lugar_entrega: "Huaraz",
      estado: "pendiente" as const,
      subtotal: 0,
      igv: 0,
      adelanto: 0,
      total: 0,
      incluir_igv: false,
      observaciones: "",
      fk_idobras: 0,
      fk_idtipo_orden: 0,
      fk_id_proveedor: 0,
      detalles: [
        {
          cantidad: 1,
          precio_unitario: 0,
          subtotal_detalle: 0,
          fk_id_producto: 0,
        },
      ],
      archivos: [],
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
        const [proveedoresRes, tiposRes, productosRes, codigosRes] =
          await Promise.all([
            CategoriasService.obtenerProveedores(),
            CategoriasService.obtenerTiposOrden(),
            CategoriasService.obtenerProductos(),
            CategoriasService.obtenerCodigosContables(),
          ]);

        setProveedores(proveedoresRes.data || []);
        setTiposOrden(tiposRes.data || []);
        setProductos(productosRes.data || []);
        setCodigosContables(codigosRes.data || []);
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

  // Calcular subtotal de un detalle
  const calcularSubtotalDetalle = (index: number) => {
    const cantidad = form.getValues(`detalles.${index}.cantidad`) || 0;
    const precioUnitario =
      form.getValues(`detalles.${index}.precio_unitario`) || 0;
    const subtotal = cantidad * precioUnitario;
    form.setValue(`detalles.${index}.subtotal_detalle`, subtotal);
    calcularTotales();
  };

  // Calcular totales generales
  const calcularTotales = () => {
    const detalles = form.getValues("detalles") || [];
    const subtotal = detalles.reduce(
      (sum, detalle) => sum + (detalle.subtotal_detalle || 0),
      0
    );
    const incluirIgv = form.getValues("incluir_igv") || false;
    const igv = incluirIgv ? subtotal * 0.18 : 0; // 18% IGV solo si está marcado
    const adelanto = form.getValues("adelanto") || 0;
    const total = subtotal + igv - adelanto;

    form.setValue("subtotal", subtotal);
    form.setValue("igv", igv);
    form.setValue("total", Math.max(0, total));
  };

  // Agregar nuevo detalle
  const agregarDetalle = () => {
    append({
      cantidad: 1,
      precio_unitario: 0,
      subtotal_detalle: 0,
      fk_id_producto: 0,
    });
  };

  // Eliminar detalle
  const eliminarDetalle = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      calcularTotales();
    }
  };

  // Funciones para manejar archivos adjuntos
  const agregarArchivo = () => {
    setArchivosAdjuntos([
      ...archivosAdjuntos,
      {
        archivo: null,
        tipo_archivo: "cotizacion",
        fecha_archivo: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const eliminarArchivo = (index: number) => {
    const nuevosArchivos = archivosAdjuntos.filter((_, i) => i !== index);
    setArchivosAdjuntos(nuevosArchivos);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const nuevosArchivos = [...archivosAdjuntos];
    nuevosArchivos[index].archivo = file;
    setArchivosAdjuntos(nuevosArchivos);
  };

  const handleTipoArchivoChange = (index: number, tipo: string) => {
    const nuevosArchivos = [...archivosAdjuntos];
    nuevosArchivos[index].tipo_archivo = tipo;
    setArchivosAdjuntos(nuevosArchivos);
  };

  const handleFechaArchivoChange = (index: number, fecha: string) => {
    const nuevosArchivos = [...archivosAdjuntos];
    nuevosArchivos[index].fecha_archivo = fecha;
    setArchivosAdjuntos(nuevosArchivos);
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setArchivosAdjuntos([]);
      form.reset({
        fecha_emision: new Date().toISOString().split("T")[0],
        fecha_entrega: new Date().toISOString().split("T")[0],
        lugar_entrega: "Huaraz",
        estado: "pendiente" as const,
        subtotal: 0,
        igv: 0,
        adelanto: 0,
        total: 0,
        incluir_igv: false,
        observaciones: "",
        fk_idobras: 0,
        fk_idtipo_orden: 0,
        fk_id_proveedor: 0,
        detalles: [
          {
            cantidad: 1,
            precio_unitario: 0,
            subtotal_detalle: 0,
            fk_id_producto: 0,
          },
        ],
      });
    }
  }, [isOpen, form]);

  const handleSubmit = async (data: OrdenCompraFormData) => {
    setIsSubmitting(true);
    try {
      // Validar que todos los productos estén seleccionados
      const productosNoSeleccionados = data.detalles.filter(
        (detalle) => detalle.fk_id_producto === 0
      );

      if (productosNoSeleccionados.length > 0) {
        toast.error("Debe seleccionar un producto para todos los detalles");
        return;
      }

      // Validar archivos adjuntos
      const archivosValidos = archivosAdjuntos.filter(
        (archivo) => archivo.archivo !== null
      );

      // Validar tamaño de archivos (máx 2MB)
      for (const archivo of archivosValidos) {
        if (archivo.archivo && archivo.archivo.size > 2048 * 1024) {
          toast.error(
            `El archivo ${archivo.archivo.name} excede el tamaño máximo de 2MB`
          );
          return;
        }
      }

      // Crear FormData para enviar archivos
      const formData = new FormData();

      // Agregar datos de la orden
      Object.keys(data).forEach((key) => {
        if (key === "detalles") {
          // Manejar detalles por separado
          data.detalles.forEach((detalle, index) => {
            Object.keys(detalle).forEach((detalleKey) => {
              formData.append(
                `detalles[${index}][${detalleKey}]`,
                String(detalle[detalleKey as keyof typeof detalle])
              );
            });
          });
        } else if (key !== "incluir_igv" && key !== "archivos") {
          formData.append(key, String(data[key as keyof typeof data]));
        }
      });

      // Agregar archivos adjuntos
      archivosValidos.forEach((archivo, index) => {
        if (archivo.archivo) {
          formData.append(`archivos[${index}][archivo]`, archivo.archivo);
          formData.append(
            `archivos[${index}][tipo_archivo]`,
            archivo.tipo_archivo
          );
          if (archivo.fecha_archivo) {
            formData.append(
              `archivos[${index}][fecha_archivo]`,
              archivo.fecha_archivo
            );
          }
        }
      });

      console.log("Enviando formulario con archivos...");
      // Enviar el FormData en lugar del objeto data
      const success = await onSubmit(formData as any);
      console.log("Resultado del envío:", success);

      if (success) {
        console.log("Orden procesada exitosamente, reseteando formulario...");
        form.reset();
        setArchivosAdjuntos([]);
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al procesar la orden de compra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Nueva Orden de compra-Servicio"
              : "Editar Orden de compra-Servicio"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Complete todos los campos para crear una nueva orden de compra-Servicio."
              : "Modifique los campos necesarios para actualizar la orden de compra-Servicio."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 p-1"
            >
              {/* Información General */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información General</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  <FormField
                    control={form.control}
                    name="fecha_emision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Emisión *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fecha_entrega"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Entrega *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="pagado">Pagado</SelectItem>
                            <SelectItem value="rechazado">Rechazado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lugar_entrega"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-3">
                        <FormLabel>Lugar de Entrega *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese el lugar de entrega"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observaciones adicionales (opcional)"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fk_id_proveedor"
                    render={({ field }) => {
                      const [searchProveedor, setSearchProveedor] =
                        useState("");

                      const proveedoresFiltrados = proveedores.filter(
                        (proveedor) => {
                          const razonSocial = proveedor.razon_social || "";
                          const ruc = proveedor.ruc || "";
                          const searchTerm = searchProveedor.toLowerCase();

                          return (
                            razonSocial.toLowerCase().includes(searchTerm) ||
                            ruc.includes(searchProveedor)
                          );
                        }
                      );

                      return (
                        <FormItem>
                          <FormLabel>Proveedor *</FormLabel>
                          <Select
                            disabled={loadingOptions}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field.value ? String(field.value) : ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar proveedor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <div className="p-2 border-b">
                                <Input
                                  placeholder="🔍 Buscar proveedor por nombre o RUC..."
                                  value={searchProveedor}
                                  onChange={(e) =>
                                    setSearchProveedor(e.target.value)
                                  }
                                  className="h-9"
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                {proveedoresFiltrados.length > 0 ? (
                                  proveedoresFiltrados.map((proveedor) => (
                                    <SelectItem
                                      key={proveedor.id_proveedor}
                                      value={String(proveedor.id_proveedor)}
                                    >
                                      <div className="flex flex-col">
                                        <span className="font-medium">
                                          {proveedor.razon_social ||
                                            "Sin nombre"}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          RUC: {proveedor.ruc || "N/A"}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-4 text-center text-sm text-gray-500">
                                    No se encontraron proveedores
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
                  <FormField
                    control={form.control}
                    name="fk_idtipo_orden"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Orden *</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value > 0 ? field.value.toString() : undefined
                          }
                          disabled={loadingOptions}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposOrden.map((tipo) => (
                              <SelectItem
                                key={tipo.idtipo_orden}
                                value={tipo.idtipo_orden.toString()}
                              >
                                {tipo.nom_orden}
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
                    name="fk_idobras"
                    render={({ field }) => {
                      const [searchCodigo, setSearchCodigo] = useState("");

                      const codigosFiltrados = codigosContables.filter(
                        (codigo) => {
                          const codigoContable = codigo.codigo || "";
                          const nombreObra = codigo.nom_obra || "";
                          const searchTerm = searchCodigo.toLowerCase();

                          return (
                            codigoContable.toLowerCase().includes(searchTerm) ||
                            nombreObra.toLowerCase().includes(searchTerm)
                          );
                        }
                      );

                      // Obtener el código y nombre de obra seleccionado
                      const codigoSeleccionado = codigosContables.find(
                        (c) => c.idobras === field.value
                      );

                      return (
                        <FormItem>
                          <FormLabel>Obra *</FormLabel>
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
                              <SelectTrigger className="w-full h-auto min-h-[40px]">
                                <SelectValue placeholder="Seleccione un código">
                                  {codigoSeleccionado && (
                                    <div className="flex flex-col items-start py-1 w-full">
                                      <span className="font-medium text-sm truncate w-full">
                                        {codigoSeleccionado.codigo}
                                      </span>
                                      <span className="text-xs text-gray-500 truncate w-full">
                                        {codigoSeleccionado.nom_obra}
                                      </span>
                                    </div>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="w-[500px]">
                              <div className="p-2 border-b">
                                <Input
                                  placeholder="🔍 Buscar código contable..."
                                  value={searchCodigo}
                                  onChange={(e) =>
                                    setSearchCodigo(e.target.value)
                                  }
                                  className="h-9"
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                {codigosFiltrados.length > 0 ? (
                                  codigosFiltrados.map((codigo) => (
                                    <SelectItem
                                      key={codigo.idobras}
                                      value={codigo.idobras.toString()}
                                      className="cursor-pointer"
                                    >
                                      <div className="flex flex-col w-full min-w-0">
                                        <span className="font-medium text-sm truncate">
                                          {codigo.codigo || "Sin código"}
                                        </span>
                                        <span className="text-xs text-gray-500 line-clamp-2">
                                          {codigo.nom_obra}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-4 text-center text-sm text-gray-500">
                                    No se encontraron Obras
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
                </CardContent>
              </Card>

              {/* Detalles de Productos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">
                    Detalles de Productos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 ">
                  {fields.map((field, index) => (
                    <Card
                      key={field.id}
                      className="p-6 border-l-4 border-l-blue-500"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-6 items-end min-w-0">
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
                              <FormItem className="lg:col-span-2 xl:col-span-2">
                                <FormLabel>Producto *</FormLabel>
                                <Select
                                  disabled={loadingOptions}
                                  onValueChange={(value) =>
                                    field.onChange(Number(value))
                                  }
                                  value={field.value ? String(field.value) : ""}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar producto" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <div className="p-2 border-b">
                                      <Input
                                        placeholder="🔍 Buscar producto por nombre o código..."
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

                        <FormField
                          control={form.control}
                          name={`detalles.${index}.cantidad`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cantidad *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="1"
                                  min="0"
                                  placeholder="0.00"
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
                              <FormLabel>Precio Unit. *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0.00"
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

                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`detalles.${index}.subtotal_detalle`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subtotal</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      readOnly
                                      className="bg-gray-50"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => eliminarDetalle(index)}
                              className="mt-8 h-10 w-10 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardContent>
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
              </Card>

              {/* Archivos Adjuntos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Archivos Adjuntos (Opcional)
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={agregarArchivo}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Agregar Archivo
                  </Button>
                </CardHeader>
                <CardContent>
                  {archivosAdjuntos.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ">
                      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        No hay archivos adjuntos
                      </p>
                      <p className="text-xs text-gray-500">
                        Puede agregar cotizaciones, facturas, guías, reportes de
                        servicio, etc.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {archivosAdjuntos.map((archivo, index) => (
                        <Card
                          key={index}
                          className="p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative"
                        >
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => eliminarArchivo(index)}
                            className="absolute top-2 right-2 h-7 w-7"
                          >
                            <X className="w-4 h-4" />
                          </Button>

                          <div className="space-y-3 mt-2">
                            <div>
                              <Label
                                htmlFor={`archivo-${index}`}
                                className="text-xs"
                              >
                                Archivo * (PDF, JPG, PNG - Máx 2MB)
                              </Label>
                              <Input
                                id={`archivo-${index}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleFileChange(index, file);
                                }}
                                className="mt-1"
                              />
                              {archivo.archivo && (
                                <p className="text-xs text-gray-600 mt-1 truncate">
                                  📄 {archivo.archivo.name} (
                                  {(archivo.archivo.size / 1024).toFixed(2)} KB)
                                </p>
                              )}
                            </div>

                            <div>
                              <Label
                                htmlFor={`tipo-${index}`}
                                className="text-xs"
                              >
                                Tipo de Archivo *
                              </Label>
                              <Select
                                value={archivo.tipo_archivo}
                                onValueChange={(value) =>
                                  handleTipoArchivoChange(index, value)
                                }
                              >
                                <SelectTrigger
                                  id={`tipo-${index}`}
                                  className="mt-1"
                                >
                                  <SelectValue placeholder="Seleccione el tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cotizacion">
                                    Cotización
                                  </SelectItem>
                                  <SelectItem value="factura">
                                    Factura
                                  </SelectItem>
                                  <SelectItem value="guia">Guía</SelectItem>
                                  <SelectItem value="reporte servicio">
                                    Reporte de Servicio
                                  </SelectItem>
                                  <SelectItem value="acta de contrato">
                                    Acta de Contrato
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label
                                htmlFor={`fecha-${index}`}
                                className="text-xs"
                              >
                                Fecha del Archivo
                              </Label>
                              <Input
                                id={`fecha-${index}`}
                                type="date"
                                value={archivo.fecha_archivo}
                                onChange={(e) =>
                                  handleFechaArchivoChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Totales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Resumen de Totales
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                  <FormField
                    control={form.control}
                    name="subtotal"
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
                    name="incluir_igv"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-2">
                        <FormLabel>IGV</FormLabel>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="incluir_igv"
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              calcularTotales();
                            }}
                          />
                          <Label htmlFor="incluir_igv">Incluir IGV (18%)</Label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="igv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor IGV</FormLabel>
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
                    name="adelanto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adelanto</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                              calcularTotales();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Final</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            readOnly
                            className="bg-blue-50 font-bold text-blue-700 border-blue-300"
                            {...field}
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
              {mode === "create" ? "Crear Orden" : "Actualizar Orden"}
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
