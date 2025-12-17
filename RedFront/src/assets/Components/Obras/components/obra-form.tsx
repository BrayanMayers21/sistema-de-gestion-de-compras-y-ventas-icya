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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Building2, Hash, FileText } from "lucide-react";
import toast from "react-hot-toast";
import type { CreateObraData, UpdateObraData, ObraItem } from "../type/type";

// Schema de validación para crear obra
const createObraSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es obligatorio")
    .max(45, "Máximo 45 caracteres"),
  nom_obra: z
    .string()
    .min(1, "El nombre de la obra es obligatorio")
    .max(255, "Máximo 255 caracteres"),
});

// Schema de validación para editar obra
const updateObraSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es obligatorio")
    .max(45, "Máximo 45 caracteres"),
  nom_obra: z
    .string()
    .min(1, "El nombre de la obra es obligatorio")
    .max(255, "Máximo 255 caracteres"),
});

type CreateObraFormData = z.infer<typeof createObraSchema>;
type UpdateObraFormData = z.infer<typeof updateObraSchema>;

interface ObraFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateObraData | UpdateObraData) => Promise<boolean>;
  mode: "create" | "edit";
  obra?: ObraItem | null;
}

export function ObraForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
  obra,
}: ObraFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usar el schema apropiado según el modo
  const schema = mode === "create" ? createObraSchema : updateObraSchema;

  const form = useForm<CreateObraFormData | UpdateObraFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      codigo: "",
      nom_obra: "",
    },
  });

  // Cargar datos de la obra en modo edición
  useEffect(() => {
    if (isOpen && mode === "edit" && obra) {
      form.reset({
        codigo: obra.codigo,
        nom_obra: obra.nom_obra,
      });
    } else if (isOpen && mode === "create") {
      form.reset({
        codigo: "",
        nom_obra: "",
      });
    }
  }, [isOpen, mode, obra, form]);

  const handleSubmit = async (
    data: CreateObraFormData | UpdateObraFormData
  ) => {
    setIsSubmitting(true);
    try {
      console.log("Enviando formulario de obra...", data);

      // Si estamos editando, agregar el idobras
      const submitData =
        mode === "edit" && obra ? { ...data, idobras: obra.idobras } : data;

      const success = await onSubmit(
        submitData as CreateObraData | UpdateObraData
      );
      console.log("Resultado del envío:", success);

      if (success) {
        console.log("Obra procesada exitosamente, reseteando formulario...");
        form.reset();
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al procesar la obra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-2xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {mode === "create" ? "Nueva Obra" : "Editar Obra"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Complete todos los campos para crear una nueva obra."
              : "Modifique los campos necesarios para actualizar la obra."}
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Información de la Obra
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Campo Código */}
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Código
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: OBR-001"
                            {...field}
                            disabled={isSubmitting}
                            className="font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Nombre de Obra */}
                  <FormField
                    control={form.control}
                    name="nom_obra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Nombre de la Obra
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: Construcción Edificio Central"
                            {...field}
                            disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === "create" ? "Crear Obra" : "Actualizar Obra"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
