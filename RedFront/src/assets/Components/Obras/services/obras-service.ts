import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type { CreateObraData, UpdateObraData, ObraItem } from "../type/type";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
  error?: string;
}

export class ObrasService {
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
  }): Promise<ApiResponse<ObraItem[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/obras-listar`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async crear(data: CreateObraData): Promise<ApiResponse<ObraItem>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/obras-crear`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async actualizar(
    data: UpdateObraData
  ): Promise<ApiResponse<ObraItem>> {
    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/obras-actualizar`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async eliminar(idobras: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(
      `${Constantes.baseUrlBackend}/api/obras-eliminar`,
      {
        headers: this.getAuthHeaders(),
        data: { idobras },
      }
    );
    return response.data;
  }
}
