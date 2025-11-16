"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Package, Tag, Info } from "lucide-react";
import toast from "react-hot-toast";
import { ProductosService } from "../services/productos-service";
import type { ProductoItem } from "../type/type";

interface ProductoDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  producto: ProductoItem | null;
}

export function ProductoDetails({
  isOpen,
  onClose,
  producto,
}: ProductoDetailsProps) {
  const [productoDetalle, setProductoDetalle] = useState<ProductoItem | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDetallesProducto = async () => {
      if (!producto?.id_producto || !isOpen) return;

      setLoading(true);
      try {
        const response = await ProductosService.obtenerPorId(
          producto.id_producto
        );

        if (response.data) {
          setProductoDetalle(response.data);
        }
      } catch (error) {
        console.error("Error cargando detalles del producto:", error);
        toast.error("Error al cargar los detalles del producto");
      } finally {
        setLoading(false);
      }
    };

    // Si ya tenemos el producto completo, usarlo directamente
    if (producto && isOpen) {
      setProductoDetalle(producto);
      // Opcional: cargar datos actualizados del servidor
      if (producto.id_producto) {
        cargarDetallesProducto();
      }
    }
  }, [producto, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-4xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Detalles del Producto
          </DialogTitle>
          <DialogDescription>
            Información completa del producto o material.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Cargando detalles...</span>
            </div>
          ) : productoDetalle ? (
            <div className="space-y-6">
              {/* Información Principal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Información Principal
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Código
                    </label>
                    <p className="text-lg font-mono font-semibold">
                      {productoDetalle.codigo}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Nombre del Producto
                    </label>
                    <p className="text-lg font-semibold">
                      {productoDetalle.producto}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Unidad de Medida
                    </label>
                    <p className="font-medium">
                      {productoDetalle.unidad_medida}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Categoría
                    </label>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {productoDetalle.categoria}
                    </Badge>
                  </div>

                  {productoDetalle.descripcion && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Descripción
                      </label>
                      <p className="text-muted-foreground leading-relaxed">
                        {productoDetalle.descripcion}
                      </p>
                    </div>
                  )}

                  {!productoDetalle.descripcion && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Descripción
                      </label>
                      <p className="text-sm text-muted-foreground italic">
                        Sin descripción
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                No se pudieron cargar los detalles del producto.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
