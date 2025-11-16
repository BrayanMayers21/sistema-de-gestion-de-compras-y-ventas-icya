"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Calendar,
  User,
  FileText,
  Package,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";
import type { CotizacionAntamina } from "../type/cotizacion-type";
import { CotizacionAntaminaService } from "../services/cotizacion-service";

interface CotizacionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  cotizacionId: number | null;
}

export function CotizacionDetails({
  isOpen,
  onClose,
  cotizacionId,
}: CotizacionDetailsProps) {
  const [cotizacion, setCotizacion] = useState<CotizacionAntamina | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCotizacion = async () => {
      if (!cotizacionId) return;

      setLoading(true);
      try {
        const response = await CotizacionAntaminaService.mostrar(cotizacionId);
        if (response.success && response.data) {
          setCotizacion(response.data);
        } else {
          toast.error("Error al cargar los detalles de la cotización");
          onClose();
        }
      } catch (error) {
        console.error("Error cargando cotización:", error);
        toast.error("Error al cargar los detalles de la cotización");
        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && cotizacionId) {
      cargarCotizacion();
    }
  }, [isOpen, cotizacionId, onClose]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(valor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-5xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Detalles de Cotización Antamina</DialogTitle>
          <DialogDescription>
            Información completa de la cotización y sus detalles
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Cargando cotización...</span>
            </div>
          ) : cotizacion ? (
            <div className="space-y-6 p-1">
              {/* Información General */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">Número de Cotización:</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      {cotizacion.numero_cot}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Fecha de Cotización:</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatearFecha(cotizacion.fecha_cot)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Cliente:</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {cotizacion.cliente}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">Costo Total:</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatearMoneda(cotizacion.costo_total)}
                    </p>
                  </div>

                  {cotizacion.descripcion && (
                    <div className="space-y-2 col-span-full">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">Descripción:</span>
                      </div>
                      <p className="text-base text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {cotizacion.descripcion}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Separator />

              {/* Detalles de Productos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Detalles de Productos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cotizacion.detalles && cotizacion.detalles.length > 0 ? (
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">#</TableHead>
                            <TableHead className="font-semibold">
                              Producto
                            </TableHead>
                            <TableHead className="font-semibold">
                              Marca
                            </TableHead>
                            <TableHead className="font-semibold text-center">
                              Cantidad
                            </TableHead>
                            <TableHead className="font-semibold text-right">
                              Precio Unitario
                            </TableHead>
                            <TableHead className="font-semibold text-right">
                              Subtotal
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cotizacion.detalles.map((detalle, index) => (
                            <TableRow
                              key={detalle.iddetalle_cotizacion_antamina}
                            >
                              <TableCell className="font-medium">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="font-semibold">
                                    {detalle.producto?.codigo || "N/A"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {detalle.producto?.nombre || "N/A"}
                                  </p>
                                  {detalle.producto?.descripcion && (
                                    <p className="text-xs text-gray-500">
                                      {detalle.producto.descripcion}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {detalle.marca ? (
                                  <Badge variant="outline">
                                    {detalle.marca}
                                  </Badge>
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    Sin marca
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-center font-semibold">
                                {detalle.cantidad}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatearMoneda(detalle.precio_unitario)}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-blue-600">
                                {formatearMoneda(detalle.sub_total)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No hay detalles disponibles
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Resumen Total */}
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Total de Items:</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {cotizacion.detalles?.length || 0} productos
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm text-gray-600">Costo Total:</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatearMoneda(cotizacion.costo_total)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No se pudo cargar la información de la cotización
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
