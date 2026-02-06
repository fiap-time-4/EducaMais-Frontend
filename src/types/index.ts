// src/types/index.ts

// ==========================================
// 1. TIPOS GENÉRICOS (Reutilizáveis)
// ==========================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Tipo Genérico de Resposta da API.
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

// ==========================================
// 2. TIPOS DE USUÁRIO E SESSÃO (User Domain)
// ==========================================

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

/**
 * Tipo usado especificamente para a Sessão (Login/Auth)
 */
export interface SessionUser {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string; 
    appRole: string;
}

/**
 * Tipo usado para o Usuário completo vindo do Banco de Dados
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // Ajustei para string pois costuma vir "user" do backend, mas pode ser UserRole se for estrito
  createdAt: string;
  appRole: UserRole;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;     
  appRole: UserRole; 
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: string;     
  appRole?: UserRole;
}

// ==========================================
// 3. TIPOS DE POST (Post Domain)
// ==========================================

export interface Author {
  id: string;         // CORREÇÃO: ID de usuário é string (uuid/cuid), não number
  email: string;
  name: string | null;
  appRole?: UserRole; // <--- AQUI ESTÁ A CORREÇÃO PRINCIPAL
}

export interface Post {
  id: number;         // ID do Post é Int (autoincrement)
  titulo: string;
  conteudo: string;
  autorId: string;    // CORREÇÃO: Tem que bater com o tipo do Author.id
  createdAt: string;
  atualizacao: string;
  autor: Author;
}

export interface CreatePostData {
  titulo: string;
  conteudo: string;
}

export interface UpdatePostData {
  titulo?: string;
  conteudo?: string;
}