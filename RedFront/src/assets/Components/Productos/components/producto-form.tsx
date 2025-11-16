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
import { Loader2, Package } from "lucide-react";
import toast from "react-hot-toast";
import { ProductosService } from "../services/productos-service";
import type {
  CreateProductoData,
  UpdateProductoData,
  CategoriaOption,
  ProductoItem,
} from "../type/type";

// Schema de validación para crear producto
const createProductoSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es obligatorio")
    .max(50, "Máximo 50 caracteres"),
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
});

// Schema de validación para editar producto (sin código)
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

  // Usar el schema apropiado según el modo
  const schema =
    mode === "create" ? createProductoSchema : updateProductoSchema;

  const form = useForm<CreateProductoFormData | UpdateProductoFormData>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "create"
        ? {
            codigo: "",
            nombre: "",
            descripcion: "",
            unidad_medida: "",
            fk_id_categoria: 0,
          }
        : {
            nombre: "",
            descripcion: "",
            unidad_medida: "",
            fk_id_categoria: 0,
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
        console.error("Error cargando categorías:", error);
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
      });
    } else if (isOpen && mode === "create") {
      form.reset({
        codigo: "",
        nombre: "",
        descripcion: "",
        unidad_medida: "",
        fk_id_categoria: 0,
      });
    }
  }, [isOpen, mode, producto, form]);

  const handleSubmit = async (
    data: CreateProductoFormData | UpdateProductoFormData
  ) => {
    setIsSubmitting(true);
    try {
      console.log("Enviando formulario de producto...", data);
      const success = await onSubmit(data);
      console.log("Resultado del envío:", success);

      if (success) {
        console.log(
          "Producto procesado exitosamente, reseteando formulario..."
        );
        form.reset();
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
                  {/* Código - Solo en modo crear */}
                  {mode === "create" && (
                    <FormField
                      control={form.control}
                      name="codigo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: PROD-001"
                              {...field}
                              disabled={isSubmitting || loadingOptions}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

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
                        El código no puede ser modificado
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
