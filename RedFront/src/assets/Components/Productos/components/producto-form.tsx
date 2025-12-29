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
import { Loader2, Package, ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import { ProductosService } from "../services/productos-service";
import type {
  CreateProductoData,
  UpdateProductoData,
  CategoriaOption,
  ProductoItem,
} from "../type/type";
import Constantes from "@/assets/constants/constantes";
import axios from "axios";
import Cookies from "js-cookie";

// Schema de validación para crear producto (sin código, se genera automáticamente)
const createProductoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(255, "Máximo 255 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional(),
  unidad_medida: z
    .string()
    .min(1, "La unidad de medida es obligatoria")
    .max(100, "Máximo 100 caracteres"),
  fk_id_categoria: z.number().min(1, "Debe seleccionar una categoría"),
  imagen: z.any().optional(), // Archivo de imagen
});

// Schema de validación para editar producto
const updateProductoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(255, "Máximo 255 caracteres"),
  descripcion: z.string().max(500, "Máximo 500 caracteres").optional(),
  unidad_medida: z
    .string()
    .min(1, "La unidad de medida es obligatoria")
    .max(100, "Máximo 100 caracteres"),
  fk_id_categoria: z.number().min(1, "Debe seleccionar una categoría"),
  imagen: z.any().optional(), // Archivo de imagen
});

type CreateProductoFormData = z.infer<typeof createProductoSchema>;
type UpdateProductoFormData = z.infer<typeof updateProductoSchema>;

interface ProductoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductoData | UpdateProductoData) => Promise<boolean>;
  mode: "create" | "edit";
  producto?: ProductoItem | null;
}

export function ProductoForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
  producto,
}: ProductoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagenError, setImagenError] = useState(false);

  // Usar el schema apropiado según el modo
  const schema =
    mode === "create" ? createProductoSchema : updateProductoSchema;

  const form = useForm<CreateProductoFormData | UpdateProductoFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      unidad_medida: "",
      fk_id_categoria: 0,
      imagen: undefined,
    },
  });

  // Cargar categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      setLoadingOptions(true);
      try {
        const categoriasRes = await ProductosService.obtenerCategorias();
        setCategorias(categoriasRes.data || []);
      } catch (error) {
        toast.error("Error al cargar las categorías");
      } finally {
        setLoadingOptions(false);
      }
    };

    if (isOpen) {
      cargarCategorias();
    }
  }, [isOpen]);

  // Cargar datos del producto en modo edición
  useEffect(() => {
    if (isOpen && mode === "edit" && producto) {
      form.reset({
        nombre: producto.producto,
        descripcion: producto.descripcion || "",
        unidad_medida: producto.unidad_medida,
        fk_id_categoria: producto.fk_id_categoria || 0,
        imagen: producto.ruta_imagen,
      });
      // Cargar imagen existente si hay
      if (producto.ruta_imagen) {
        const token = Cookies.get("token");
        // Usar axios para obtener la imagen con autenticación
        axios
          .get(
            `${Constantes.baseUrlBackend}/api/productos/imagen/${producto.id_producto}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob", // Importante: recibir la respuesta como blob
            }
          )
          .then((response) => {
            // Crear URL temporal para el blob
            const urlImagen = URL.createObjectURL(response.data);
            setImagenPreview(urlImagen);
            setImagenError(false);
          })
          .catch((error) => {
            console.error("Error al cargar la imagen:", error);
            setImagenPreview(null);
            setImagenError(true);
          });
      } else {
        setImagenPreview(null);
        setImagenError(false);
      }
      setArchivoImagen(null);
    } else if (isOpen && mode === "create") {
      form.reset({
        nombre: "",
        descripcion: "",
        unidad_medida: "",
        fk_id_categoria: 0,
        imagen: undefined,
      });
      setImagenPreview(null);
      setArchivoImagen(null);
      setImagenError(false);
    }
  }, [isOpen, mode, producto, form]);

  // Función para procesar el archivo de imagen
  const procesarImagen = (file: File, field: any) => {
    // Validar tipo de archivo
    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!tiposPermitidos.includes(file.type)) {
      toast.error("Formato no válido. Use: JPEG, PNG, JPG, GIF o WEBP");
      return;
    }

    // Validar tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen no debe pesar más de 2MB");
      return;
    }

    setArchivoImagen(file);
    field.onChange(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Manejadores de eventos drag and drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, field: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      procesarImagen(file, field);
    }
  };

  const handleSubmit = async (
    data: CreateProductoFormData | UpdateProductoFormData
  ) => {
    setIsSubmitting(true);
    try {
      // Crear FormData para enviar archivo
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion || "");
      formData.append("unidad_medida", data.unidad_medida);
      formData.append("fk_id_categoria", data.fk_id_categoria.toString());

      // Agregar imagen si existe
      if (archivoImagen) {
        formData.append("imagen", archivoImagen);
      }

      const success = await onSubmit(formData as any);

      if (success) {
        form.reset();
        setImagenPreview(null);
        setArchivoImagen(null);
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      toast.error("Error al procesar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-3xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {mode === "create" ? "Nuevo Producto" : "Editar Producto"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Complete todos los campos para crear un nuevo producto."
              : "Modifique los campos necesarios para actualizar el producto."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 p-1"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información del Producto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Código en modo edición - Solo lectura */}
                  {mode === "edit" && producto && (
                    <div className="space-y-2">
                      <FormLabel>Código</FormLabel>
                      <Input
                        value={producto.codigo}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        El código se generó automáticamente y no puede ser
                        modificado
                      </p>
                    </div>
                  )}

                  {/* Nombre */}
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Producto *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Cemento Portland Tipo I"
                            {...field}
                            disabled={isSubmitting || loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Descripción */}
                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción detallada del producto (opcional)"
                            className="resize-none"
                            rows={3}
                            {...field}
                            disabled={isSubmitting || loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Unidad de Medida */}
                  <FormField
                    control={form.control}
                    name="unidad_medida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidad de Medida *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Bolsa, Kg, Unidad, Metro"
                            {...field}
                            disabled={isSubmitting || loadingOptions}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Imagen del Producto */}
                  <FormField
                    control={form.control}
                    name="imagen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagen del Producto</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {/* Zona de arrastrar y soltar */}
                            <div
                              onDragEnter={handleDragEnter}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, field)}
                              className={`relative border-2 border-dashed rounded-lg transition-all ${
                                isDragging
                                  ? "border-primary bg-primary/10 scale-[1.02]"
                                  : "border-muted-foreground/25 hover:border-primary/50"
                              } ${
                                isSubmitting || loadingOptions
                                  ? "opacity-50 cursor-not-allowed"
                                  : "cursor-pointer"
                              }`}
                            >
                              {imagenPreview ? (
                                // Preview de imagen
                                <div className="relative w-full p-4">
                                  <div className="relative w-full max-w-md mx-auto">
                                    {imagenError ? (
                                      <div className="w-full h-64 flex flex-col items-center justify-center bg-muted rounded-lg border border-destructive">
                                        <X className="w-16 h-16 text-destructive mb-2" />
                                        <p className="text-destructive font-medium">
                                          Error al cargar imagen
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          La imagen no existe o no se puede
                                          acceder
                                        </p>
                                      </div>
                                    ) : (
                                      <img
                                        src={imagenPreview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-lg border"
                                        onError={() => {
                                          console.error(
                                            "Error cargando imagen:",
                                            imagenPreview
                                          );
                                          setImagenError(true);
                                          toast.error(
                                            "No se pudo cargar la imagen del producto"
                                          );
                                        }}
                                        onLoad={() => {
                                          console.log(
                                            "Imagen cargada correctamente:",
                                            imagenPreview
                                          );
                                        }}
                                      />
                                    )}
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-2 right-2 shadow-lg"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setImagenPreview(null);
                                        setArchivoImagen(null);
                                        setImagenError(false);
                                        field.onChange(undefined);
                                      }}
                                      disabled={isSubmitting}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <p className="text-center text-sm text-muted-foreground mt-3">
                                    Arrastra otra imagen o haz clic para cambiar
                                  </p>
                                </div>
                              ) : (
                                // Zona vacía para arrastrar
                                <div className="flex flex-col items-center justify-center p-8 py-12">
                                  <ImagePlus
                                    className={`w-16 h-16 mb-4 transition-all ${
                                      isDragging
                                        ? "text-primary scale-110"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                  <p
                                    className={`text-base font-medium mb-2 transition-colors ${
                                      isDragging
                                        ? "text-primary"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {isDragging
                                      ? "¡Suelta la imagen aquí!"
                                      : "Arrastra y suelta una imagen"}
                                  </p>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    o haz clic para seleccionar
                                  </p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isSubmitting || loadingOptions}
                                    onClick={() =>
                                      document
                                        .getElementById("imagen-input")
                                        ?.click()
                                    }
                                  >
                                    Seleccionar archivo
                                  </Button>
                                </div>
                              )}

                              {/* Input oculto para selección manual */}
                              <Input
                                id="imagen-input"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    procesarImagen(file, field);
                                  }
                                }}
                                disabled={isSubmitting || loadingOptions}
                              />
                            </div>

                            <p className="text-xs text-muted-foreground text-center">
                              Formatos: JPEG, PNG, JPG, GIF, WEBP • Máximo: 2MB
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Categoría con búsqueda */}
                  <FormField
                    control={form.control}
                    name="fk_id_categoria"
                    render={({ field }) => {
                      const [searchCategoria, setSearchCategoria] =
                        useState("");

                      const categoriasFiltradas = categorias.filter(
                        (categoria) => {
                          const nombre = categoria.nombre || "";
                          const descripcion = categoria.descripcion || "";
                          const searchTerm = searchCategoria.toLowerCase();

                          return (
                            nombre.toLowerCase().includes(searchTerm) ||
                            descripcion.toLowerCase().includes(searchTerm)
                          );
                        }
                      );

                      return (
                        <FormItem>
                          <FormLabel>Categoría *</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field.value?.toString() || "0"}
                            disabled={isSubmitting || loadingOptions}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una categoría">
                                  {field.value
                                    ? categorias.find(
                                        (c) => c.id_categoria === field.value
                                      )?.nombre
                                    : "Seleccione una categoría"}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <div className="p-2">
                                <Input
                                  placeholder="Buscar categoría..."
                                  value={searchCategoria}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setSearchCategoria(e.target.value);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => e.stopPropagation()}
                                  className="mb-2"
                                />
                              </div>
                              {loadingOptions ? (
                                <div className="flex items-center justify-center py-4">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span className="ml-2 text-sm">
                                    Cargando...
                                  </span>
                                </div>
                              ) : categoriasFiltradas.length === 0 ? (
                                <div className="py-4 text-center text-sm text-muted-foreground">
                                  No se encontraron categorías
                                </div>
                              ) : (
                                categoriasFiltradas.map((categoria) => (
                                  <SelectItem
                                    key={categoria.id_categoria}
                                    value={categoria.id_categoria.toString()}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {categoria.nombre}
                                      </span>
                                      {categoria.descripcion && (
                                        <span className="text-xs text-muted-foreground">
                                          {categoria.descripcion}
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
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
            {mode === "create" ? "Crear Producto" : "Actualizar Producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
