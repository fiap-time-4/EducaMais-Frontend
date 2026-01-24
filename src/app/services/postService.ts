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
 * Busca a lista paginada de posts.
 * ACEITA AGORA O FILTRO DE AUTOR (authorId)
 */
const getAllPosts = async (page = 1, limit = 5, authorId?: string): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Post>>('/posts', {
      // O Axios envia automaticamente na URL: ?page=1&limit=10&authorId=...
      params: { page, limit, authorId }
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
 * Busca posts por um termo de pesquisa.
 * ACEITA AGORA O FILTRO DE AUTOR (authorId)
 */
const searchPosts = async (term: string, page = 1, limit = 5, authorId?: string): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Post>>('/posts/search', {
      params: { search: term, page, limit, authorId }
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
  searchPosts,
};