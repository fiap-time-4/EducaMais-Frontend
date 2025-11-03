// src/services/postService.ts

import apiClient from './apiClient';
// MUDANÇA 1: Importar o Axios para checagem de tipo de erro
import axios from 'axios'; 

// Definição de Tipos ---
// (Idealmente, Pacote 1 ou 2 move isso para 'src/types/index.ts')

interface Author {
  id: number;
  email: string;
  name: string | null;
}

interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  autorId: number;
  createdAt: string;
  atualizacao: string;
  autor: Author;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Tipos dos formulários
interface CreatePostData {
  titulo: string;
  conteudo: string;
  autorId: number;
}

interface UpdatePostData {
  titulo?: string;
  conteudo?: string;
}

// Tipo de retorno para listas paginadas
type PaginatedPosts = { data: Post[]; pagination: Pagination };

// ==============================================================
// FUNÇÕES DO PACOTE 4 (ADMIN / SEU PACOTE)
// ==============================================================

/**
 * Cria um novo post.
 * (Requer autenticação, que o apiClient irá adicionar)
 */
const createPost = async (postData: CreatePostData): Promise<Post> => {
  try {
    const response = await apiClient.post<{ data: Post }>('/posts', postData);
    return response.data.data;
  } catch (error: unknown) { // <-- MUDANÇA 3: unknown
    // MUDANÇA 4: Tratamento de erro robusto para Axios
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao criar o post');
    }
    throw new Error('Ocorreu um erro desconhecido ao criar o post.');
  }
};

/**
 * Atualiza um post existente.
 * (Requer autenticação)
 */
const updatePost = async (id: number, postData: UpdatePostData): Promise<Post> => {
  try {
    const response = await apiClient.put<{ data: Post }>(`/posts/${id}`, postData);
    return response.data.data;
  } catch (error: unknown) { // <-- MUDANÇA 3
    // MUDANÇA 4
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao atualizar o post');
    }
    throw new Error('Ocorreu um erro desconhecido ao atualizar o post.');
  }
};

/**
 * Deleta um post.
 * (Requer autenticação)
 */
const deletePost = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/posts/${id}`);
  } catch (error: unknown) { // <-- MUDANÇA 3
    // MUDANÇA 4
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Erro ao deletar o post');
    }
    throw new Error('Ocorreu um erro desconhecido ao deletar o post.');
  }
};

/**
 * Busca um post único pelo ID.
 * (Usado na sua página de Edição)
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


// ==============================================================
// FUNÇÕES DO PACOTE 2 (PÁGINAS PÚBLICAS)
// ==============================================================
// (Estes são placeholders para o Pacote 2 implementar)

/**
 * Busca a lista paginada de posts.
 */
const getAllPosts = async (page = 1, limit = 10): Promise<PaginatedPosts> => {
  // O Pacote 2 irá implementar esta lógica
  console.log('Função getAllPosts a ser implementada pelo Pacote 2');
  try {
    const response = await apiClient.get<PaginatedPosts>('/posts', {
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
 * Busca posts por um termo de pesquisa.
 */
const searchPosts = async (term: string, page = 1, limit = 10): Promise<PaginatedPosts> => {
  // O Pacote 2 irá implementar esta lógica
  console.log('Função searchPosts a ser implementada pelo Pacote 2');
  try {
     const response = await apiClient.get<PaginatedPosts>('/posts/search', {
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
  // Suas funções (Pacote 4)
  createPost,
  updatePost,
  deletePost,
  getPostById,
  // Funções do Pacote 2
  getAllPosts,
  searchPosts,
};