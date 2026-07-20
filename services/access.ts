import { apiClient } from '../api/axios';

export interface VerifyAccessPayload {
  codigo: string;
  metodo?: string;
}

export interface AccessResultData {
  success: boolean;
  status: string;
  message: string;
  cliente?: {
    id: number;
    nombre: string;
    membresia?: string;
    vence?: string;
    foto?: string | null;
  };
}

export interface Asistencia {
  id: number;
  fecha: string;
  hora_entrada: string;
  hora_salida: string | null;
  cliente: {
    id: number;
    nombre: string;
    foto: string | null;
    codigo: string;
  };
}

export interface AsistenciasResponse {
  data: Asistencia[];
  links?: any;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ClientesResponse {
  data: NonNullable<AccessResultData['cliente']>[];
  links?: any;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const verifyAccess = async (payload: VerifyAccessPayload): Promise<AccessResultData> => {
  // Según backend, la respuesta del success tiene estructura específica y los errores lanzan excepcion o devuelven json
  const { data } = await apiClient.post<AccessResultData>('/verificar-acceso', payload);
  return data;
};

export const getAsistencias = async (page: number = 1, filters?: { cliente?: string; fecha?: string }): Promise<AsistenciasResponse> => {
  const params: Record<string, any> = { page };
  if (filters?.cliente) params.cliente = filters.cliente;
  if (filters?.fecha) params.fecha = filters.fecha;

  const { data } = await apiClient.get<AsistenciasResponse>('/asistencias', { params });
  return data;
};

export const getClientes = async (page: number = 1, buscar?: string): Promise<ClientesResponse> => {
  const params: Record<string, any> = { page };
  if (buscar) params.buscar = buscar;

  const { data } = await apiClient.get<ClientesResponse>('/clientes', { params });
  return data;
};
