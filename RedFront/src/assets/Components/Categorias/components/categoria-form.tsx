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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import type { Categoria, CreateCategoriaData } from "../type/type";

const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(255, "Máximo 255 caracteres"),
  descripcion: z.string().max(255, "Máximo 255 caracteres").optional(),
  estado: z.boolean(),
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

interface CategoriaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoriaData) => Promise<boolean>;
  categoria?: Categoria | null;
  mode: "create" | "edit";
}

export function CategoriaForm({
  isOpen,
  onClose,
  onSubmit,
  categoria,
  mode,
}: CategoriaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      estado: true,
    },
  });

  // Reset form when modal opens/closes or categoria changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && categoria) {
        form.reset({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          estado: categoria.estado,
        });
      } else {
        form.reset({
          nombre: "",
          descripcion: "",
          estado: true,
        });
      }
    }
  }, [isOpen, categoria, mode, form]);

  const handleSubmit = async (data: CategoriaFormData) => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit(data);
      if (success) {
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nueva Categoría" : "Editar Categoría"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los campos para crear una nueva categoría."
              : "Modifica los campos para actualizar la categoría."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese el nombre de la categoría"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese una descripción opcional"
                      className="resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Descripción opcional de la categoría (máximo 255 caracteres)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado</FormLabel>
                    <FormDescription>
                      {field.value
                        ? "La categoría está activa"
                        : "La categoría está inactiva"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mode === "create" ? "Crear" : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
