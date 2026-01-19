// src/app/admin/edit/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import PostForm from '@/app/components/PostForm/index';
import { useRouter, useParams } from 'next/navigation';
import { postService } from '@/app/services/postService';
import { authClient } from '@/app/services/authClient';
import { PostData } from '@/app/types';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [initialData, setInitialData] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Autenticação
  const { data: session, isPending } = authClient.useSession();

  // Proteção da rota
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/admin/signin');
    }
  }, [isPending, session, router]);

  // Busca os dados do post ao carregar
  useEffect(() => {
    if (!postId) return;

    const fetchPostData = async () => {
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

    fetchPostData();
  }, [postId]);

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
      
      // Lógica igual ao create: lança o erro para ser tratado ou exibido
      if (err instanceof Error) {
        throw new Error(err.message);
        // Se preferir exibir o erro no topo da página ao invés de lançar, use: setError(err.message);
      } else {
        throw new Error('Ocorreu um erro inesperado ao atualizar.');
      }
    }
  };

  // Renderização de Loading e Erros de Carregamento
  if (isPending || isLoading) return <div className="p-6">Carregando...</div>;
  
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

      {/* Se houver erro de envio (submit), mostramos aqui também se necessário */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <PostForm
        initialData={initialData}
        onSubmit={handleUpdatePost}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}