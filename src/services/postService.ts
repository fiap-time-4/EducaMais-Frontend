// src/services/postService.ts

import apiClient from './apiClient';
import axios from 'axios';
import { Post, CreatePostData, UpdatePostData, PaginatedResponse } from '../types';

/**
 * Cria um novo post
 */
const createPost = async (postData: CreatePostData): Promise<Post> => {
  try {
    const response = await apiClient.post<{ data: Post }>('/posts', postData);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao criar o post');
    }
    throw new Error('Ocorreu um erro desconhecido ao criar o post.');
  }
};

/**
 * Atualiza um post existente.
 */
const updatePost = async (id: number, postData: UpdatePostData): Promise<Post> => {
  try {
    const response = await apiClient.put<{ data: Post }>(`/posts/${id}`, postData);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao atualizar o post');
    }
    throw new Error('Ocorreu um erro desconhecido ao atualizar o post.');
  }
};

/**
 * Deleta um post.
 */
const deletePost = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/posts/${id}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao deletar o post');
    }
    throw new Error('Ocorreu um erro desconhecido ao deletar o post.');
  }
};

/**
 * Busca um post único pelo ID.
 */
const getPostById = async (id: number): Promise<Post> => {
  try {
    const response = await apiClient.get<{ data: Post }>(`/posts/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao buscar o post');
    }
    throw new Error('Ocorreu um erro desconhecido ao buscar o post.');
  }
};

/**
 * Busca a lista paginada de posts (PARA ADMIN - VÊ TUDO).
 * Removemos o filtro de authorId daqui, pois agora existe rota específica.
 */
const getAllPosts = async (page = 1, limit = 5): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Post>>('/posts', {
      params: { page, limit }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao buscar posts');
    }
    throw new Error('Ocorreu um erro desconhecido ao buscar posts.');
  }
};

/**
 * NOVO MÉTODO: Busca posts de um autor específico.
 * Rota Backend: /posts/user/:userId
 * (PARA TEACHER - VÊ SÓ OS DELE)
 */
const getPostsByAuthor = async (userId: string, page = 1, limit = 5): Promise<PaginatedResponse<Post>> => {
  try {
    // Atenção: Assumi que a rota base é /posts. 
    // Se o backend definiu a rota raiz como /user/:id sem o /posts antes, ajuste aqui.
    const response = await apiClient.get<PaginatedResponse<Post>>(`/posts/user/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao buscar posts do autor');
    }
    throw new Error('Ocorreu um erro desconhecido ao buscar posts do autor.');
  }
};

/**
 * Busca posts por um termo de pesquisa.
 */
const searchPosts = async (term: string, page = 1, limit = 5): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Post>>('/posts/search', {
      params: { search: term, page, limit }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao buscar posts');
    }
    throw new Error('Ocorreu um erro desconhecido ao buscar posts.');
  }
};

// Exporta todas as funções
export const postService = {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getAllPosts,
  getPostsByAuthor,
  searchPosts,
};