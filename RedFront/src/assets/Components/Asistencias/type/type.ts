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

// ==================== INTERFACES DE ASISTENCIAS ====================

// Interfaz para asistencias
export interface AsistenciaItem {
  idasistencias_empleados: number;
  fecha_asistio: string;
  estado: "ASISTIO" | "FALTA" | "TARDANZA" | "JUSTIFICADO";
  observacion?: string | null;
  fk_idempleados: number;

  // Datos del empleado (desde joins)
  idempleados?: number;
  sueldo?: number;
  cuenta_bcp?: string | null;
  nombres?: string;
  primer_apell?: string;
  segundo_apell?: string;
  dni?: string;
  correo?: string;
  celular?: string;
  nom_genero?: string;
  nom_cargo_empleado?: string;
}

// Interfaz para registro individual
export interface CreateAsistenciaIndividual {
  fecha_asistio: string;
  estado: "ASISTIO" | "FALTA" | "TARDANZA" | "JUSTIFICADO";
  observacion?: string;
  fk_idempleados: number;
}

// Interfaz para registro masivo
export interface CreateAsistenciaMasiva {
  fecha_inicio: string;
  fecha_fin: string;
  estado: "ASISTIO" | "FALTA" | "TARDANZA" | "JUSTIFICADO";
  observacion?: string;
  empleados: number[];
}

// Interfaz para actualización individual
export interface UpdateAsistenciaIndividual {
  fecha_asistio?: string;
  estado: "ASISTIO" | "FALTA" | "TARDANZA" | "JUSTIFICADO";
  observacion?: string;
  fk_idempleados?: number;
}

// Interfaz para actualización masiva
export interface UpdateAsistenciaMasiva {
  fecha_inicio: string;
  fecha_fin: string;
  estado: "ASISTIO" | "FALTA" | "TARDANZA" | "JUSTIFICADO";
  observacion?: string;
  empleados?: number[];
}
