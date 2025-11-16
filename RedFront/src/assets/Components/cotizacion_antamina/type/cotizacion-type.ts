// Interfaces para Cotización Antamina
export interface DetalleCotizacionAntamina {
  iddetalle_cotizacion_antamina?: number;
  cantidad: number;
  precio_unitario: number;
  sub_total: number;
  marca?: string;
  fk_id_producto: number;
  producto?: {
    id_producto: number;
    codigo: string;
    nombre: string;
    descripcion?: string;
  };
}

export interface CotizacionAntamina {
  idcotizaciones_antamina: number;
  fecha_cot: string; // ISO date string
  numero_cot: string;
  cliente: string;
  descripcion?: string | null;
  costo_total: number;
  detalles?: DetalleCotizacionAntamina[];
}

// Interfaces para los datos del formulario
export interface DetalleCotizacionData {
  iddetalle_cotizacion_antamina?: number;
  cantidad: number;
  precio_unitario: number;
  sub_total: number;
  marca?: string;
  fk_id_producto: number;
}

export interface CreateCotizacionData {
  cliente: string;
  descripcion?: string;
  detalles: DetalleCotizacionData[];
}

export interface UpdateCotizacionData extends CreateCotizacionData {
  fecha_cot: string;
  numero_cot: string;
}

// Interfaces para las opciones de los selects
export interface ProductoOption {
  id_producto: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
}

// Respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
