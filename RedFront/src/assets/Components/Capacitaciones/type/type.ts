// Interfaz para asistente de capacitación
export interface CapacitacionAsistente {
  id_asistente?: number;
  fk_idempleados: number;
  nombre_completo?: string;
  dni?: string;
  area?: string;
  asistio?: boolean;
  observaciones_asistente?: string;
  cargo?: string;
}

// Interfaz para capacitación
export interface Capacitacion {
  id_capacitacion: number;
  codigo: string;
  razon_social?: string;
  ruc?: string;
  domicilio?: string;
  actividad_economica?: string;
  num_trabajadores?: number;
  tipo_actividad:
    | "induccion"
    | "capacitacion"
    | "entrenamiento"
    | "charla"
    | "simulacro"
    | "otros";
  fecha_capacitacion: string;
  tema_capacitacion: string;
  capacitador: string;
  num_horas?: number;
  lugar_capacitacion?: string;
  fk_idempleados: number;
  observaciones?: string;
  total_asistentes?: number;
  asistentes?: CapacitacionAsistente[];
  created_at?: string;
  updated_at?: string;
}

// Interfaz para crear capacitación
export interface CreateCapacitacionData {
  codigo: string;
  razon_social?: string;
  ruc?: string;
  domicilio?: string;
  actividad_economica?: string;
  num_trabajadores?: number;
  tipo_actividad: string;
  fecha_capacitacion: string;
  tema_capacitacion: string;
  capacitador: string;
  num_horas?: number;
  lugar_capacitacion?: string;
  fk_idempleados: number;
  observaciones?: string;
  asistentes: CapacitacionAsistente[];
}

// Interfaz para actualizar capacitación
export interface UpdateCapacitacionData {
  codigo?: string;
  razon_social?: string;
  ruc?: string;
  domicilio?: string;
  actividad_economica?: string;
  num_trabajadores?: number;
  tipo_actividad?: string;
  fecha_capacitacion?: string;
  tema_capacitacion?: string;
  capacitador?: string;
  num_horas?: number;
  lugar_capacitacion?: string;
  fk_idempleados?: number;
  observaciones?: string;
  asistentes?: CapacitacionAsistente[];
}

// Interfaz para empleado (para selects)
export interface EmpleadoOption {
  idempleados: number;
  nombre_completo: string;
  dni: string;
  cargo: string;
}

// Interfaz para tipo de actividad
export interface TipoActividadOption {
  value: string;
  label: string;
}
