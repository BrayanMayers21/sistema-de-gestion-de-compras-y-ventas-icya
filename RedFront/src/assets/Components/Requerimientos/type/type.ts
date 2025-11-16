// Interfaz para los items de requerimiento (datos que vienen del backend)
export interface RequerimientoItem {
  id: number;
  producto: string;
  unidad_medida: string;
  descripcion_producto: string;
  cantidad: number;
  observaciones: string | null;
  proveedor: string;
}

// Interfaz para los detalles del requerimiento
export interface DetalleRequerimiento {
  fk_id_producto: number;
  cantidad: number;
  observaciones?: string;
}

// Interfaz para crear requerimientos (estructura que espera el controlador)
export interface CreateRequerimientoData {
  fk_id_proveedor: number;
  observaciones?: string;
  detalles: DetalleRequerimiento[];
}

// Mantener OrdenCompraItem para compatibilidad (deprecado)

export interface UpdateRequerimientoData extends CreateRequerimientoData {
  idrequerimientos: number;
}

// Interfaces para las opciones de los selects (requerimientos)
export interface ProveedorOption {
  id_proveedor: number;
  ruc: string;
  razon_social: string;
  contacto_telefono?: string;
}

export interface ProductoOption {
  id_producto: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
}
