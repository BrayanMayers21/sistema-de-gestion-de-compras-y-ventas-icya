import axios from "axios";
import Cookies from "js-cookie";
import Constantes from "@/assets/constants/constantes";
import type { Categoria, CreateCategoriaData } from "../type/type";

export interface ApiResponse<T> {
  message: string;
  data?: T;
  total?: number;
  error?: string;
}

export class CategoriasService {
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
  }): Promise<ApiResponse<Categoria[]>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/categorias-listar`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async crear(
    data: CreateCategoriaData
  ): Promise<ApiResponse<Categoria>> {
    const response = await axios.post(
      `${Constantes.baseUrlBackend}/api/categorias-crear`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async mostrar(id: number): Promise<ApiResponse<Categoria>> {
    const response = await axios.get(
      `${Constantes.baseUrlBackend}/api/categorias-mostrar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async actualizar(
    id: number,
    data: CreateCategoriaData
  ): Promise<ApiResponse<Categoria>> {
    const response = await axios.put(
      `${Constantes.baseUrlBackend}/api/categorias-actualizar/${id}`,
      data,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  static async eliminar(id: number): Promise<ApiResponse<null>> {
    const response = await axios.delete(
      `${Constantes.baseUrlBackend}/api/categorias-eliminar/${id}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }
}
