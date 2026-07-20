import { fetchApi } from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Tipos ─────────────────────────────────────────────────────────────────────
export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterEmpresaPayload {
  nombre_empresa: string;
  nombre_admin: string;
  username: string;
  email: string;
  password: string;
  plan_id?: number;
  referencia_pago?: string;
  comprobante?: any; // Para el archivo en FormData
}

export interface Plan {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  limite_usuarios: number;
  limite_turnos: number;
  limite_numeros: number;
  estado: 'activo' | 'inactivo';
  config?: any;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nombre: string;
    username: string;
    rol: 'admin' | 'vendedor';
    empresa_id: number;
    punto_venta_id?: number;
  };
  empresa: {
    id: number;
    nombre: string;
  };
  punto_venta?: {
    id: number;
    nombre: string;
    direccion?: string;
  };
}

export interface UserProfile {
  user: {
    id: number;
    nombre: string;
    username: string;
    rol: 'admin' | 'vendedor';
    empresa_id: number;
    punto_venta_id?: number;
  };
  empresa: {
    id: number;
    nombre: string;
  };
  punto_venta?: {
    id: number;
    nombre: string;
    direccion?: string;
  };
}

// ─── Auth Service ──────────────────────────────────────────────────────────────

/** POST /api/auth/login */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const data = await fetchApi<LoginResponse>('auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  // Persistir token (ahora 'data' contiene directamente el objeto con el token)
  await AsyncStorage.setItem('userToken', data.token);
  return data;
}

/** GET /api/auth/me */
export async function getProfile(): Promise<UserProfile> {
  return fetchApi<UserProfile>('auth/me');
}

/** GET /api/auth/planes */
export async function getPlanes(): Promise<Plan[]> {
  return fetchApi<Plan[]>('auth/planes');
}

/** POST /api/auth/register-empresa (Multipart) */
export async function registerEmpresa(
  formData: FormData
): Promise<any> {
  return fetchApi('auth/register-empresa', {
    method: 'POST',
    body: formData as any,
    formData: true,
  });
}

/** POST /api/auth/comprobante-pago (multipart/form-data) */
export async function subirComprobante(formData: FormData): Promise<any> {
  return fetchApi('auth/comprobante-pago', {
    method: 'POST',
    body: formData as any,
    formData: true,
  });
}

/** PATCH /api/auth/aprobar-pago/:id */
export async function aprobarPago(id: number): Promise<any> {
  return fetchApi(`auth/aprobar-pago/${id}`, { method: 'PATCH' });
}

/** Limpia el token de AsyncStorage */
export async function logout(): Promise<void> {
  await AsyncStorage.removeItem('userToken');
}
