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
 * O <T> significa que podemos passar qualquer coisa: Post, User, etc.
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

// ==========================================
// 2. TIPOS DE USUÁRIO (User Domain)
// ==========================================

// Extraímos isso para não ter que digitar "ADMIN" | ... toda hora
export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: "TEACHER" | "STUDENT"; // Na criação, limitamos apenas a estes
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: "TEACHER" | "STUDENT";
}

// ==========================================
// 3. TIPOS DE POST (Post Domain)
// ==========================================

export interface Author {
  id: number;
  email: string;
  name: string | null;
}

export interface Post {
  id: number;
  titulo: string;
  conteudo: string;
  autorId: number;
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

export interface sessionUser {
    id: string;
    email: string;
    name: string;
}

export interface PostData {
  titulo: string;
  conteudo: string;
}