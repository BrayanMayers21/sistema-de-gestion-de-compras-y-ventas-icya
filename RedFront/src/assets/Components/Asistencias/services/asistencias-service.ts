import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type {
  AsistenciaItem,
  CreateAsistenciaIndividual,
  CreateAsistenciaMasiva,
  UpdateAsistenciaIndividual,
  UpdateAsistenciaMasiva,
} from "../type/type";

export interface ApiResponse<T> {
  message: string;
  success?: boolean;
  data?: T;
  total?: number;
  error?: string;
}

export class AsistenciasService {
  private static getAuthHeaders() {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("Token de autenticación no encontrado");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Listar asistencias con paginación
  static async listar(params: {
    Limite_inferior: number;
    Limite_Superior: number;
    Buscar?: string;
  }): Promise<ApiResponse<AsistenciaItem[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/asistencias-listar`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Obtener detalle de una asistencia específica
  static async mostrar(id: number): Promise<ApiResponse<AsistenciaItem>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/asistencias-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Registrar asistencia (individual o masiva)
  static async registrar(
    data: CreateAsistenciaIndividual | CreateAsistenciaMasiva
  ): Promise<
    ApiResponse<
      | AsistenciaItem
      | { total_registradas: number; asistencias: AsistenciaItem[] }
    >
  > {
    console.log("=== AsistenciasService.registrar ===");
    console.log("Datos enviados:", JSON.stringify(data, null, 2));
    console.log(
      "URL:",
      `${Constantes.baseUrlBackend}/api/asistencias-registrar`
    );

    try {
      const response = await axios.post(
        `${Constantes.baseUrlBackend}/api/asistencias-registrar`,
        data,
        {
          headers: this.getAuthHeaders(),
        }
      );
      console.log("Respuesta exitosa:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error en registrar:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw error;
    }
  }

  // Registrar lista arbitraria de asistencias
  static async registrarLista(
    asistencias: CreateAsistenciaIndividual[]
  ): Promise<ApiResponse<{ created: number; updated: number }>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/asistencias-registrar-lista`,
      { asistencias },
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Actualizar asistencia individual
  static async actualizar(
    id: number,
    data: UpdateAsistenciaIndividual
  ): Promise<ApiResponse<AsistenciaItem>> {
    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/asistencias-actualizar/${id}`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Actualizar asistencias masivamente
  static async actualizarMasivo(
    data: UpdateAsistenciaMasiva
  ): Promise<ApiResponse<{ total_actualizadas: number }>> {
    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/asistencias-actualizar-masivo`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Eliminar asistencia
  static async eliminar(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(
      `${Constantes.baseUrlBackend}/api/asistencias-eliminar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Obtener asistencias por empleado
  static async porEmpleado(
    idEmpleado: number
  ): Promise<ApiResponse<AsistenciaItem[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/asistencias-por-empleado/${idEmpleado}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Obtener asistencias por rango de fechas
  static async porFechas(params: {
    fecha_inicio: string;
    fecha_fin: string;
    fk_idempleados?: number;
  }): Promise<ApiResponse<AsistenciaItem[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/asistencias-por-fechas`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }
  // Exportar Excel
  static exportarExcel(fechaInicio: string, fechaFin: string) {
    const token = Cookies.get("token");
    const url = `${Constantes.baseUrlBackend}/api/asistencias-export-excel?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&token=${token}`;
    window.open(url, "_blank");
  }

  // Exportar PDF
  static exportarPdf(fechaInicio: string, fechaFin: string) {
    const token = Cookies.get("token");
    const url = `${Constantes.baseUrlBackend}/api/asistencias-export-pdf?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&token=${token}`;
    window.open(url, "_blank");
  }
}
