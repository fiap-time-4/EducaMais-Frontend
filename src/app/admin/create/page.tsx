'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm'; 
import { authClient } from '@/services/authClient';
import { postService } from '@/services/postService';
import { SessionUser } from '@/types';

export default function CreatePostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
   
  const { data: session, isPending } = authClient.useSession();
  
  const user = session?.user as SessionUser | undefined;

  // --- PROTEÇÃO DE ROTA CORRIGIDA ---
  useEffect(() => {
    if (!isPending) {
      // 1. Se não estiver logado -> Manda pro Login
      if (!user) {
        router.push('/admin/signin');
        return;
      }

      // 2. Se estiver logado, mas for ALUNO -> Manda pra Home
      // Só ADMIN e TEACHER podem passar daqui
      if (user.appRole !== 'ADMIN' && user.appRole !== 'TEACHER') {
        router.push('/');
      }
    }
  }, [isPending, user, router]);

  const handleCreatePost = async (data: { titulo: string; conteudo: string }) => {
    setIsSubmitting(true);

    try {
      await postService.createPost({
        titulo: data.titulo,
        conteudo: data.conteudo,
      });

      alert('Post criado com sucesso!');
      router.push('/admin/dashboard');
    } catch (error: unknown) {
      setIsSubmitting(false);
      
      if (error instanceof Error) {
        throw new Error(error.message); 
      } else {
        throw new Error('Erro desconhecido ao criar post.');
      }
    }
  };

  if (isPending) return <div className="p-6 text-center">Carregando permissões...</div>;

  if (user?.appRole !== 'ADMIN' && user?.appRole !== 'TEACHER') {
      return null;
  }

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