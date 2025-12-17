import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type {
  CreateEmpleadoData,
  UpdateEmpleadoData,
  EmpleadoItem,
  GeneroOption,
  CargoOption,
} from "../type/type";

export interface ApiResponse<T> {
  message: string;
  success?: boolean;
  data?: T;
  total?: number;
  error?: string;
}

export class EmpleadosService {
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

  static async listar(params: {
    Limite_inferior: number;
    Limite_Superior: number;
    Buscar?: string;
  }): Promise<ApiResponse<EmpleadoItem[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/empleados-listar`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async crear(
    data: CreateEmpleadoData
  ): Promise<ApiResponse<EmpleadoItem>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/empleados-crear`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async mostrar(id: number): Promise<ApiResponse<EmpleadoItem>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/empleados-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async actualizar(
    id: number,
    data: UpdateEmpleadoData
  ): Promise<ApiResponse<EmpleadoItem>> {
    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/empleados-actualizar/${id}`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async eliminar(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(
      `${Constantes.baseUrlBackend}/api/empleados-eliminar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Método para obtener detalles completos de un empleado
  static async obtenerPorId(id: number): Promise<ApiResponse<EmpleadoItem>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/empleados-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  // Método para obtener géneros para el select
  static async obtenerGeneros(): Promise<ApiResponse<GeneroOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/empleados-generos`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return {
      message: response.data.message,
      success: response.data.success,
      data: response.data.data,
    };
  }

  // Método para obtener cargos para el select
  static async obtenerCargos(): Promise<ApiResponse<CargoOption[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/empleados-cargos`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return {
      message: response.data.message,
      success: response.data.success,
      data: response.data.data,
    };
  }
}
