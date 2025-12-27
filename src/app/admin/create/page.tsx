'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/app/components/PostForm'; 
import { authClient } from '@/app/services/authClient';
import { postService } from '@/app/services/postService'; // <-- Importamos o serviço

export default function CreatePostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Autenticação
  const { data: session, isPending } = authClient.useSession();

  // Proteção da rota (Redundância de segurança com o Middleware)
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/admin/signin');
    }
  }, [isPending, session, router]);

  /**
   * Função que o PostForm vai chamar quando o usuário clicar em "Salvar"
   */
  const handleCreatePost = async (data: { titulo: string; conteudo: string }) => {
    setIsSubmitting(true);

    try {
      // MUDANÇA: Usamos o serviço centralizado.
      // Não precisamos passar ID, nem token manual, o apiClient resolve tudo.
      await postService.createPost({
        titulo: data.titulo,
        conteudo: data.conteudo,
      });

      alert('Post criado com sucesso!');
      router.push('/admin/dashboard');
    } catch (error: unknown) {
      setIsSubmitting(false);
      
      // Repassamos o erro para o componente PostForm exibir na tela
      if (error instanceof Error) {
        throw new Error(error.message); 
      } else {
        throw new Error('Erro desconhecido ao criar post.');
      }
    }
  };

  // Se estiver carregando a sessão, mostra um loading simples
  if (isPending) return <div>Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Criar Novo Post</h1>
      <p className="text-gray-600 mb-6">Preencha os campos abaixo para publicar um novo artigo.</p>
      
      <PostForm 
        onSubmit={handleCreatePost} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}