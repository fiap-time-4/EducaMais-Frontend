'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { postService } from "@/services/postService";
import { authClient } from "@/services/authClient";
import { useRequireRole } from '@/hooks/useRequireRole'; // <--- Importe o hook

export default function CreatePostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
   
  // 1. SEGURANÇA: O hook blinda a rota. 
  // Se não for ADMIN ou TEACHER, ele expulsa automaticamente.
  useRequireRole(['ADMIN', 'TEACHER']);

  // Ainda precisamos do isPending para mostrar o loading visual
  // enquanto o hook verifica a sessão em background.
  const { isPending } = authClient.useSession();

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
      
      // Melhor tratar o erro com alert ou state do que dar throw aqui,
      // pois throw em event handler pode quebrar a aplicação React.
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao criar post.';
      alert(message);
      console.error(error);
    }
  };

  // Enquanto a autenticação carrega, mostramos feedback visual
  if (isPending) {
    return <div className="p-6 text-center text-gray-500">Verificando permissões...</div>;
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