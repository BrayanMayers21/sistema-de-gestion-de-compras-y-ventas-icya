// Interfaz para productos/materiales
export interface ProductoItem {
  id_producto?: number; // ID interno para operaciones CRUD
  codigo: string;
  producto: string;
  descripcion: string | null;
  unidad_medida: string;
  ruta_imagen?: string | null;
  categoria: string;
  fk_id_categoria?: number; // ID de categoría para edición
}

// Interfaz para crear/editar producto
export interface CreateProductoData {
  nombre: string;
  descripcion?: string;
  unidad_medida: string;
  ruta_imagen?: string;
  fk_id_categoria: number;
}

// Interfaz para actualizar producto (sin código ya que es único)
export interface UpdateProductoData extends CreateProductoData{
}

// Interfaz para categorías
export interface CategoriaOption {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
}

// Las siguientes interfaces son para órdenes de compra (mantenerlas separadas)
