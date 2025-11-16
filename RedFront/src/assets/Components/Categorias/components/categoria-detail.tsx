"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Calendar,
  FileText,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type { Categoria } from "../type/type";

interface CategoriaDetailProps {
  isOpen: boolean;
  onClose: () => void;
  categoriaId: number | null;
}

export function CategoriaDetail({
  isOpen,
  onClose,
  categoriaId,
}: CategoriaDetailProps) {
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && categoriaId) {
      fetchCategoria(categoriaId);
    }
  }, [isOpen, categoriaId]);

  const fetchCategoria = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Token de autenticación no encontrado");
      }

      const response = await axios.get(
        `${Constantes.baseUrlBackend}/api/categorias-mostrar/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setCategoria(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching categoria:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Error al cargar los detalles de la categoría"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCategoria(null);
    setError(null);
    onClose();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalles de la Categoría</DialogTitle>
          <DialogDescription>
            Información completa de la categoría seleccionada.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Cargando detalles...</span>
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {categoria && !loading && !error && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>#{categoria.id_categoria}</span>
                  <Badge variant={categoria.estado ? "default" : "secondary"}>
                    {categoria.estado ? (
                      <>
                        <ToggleRight className="h-4 w-4 mr-1" />
                        Activo
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4 mr-1" />
                        Inactivo
                      </>
                    )}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {categoria.nombre}
                  </h3>
                  {categoria.descripcion && (
                    <p className="text-muted-foreground">
                      {categoria.descripcion}
                    </p>
                  )}
                  {!categoria.descripcion && (
                    <p className="text-muted-foreground italic">
                      Sin descripción
                    </p>
                  )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Registrado el {formatDate(categoria.fecha_registro)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
