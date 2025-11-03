// src/app/admin/edit/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import PostForm from "@/app/components/PostForm/index";
import { useRouter, useParams } from "next/navigation";
import { postService } from "@/app/services/postService";

// Tipagem básica para os dados do post que esperamos
interface PostData {
  titulo: string;
  conteudo: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [initialData, setInitialData] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os dados do post quando a página carrega
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
          setError("Erro ao carregar dados do post.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleUpdatePost = async (formData: {
    titulo: string;
    conteudo: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await postService.updatePost(Number(postId), formData);

      alert("Post atualizado com sucesso!");
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
      setIsSubmitting(false); // Permite que o usuário tente novamente
    }
  };

  // Renderização condicional
  if (isLoading) return <div>Carregando dados do post...</div>;
  if (error && !initialData)
    return <div style={{ color: "red" }}>Erro: {error}</div>;
  if (!initialData) return <div>Post não encontrado.</div>;

  return (
    <div>
      <h1>Editar Postagem</h1>
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      <PostForm
        initialData={initialData}
        onSubmit={handleUpdatePost}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
