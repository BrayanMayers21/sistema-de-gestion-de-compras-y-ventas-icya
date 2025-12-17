// Interfaz para empleados
export interface EmpleadoItem {
  idempleados: number; // ID del empleado (principal)
  fecha_registro_empleado: string;
  sueldo: number;
  cuenta_bcp: string | null;
  nombres: string;
  primer_apell: string;
  segundo_apell: string;
  nom_genero: string;
  nom_cargo_empleado: string;

  // Campos adicionales para detalles/edición
  idpersonas?: number;
  dni?: string;
  fecha_nacimiento?: string;
  correo?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  fotografia?: string | null;
  idgeneros?: number;
  fk_idgeneros?: number;
  idcargos_empleados?: number;
  fk_idcargos_empleados?: number;
}

// Interfaz para crear empleado
export interface CreateEmpleadoData {
  // Datos de persona
  dni: string;
  fecha_nacimiento: string;
  primer_apell: string;
  segundo_apell: string;
  nombres: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  fotografia?: string;
  fk_idgeneros: number;

  // Datos de empleado
  sueldo: number;
  cuenta_bcp?: string;
  fk_idcargos_empleados: number;
}

// Interfaz para actualizar empleado
export interface UpdateEmpleadoData {
  // Datos de persona
  dni: string;
  fecha_nacimiento: string;
  primer_apell: string;
  segundo_apell: string;
  nombres: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  fotografia?: string;
  fk_idgeneros: number;

  // Datos de empleado
  sueldo: number;
  cuenta_bcp?: string;
  fk_idcargos_empleados: number;
}

// Interfaz para géneros
export interface GeneroOption {
  idgeneros: number;
  nom_genero: string;
}

// Interfaz para cargos
export interface CargoOption {
  idcargos_empleados: number;
  nom_cargo_empleado: string;
}
