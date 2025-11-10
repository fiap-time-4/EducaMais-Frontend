import api from './api';

export interface Post {
  id: number;
  title: string;
  summary: string;
  author: string;
  content: string;
  // Adicione outros campos que a API retornar
}

/**
 * Busca uma lista de posts.
 */
export const getPosts = async (query: string = ''): Promise<Post[]> => {
  try {
    // CORREÇÃO: Adicionamos <Post[]> para dizer ao Axios qual é o tipo de 'response.data'
    const response = await api.get<Post[]>(`/posts`, {
        params: { q: query } 
    });
    
    // O TypeScript agora confia que response.data é do tipo Post[]
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar lista de posts:", error);
    return []; 
  }
};

/**
 * Busca um post específico pelo ID.
 */
export const getPostById = async (id: number): Promise<Post | null> => {
  try {
    // CORREÇÃO: Adicionamos <Post> para dizer ao Axios qual é o tipo de 'response.data'
    const response = await api.get<Post>(`/posts/${id}`);
    
    // O TypeScript agora confia que response.data é do tipo Post
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar post com ID ${id}:`, error);
    return null; 
  }
};