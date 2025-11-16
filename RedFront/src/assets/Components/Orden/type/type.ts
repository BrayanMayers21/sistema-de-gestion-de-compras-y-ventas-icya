export interface DocumentosInfo {
  requeridos: string[];
  presentes: string[];
  faltantes: string[];
  porcentaje: number;
  completo: boolean;
}

export interface OrdenCompraItem {
  id_orden: number;
  numero_orden: string;
  fecha_emision: string; // ISO date string
  fecha_entrega: string | null;
  lugar_entrega: string | null;
  codigo: string; // código de la obra
  nom_obra: string;
  estado: string;
  ruc: string;
  razon_social: string;
  contacto_telefono: string | null;
  subtotal: number;
  igv: number;
  adelanto: number;
  total: number;
  tipo_orden?: string; // COMPRA o SERVICIO
  documentos_info?: DocumentosInfo;
}

// Interfaces para los datos del formulario
export interface OrdenDetalleData {
  id_detalle?: number;
  cantidad: number;
  precio_unitario: number;
  subtotal_detalle: number;
  fk_id_producto: number;
}

export interface CreateOrdenCompraData {
  // Datos de la orden
  fecha_emision: string;
  fecha_entrega: string;
  lugar_entrega: string;
  estado: "servicio" | "reporte" | "factura";
  subtotal: number;
  igv: number;
  adelanto: number;
  total: number;
  incluir_igv: boolean;
  observaciones?: string;
  fk_idcodigos_contables: number;
  fk_idtipo_orden: number;
  fk_id_proveedor: number;
  // Array de detalles
  detalles: OrdenDetalleData[];
}

// Interfaces para las opciones de los selects
export interface ProveedorOption {
  id_proveedor: number;
  ruc: string;
  razon_social: string;
  contacto_telefono?: string;
}

export interface TipoOrdenOption {
  idtipo_orden: number;
  nom_orden: string;
}

export interface ProductoOption {
  id_producto: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
}

export interface CodigoContableOption {
  idcodigos_contables: number;
  codigo: string; // Cambiado de codigo_contable a codigo
  nom_obra: string; // Cambiado de nombre_contable a nom_obra
}

export interface UpdateOrdenCompraData extends CreateOrdenCompraData {
  id_orden: number;
}
