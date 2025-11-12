"use client";

import React, { useState, useEffect, use } from "react";
import Head from "next/head";

// --- Importações de Componentes (Pacote 1) ---
// Importe o Header/Footer do seu projeto
// import Header from '../../components/Header';
// import Footer from '../../components/Footer';

// --- Importações da Lógica de Dados ---
import { getPostById, Post } from "../../services/postService";

// ----------------------------------------------------
// 1. Componente Principal da Página
// ----------------------------------------------------
export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = use(params)

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // ----------------------------------------------------
  // 2. Lógica de Busca de Dados
  // ----------------------------------------------------
  useEffect(() => {
    if (id && typeof id === "string") {
      const postId = parseInt(id, 10); 

      const fetchPost = async () => {
        setIsLoading(true);
        setHasError(false);

        try {
          const data = await getPostById(postId);
          setPost(data);
        } catch (error) {
          console.error(`Falha ao carregar o post ${postId}:`, error);
          setHasError(true);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPost();
    }
  }, [id]); 

  // ----------------------------------------------------
  // 3. Renderização Condicional
  // ----------------------------------------------------

  // Exibição de Carregamento
  if (isLoading) {
    return (
      <div style={{ padding: "20px" }}>
        {/* <Header /> */}
        <p>Carregando conteúdo do post...</p>
      </div>
    );
  }

  // Exibição de Erro ou Post Não Encontrado
  if (hasError || !post) {
    return (
      <div style={{ padding: "20px" }}>
        {/* <Header /> */}
        <h1 style={{ color: "red" }}>Post Não Encontrado</h1>
        <p>
          Parece que o conteúdo que você procura não existe ou houve um erro de
          conexão.
        </p>
      </div>
    );
  }

  // Exibição do Conteúdo 
  return (
    <div>
      <Head>
        <title>{post.titulo} | EducaMais</title>
      </Head>

      {/* <Header /> */}

      <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>

        <h1>{post.titulo}</h1>

        <div style={{ margin: "10px 0 30px" }}>
          <small>
            Autor: **{post.autor?.name || "Autor Desconhecido"}** | Publicado
            em: {new Date(post.createdAt).toLocaleDateString()}
          </small>
        </div>

        <hr />

        <p style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {post.conteudo}
        </p>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
