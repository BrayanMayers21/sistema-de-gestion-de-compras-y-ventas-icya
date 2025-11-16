export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fecha_registro: string;
}

export interface CreateCategoriaData {
  nombre: string;
  descripcion?: string;
  estado: boolean;
}

export interface UpdateCategoriaData extends CreateCategoriaData {
  id_categoria: number;
}
