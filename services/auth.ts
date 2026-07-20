import { apiClient } from '../api/axios';

export interface User {
  id: number;
  name: string;
  email?: string;
  username: string;
  roles: string[];
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const login = async (payload: { username: string; password: string }): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/login', payload);
  return data;
};

export const getProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<{ success: boolean; user: User }>('/me');
  return data.user;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/logout');
};
