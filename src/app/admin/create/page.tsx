// src/app/admin/create/page.tsx
'use client'; // Obrigatório para usar hooks (useState, useRouter)

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/app/components/PostForm';
import { authClient, sessionUser } from '@/app/services/authClient';

// PLACEHOLDER: Importar o useAuth quando o Pacote 3 o criar
// import { useAuth } from '@/contexts/AuthContext';

export default function CreatePostPage() {
  const router = useRouter(); // Hook do Next.js para fazer redirecionamento
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const [sessionUser, setSessionUser] = useState<sessionUser>({ id: '', email: '', name: '' });

  useEffect(() => {
    if (!isPending && !session?.user || !session) {
      router.push('/admin/signin'); // Redireciona para a página de login se não estiver autenticado
    } else {
      setSessionUser(session.user);
    }
  }, [isPending, router, session]);

  /**
   * Esta é a função que será passada para o PostForm.
   * Ela contém a lógica específica de *criação*.
   */
  const handleCreatePost = async (data: { titulo: string; conteudo: string }) => {
    setIsSubmitting(true);

    const postData = {
      titulo: data.titulo,
      conteudo: data.conteudo,
      // não é mais necessario passar o autorId no post basta estar logado.
      // autorId: sessionUser.id, // Aqui usaremos o ID do usuário logado
    };


    // Lembrar de usar o apiClient ( axios )
    // PLACEHOLDER: Mover esta lógica para um 'postService' (Pacote 2)
    const response = await fetch('http://localhost:3333/posts', { // Use a URL do seu backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Futuramente: 'Authorization': `Bearer ${token}` (do Pacote 3)
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      setIsSubmitting(false); // Para o loading
      const errorData = await response.json();
      // O try/catch do PostForm vai pegar este erro e exibi-lo
      throw new Error(errorData.message || 'Falha ao criar o post.');
    }

    // Se deu tudo certo
    alert('Post criado com sucesso!');
    router.push('/admin/dashboard'); // Redireciona para o dashboard
    // Não precisamos do setIsSubmitting(false) aqui, pois a página será desmontada
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Criar Novo Post</h1>
      <p>Preencha os campos abaixo para criar uma nova postagem.</p>
      
      <PostForm 
        onSubmit={handleCreatePost} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}