// src/app/admin/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import PostForm from '@/components/PostForm/index';
import { useRouter, useParams } from 'next/navigation';
import { postService } from '@/services/postService';
import { authClient } from '@/services/authClient';
import { CreatePostData, SessionUser } from '@/types'; // Adicione SessionUser

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [initialData, setInitialData] = useState<CreatePostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Autenticação
  const { data: session, isPending } = authClient.useSession();
  
  // Cast para acessar o appRole
  const user = session?.user as SessionUser | undefined;

  // --- PROTEÇÃO DA ROTA (CORRIGIDA) ---
  useEffect(() => {
    if (!isPending) {
      // 1. Se não tem usuário logado -> Login
      if (!user) {
        router.push('/admin/signin');
        return;
      }

      // 2. Se tem usuário, mas é ALUNO -> Home
      // Só deixa passar se for ADMIN ou TEACHER
      if (user.appRole !== 'ADMIN' && user.appRole !== 'TEACHER') {
        router.push('/');
      }
    }
  }, [isPending, user, router]);

  // Busca os dados do post ao carregar
  useEffect(() => {
    // Adicionei verificação de user aqui para não buscar dados se não tiver permissão
    if (!postId || !user || (user.appRole !== 'ADMIN' && user.appRole !== 'TEACHER')) return;

    const fetchCreatePostData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const post = await postService.getPostById(Number(postId));
        setInitialData({
          titulo: post.titulo,
          conteudo: post.conteudo,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro ao carregar dados do post.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreatePostData();
  }, [postId, user]); // user na dependência

  // Função chamada ao salvar
  const handleUpdatePost = async (formData: { titulo: string; conteudo: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await postService.updatePost(Number(postId), formData);
      alert('Post atualizado com sucesso!');
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      setIsSubmitting(false);
      
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error('Ocorreu um erro inesperado ao atualizar.');
      }
    }
  };

  // Renderização de Loading
  if (isPending || isLoading) return <div className="p-6">Carregando...</div>;
  
  // Bloqueio visual final: Se não for chefe, não mostra nada (enquanto redireciona)
  if (user?.appRole !== 'ADMIN' && user?.appRole !== 'TEACHER') {
    return null; 
  }

  if (error && !initialData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-600">
        Erro ao carregar post: {error}
      </div>
    );
  }

  if (!initialData) return <div className="p-6">Post não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar Postagem</h1>
      <p className="text-gray-600 mb-6">Atualize as informações do artigo abaixo.</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <PostForm
        initialData={initialData}
        onSubmit={handleUpdatePost}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}