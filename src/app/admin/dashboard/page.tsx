// src/app/admin/dashboard/page.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { postService } from '@/app/services/postService';
import { authClient } from '@/app/services/authClient';

// --- Definição dos Tipos ---
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
// --- FIM DOS TIPOS ---

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const sessionUser = session?.user;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await postService.getAllPosts();
        setPosts(result.data || []); 
      } catch (err: unknown) { // <-- MUDANÇA 1: de 'any' para 'unknown'
        // Agora verificamos o tipo do erro
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro desconhecido.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []); 

  const handleDelete = async (postId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      setError(null); // Limpa erros antigos
      try {
        await postService.deletePost(postId);
        setPosts((currentPosts) =>
          currentPosts.filter((post) => post.id !== postId)
        );
        alert('Post excluído com sucesso!');
      } catch (err: unknown) { // <-- MUDANÇA 2: de 'any' para 'unknown'
        // Verificamos o tipo do erro
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro ao excluir o post.');
        }
      }
    }
  };

  if (isLoading) return <div>Carregando posts...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro: {error}</div>;

  return (
    <div>
      <h1>Dashboard Administrativo</h1>
      {sessionUser && (<p>Bem-vindo, {sessionUser.name}!</p>
      )}
      
      <Link href="/admin/create">
        Criar Novo Post
      </Link>

      {posts.length === 0 ? (
        <p>Nenhum post encontrado.</p>
      ) : (
        <ul>
          {posts.map((post: Post) => (
            <li
              key={post.id}
              style={{
                border: '1px solid #ccc',
                margin: '10px',
                padding: '10px',
              }}
            >
              <h2>{post.titulo}</h2>
              <p>Autor: {post.autor?.name || 'Desconhecido'}</p> 
              
              <Link href={`/admin/edit/${post.id}`}>
                Editar
              </Link>
              
              <button
                onClick={() => handleDelete(post.id)}
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}