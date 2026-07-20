import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

//const API_BASE_URL = 'http://192.168.71.13:8000/api/mobile'; // URL de desarrollo, luego cambiar a prod
 const API_BASE_URL = 'https://demo-modapos.top/api/mobile';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
});

// Interceptor para inyectar el token en cada request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error obteniendo token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para atrapar errores 401 (token expirado o inválido)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Manejar cierre de sesión aquí o disparar un evento global
      // Podríamos limpiar el token
      await SecureStore.deleteItemAsync('userToken');
      // Redirigiríamos al login en el root layout basado en el estado
    }
    
    // Simplificar el error para los servicios
    const customError = new Error(
      error.response?.data?.message || error.response?.data?.error || 'Ocurrió un error inesperado'
    );
    (customError as any).status = error.response?.status;
    return Promise.reject(customError);
  }
);
