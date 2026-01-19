import apiClient from "./apiClient";
import axios from "axios";
import { User, CreateUserDTO, UpdateUserDTO, PaginatedResponse } from '../types';

export const userService = {
  // Busca todos e filtra pelo cargo
  getAllByRole: async (role: "TEACHER" | "STUDENT", page = 1) => {
    try {
      // Usamos apiClient direto. Ele já sabe a URL base e já manda cookies/tokens
      const response = await apiClient.get<PaginatedResponse<User>>('/users', {
        params: { page, limit: 100 }
      });
      
      const allUsers = response.data.data;
      
      // Filtro no Front (igual antes)
      const filteredUsers = allUsers.filter((user) => user.role === role);

      return {
        data: filteredUsers,
        total: filteredUsers.length
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao buscar usuários");
      }
      throw new Error("Erro desconhecido ao buscar usuários");
    }
  },

  getById: async (id: string) => {
    try {
      const response = await apiClient.get<{ data: User }>(`/users/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao buscar usuário");
      }
      throw new Error("Erro desconhecido ao buscar usuário");
    }
  },

  create: async (data: CreateUserDTO) => {
    try {
      // apiClient.post resolve URL e JSON.stringify automaticamente
      const response = await apiClient.post('/users', {
        ...data,
        appRole: data.role
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao criar usuário");
      }
      throw new Error("Erro desconhecido ao criar usuário");
    }
  },

  update: async (id: string, data: UpdateUserDTO) => {
    try {
      const response = await apiClient.put(`/users/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao atualizar usuário");
      }
      throw new Error("Erro desconhecido ao atualizar usuário");
    }
  },

  delete: async (id: string) => {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Erro ao deletar usuário");
      }
      throw new Error("Erro desconhecido ao deletar usuário");
    }
  }
};