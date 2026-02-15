// src/app/services/userService.ts

import apiClient from './apiClient';
import axios from 'axios';
import { User, CreateUserDTO, UpdateUserDTO, PaginatedResponse } from '@/types';

const create = async (userData: CreateUserDTO): Promise<User> => {
  try {
    const response = await apiClient.post<{ data: User }>('/users', userData);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao criar usuário');
    }
    throw new Error('Ocorreu um erro desconhecido ao criar usuário.');
  }
};

const update = async (id: string, userData: UpdateUserDTO): Promise<User> => {
  try {
    const response = await apiClient.put<{ data: User }>(`/users/${id}`, userData);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao atualizar usuário');
    }
    throw new Error('Ocorreu um erro desconhecido ao atualizar usuário.');
  }
};

const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao deletar usuário');
    }
    throw new Error('Ocorreu um erro desconhecido ao deletar usuário.');
  }
};

const getById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao buscar usuário');
    }
    throw new Error('Ocorreu um erro desconhecido ao buscar usuário.');
  }
};

/**
 * --- MUDANÇA AQUI ---
 * Agora aceita string OU array de strings (ex: ["ADMIN", "TEACHER"])
 */
const getAllByRole = async (roles: string | string[], page = 1, limit = 5): Promise<PaginatedResponse<User>> => {
  try {    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient.get<any>('/users', {
      params: { 
        role: roles, // O backend precisa estar preparado para receber array ou string
        page, 
        limit 
      }
    });

    const backendData = response.data;

    if (backendData.pagination) {
      return backendData as PaginatedResponse<User>;
    }

    return {
      data: backendData.data || [],
      pagination: {
        pages: Math.ceil((backendData.total || 0) / limit)
      }
    } as PaginatedResponse<User>;

  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao buscar usuários');
    }
    throw new Error('Ocorreu um erro desconhecido ao buscar usuários.');
  }
};

export const userService = {
  create,
  update,
  delete: deleteUser,
  getById,
  getAllByRole,
};