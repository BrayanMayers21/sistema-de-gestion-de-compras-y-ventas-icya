// Interfaz para Obra
export interface ObraOption {
  idobras: number;
  nom_obra: string;
  codigo: string;
}

// Interfaz para Producto
export interface ProductoOption {
  id_producto: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidad_medida: string;
}

// Interfaz para los detalles del requerimiento de obra
export interface DetalleRequerimientoObra {
  id_detalle?: number;
  fk_id_producto: number;
  cantidad: number;
  marca?: string;
  color?: string;
  tipo?: string;
  calidad?: string;
  medida?: string;
  observaciones?: string;
  estado?: "pendiente" | "entregado" | "cancelado";
  cantidad_entregada?: number;
  fecha_entrega?: string;
  // Para mostrar en la UI
  producto?: ProductoOption;
}

// Interfaz para el requerimiento de obra completo
export interface RequerimientoObra {
  id_requerimiento_obra: number;
  fk_idobras: number;
  numero_requerimiento: string;
  fecha_requerimiento: string;
  fecha_atencion?: string;
  lugar_entrega?: string;
  residente_obra: string;
  justificacion?: string;
  estado: "pendiente" | "aprobado" | "en_proceso" | "atendido" | "cancelado";
  created_at?: string;
  updated_at?: string;
  // Relaciones
  obra?: ObraOption;
  detalles?: DetalleRequerimientoObra[];
}

// Interfaz para crear requerimiento de obra
export interface CreateRequerimientoObraData {
  fk_idobras: number;
  numero_requerimiento: string;
  fecha_requerimiento: string;
  fecha_atencion?: string;
  lugar_entrega?: string;
  residente_obra: string;
  justificacion?: string;
  detalles: Omit<DetalleRequerimientoObra, "id_detalle" | "producto">[];
}

// Interfaz para actualizar requerimiento de obra
export interface UpdateRequerimientoObraData
  extends CreateRequerimientoObraData {
  id_requerimiento_obra: number;
  estado?: "pendiente" | "aprobado" | "en_proceso" | "atendido" | "cancelado";
}
