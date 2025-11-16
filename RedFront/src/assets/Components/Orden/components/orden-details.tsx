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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  MapPin,
  User,
  FileText,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
// Importamos solo lo necesario para este componente
import { CategoriasService } from "../services/ordenCompra-service";

interface OrdenDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  ordenId: number | null;
}

// Interfaz que coincide con la respuesta del backend
interface OrdenDetalleResponse {
  id_orden: number;
  numero_orden: string;
  fecha_emision: string;
  fecha_entrega: string | null;
  lugar_entrega: string | null;
  codigo: string; // código de obra
  nom_obra: string;
  estado: string;
  ruc: string;
  razon_social: string;
  contacto_telefono?: string;
  subtotal: number;
  igv: number;
  adelanto: number;
  total: number;
  codigo_contable: string;
  nombre_contable?: string;
  id_detalle: number;
  cantidad: number;
  precio_unitario: number;
  subtotal_detalle: number;
  tipo_orden: string; // nom_orden
  nombre_producto: string;
  codigo_producto: string;
  unidad_medida: string;
}

// Interfaz para los datos procesados
interface OrdenCompraDetalle {
  id_orden: number;
  numero_orden: string;
  fecha_emision: string;
  fecha_entrega: string | null;
  lugar_entrega: string | null;
  estado: string;
  subtotal: number;
  igv: number;
  adelanto: number;
  total: number;
  observaciones?: string;
  detalles: DetalleOrden[];
  proveedor: {
    ruc: string;
    razon_social: string;
    contacto_telefono?: string;
  };
  tipo_orden: {
    nom_orden: string;
  };
  codigo_contable: {
    codigo_contable: string;
    nombre_contable?: string;
  };
  obra: {
    codigo: string;
    nom_obra: string;
  };
}

interface DetalleOrden {
  id_detalle: number;
  cantidad: number;
  precio_unitario: number;
  subtotal_detalle: number;
  producto: {
    codigo: string;
    nombre: string;
    unidad_medida: string;
  };
}

const estadoColors = {
  servicio: "bg-blue-100 text-blue-800",
  reporte: "bg-yellow-100 text-yellow-800",
  factura: "bg-green-100 text-green-800",
};

export function OrdenDetails({ isOpen, onClose, ordenId }: OrdenDetailsProps) {
  const [orden, setOrden] = useState<OrdenCompraDetalle | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDetallesOrden = async () => {
      if (!ordenId || !isOpen) return;

      setLoading(true);
      try {
        const response = await CategoriasService.obtenerDetalles(ordenId);

        // Procesar la respuesta del backend
        if (
          response.success &&
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const rawData = response.data as OrdenDetalleResponse[];
          const firstRecord = rawData[0];

          // Convertir los datos planos en estructura anidada
          const ordenProcesada: OrdenCompraDetalle = {
            id_orden: firstRecord.id_orden,
            numero_orden: firstRecord.numero_orden,
            fecha_emision: firstRecord.fecha_emision,
            fecha_entrega: firstRecord.fecha_entrega,
            lugar_entrega: firstRecord.lugar_entrega,
            estado: firstRecord.estado,
            subtotal: firstRecord.subtotal,
            igv: firstRecord.igv,
            adelanto: firstRecord.adelanto,
            total: firstRecord.total,
            proveedor: {
              ruc: firstRecord.ruc,
              razon_social: firstRecord.razon_social,
              contacto_telefono: firstRecord.contacto_telefono,
            },
            tipo_orden: {
              nom_orden: firstRecord.tipo_orden,
            },
            codigo_contable: {
              codigo_contable: firstRecord.codigo_contable,
              nombre_contable: firstRecord.nombre_contable,
            },
            obra: {
              codigo: firstRecord.codigo,
              nom_obra: firstRecord.nom_obra,
            },
            detalles: rawData.map((item) => ({
              id_detalle: item.id_detalle,
              cantidad: item.cantidad,
              precio_unitario: item.precio_unitario,
              subtotal_detalle: item.subtotal_detalle,
              producto: {
                codigo: item.codigo_producto,
                nombre: item.nombre_producto,
                unidad_medida: item.unidad_medida,
              },
            })),
          };

          setOrden(ordenProcesada);
        }
      } catch (error) {
        console.error("Error cargando detalles de la orden:", error);
        toast.error("Error al cargar los detalles de la orden");
      } finally {
        setLoading(false);
      }
    };

    cargarDetallesOrden();
  }, [ordenId, isOpen]);

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return "No especificada";
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(monto);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalles de la Orden de Compra
          </DialogTitle>
          <DialogDescription>
            Información completa de la orden de compra y sus detalles.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Cargando detalles...</span>
            </div>
          ) : orden ? (
            <div className="space-y-6">
              {/* Información General */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      ID Orden
                    </label>
                    <p className="text-lg font-semibold">#{orden.id_orden}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Fecha de Emisión
                    </label>
                    <p>{formatearFecha(orden.fecha_emision)}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Fecha de Entrega
                    </label>
                    <p>{formatearFecha(orden.fecha_entrega)}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Lugar de Entrega
                    </label>
                    <p>{orden.lugar_entrega}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Estado
                    </label>
                    <Badge
                      className={`${
                        estadoColors[orden.estado as keyof typeof estadoColors]
                      } capitalize`}
                    >
                      {orden.estado}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Tipo de Orden
                    </label>
                    <p className="font-medium">{orden.tipo_orden.nom_orden}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Información del Proveedor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información del Proveedor
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Razón Social
                    </label>
                    <p className="font-medium">
                      {orden.proveedor.razon_social}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      RUC
                    </label>
                    <p>{orden.proveedor.ruc}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Teléfono de Contacto
                    </label>
                    <p>
                      {orden.proveedor.contacto_telefono || "No especificado"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Código Contable */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Código Contable
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Código Contable
                    </label>
                    <p className="font-mono font-medium">
                      {orden.codigo_contable.codigo_contable}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Nombre Contable
                    </label>
                    <p>
                      {orden.codigo_contable.nombre_contable ||
                        "No especificado"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Información de la Obra */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Información de la Obra
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Código de Obra
                    </label>
                    <p className="font-mono font-medium">{orden.obra.codigo}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Nombre de la Obra
                    </label>
                    <p>{orden.obra.nom_obra}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Detalles de Productos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Productos/Servicios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Producto/Servicio</TableHead>
                          <TableHead>Unidad</TableHead>
                          <TableHead className="text-right">Cantidad</TableHead>
                          <TableHead className="text-right">
                            Precio Unit.
                          </TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orden.detalles.map((detalle) => (
                          <TableRow key={detalle.id_detalle}>
                            <TableCell className="font-mono text-sm">
                              {detalle.producto.codigo}
                            </TableCell>
                            <TableCell className="font-medium">
                              {detalle.producto.nombre}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {detalle.producto.unidad_medida}
                            </TableCell>
                            <TableCell className="text-right">
                              {detalle.cantidad.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatearMoneda(detalle.precio_unitario)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatearMoneda(detalle.subtotal_detalle)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Resumen de Totales */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-lg font-medium">
                        {formatearMoneda(orden.subtotal)}
                      </span>
                    </div>

                    {orden.igv > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          IGV (18%):
                        </span>
                        <span className="text-lg font-medium">
                          {formatearMoneda(orden.igv)}
                        </span>
                      </div>
                    )}

                    {orden.adelanto > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Adelanto:</span>
                        <span className="text-lg font-medium text-red-600">
                          -{formatearMoneda(orden.adelanto)}
                        </span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatearMoneda(orden.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Observaciones */}
              {orden.observaciones && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {orden.observaciones}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                No se pudieron cargar los detalles de la orden.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
