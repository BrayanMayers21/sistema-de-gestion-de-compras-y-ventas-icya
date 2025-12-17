// Interfaz para obras
export interface ObraItem {
  idobras: number; // ID interno para operaciones CRUD
  codigo: string;
  nom_obra: string;
}

// Interfaz para crear obra
export interface CreateObraData {
  nom_obra: string;
  codigo: string;
}

// Interfaz para actualizar obra
export interface UpdateObraData {
  idobras: number;
  nom_obra: string;
  codigo: string;
}
