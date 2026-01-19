// src/app/services/userService.ts

import apiClient from './apiClient';
import axios from 'axios';
// Ajuste o caminho dos tipos conforme sua estrutura (geralmente @/app/types ou ../types)
import { User, CreateUserDTO, UpdateUserDTO, PaginatedResponse } from '@/app/types';

/**
 * Cria um novo usuário
 */
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

/**
 * Atualiza um usuário existente.
 */
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

/**
 * Deleta um usuário.
 */
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

/**
 * Busca um usuário único pelo ID.
 */
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
 * Busca lista de usuários por Role com paginação.
 * Normaliza a resposta para garantir que o front receba sempre PaginatedResponse.
 */
const getAllByRole = async (role: string, page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
  try {
    const response = await apiClient.get<any>('/users', {
      params: { role, page, limit }
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

// Exporta todas as funções
export const userService = {
  create,
  update,
  delete: deleteUser, // Mantive o alias para você poder chamar userService.delete()
  getById,
  getAllByRole,
};