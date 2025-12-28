"use client";

import React, { useState, useEffect, use } from "react";
import Head from "next/head";
import Link from "next/link"; // Adicionado para permitir voltar
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Importações da Lógica de Dados ---
import { postService, Post } from "../../services/postService";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Mantendo seu Mock para testes locais
  const [post, setPost] = useState<Post | null>();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (id && typeof id === "string") {
      const postId = parseInt(id, 10);
      const fetchPost = async () => {
        setHasError(false);
        try {
          const data = await postService.getPostById(postId);
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
  // Renderização: Loading
  // ----------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#62A59D]"></div>
          <p className="text-gray-500 font-medium">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Renderização: Erro
  // ----------------------------------------------------
  if (hasError || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-200 max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Post Não Encontrado</h1>
          <p className="text-gray-600 mb-6">
            Parece que o conteúdo que você procura não existe ou houve um erro de conexão.
          </p>
          <Link href="/" className="text-[#62A59D] font-semibold hover:underline">
            ← Voltar para a listagem
          </Link>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Renderização: Conteúdo Principal
  // ----------------------------------------------------
  return (
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>{post.titulo} | EducaMais</title>
      </Head>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Botão Voltar */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-[#62A59D] mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para posts
        </Link>

        {/* Cabeçalho do Post */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            {post.titulo}
          </h1>
          
          <div className="flex items-center gap-3 text-sm text-gray-500 border-y border-gray-200 py-4">
            <div className="flex items-center">
              <span className="font-semibold text-[#62A59D] uppercase tracking-wide mr-1">
                {post.autor?.name || "Autor Desconhecido"}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <time dateTime={post.createdAt}>
              Publicado em: {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </time>
          </div>
        </header>

        {/* Corpo do Post */}
        <article className="prose prose-stone prose-indigo lg:prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          >
            {post.conteudo}
          </ReactMarkdown>
        </article>

        {/* Rodapé do Post (Opcional) */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Última atualização: {new Date(post.atualizacao).toLocaleString('pt-BR')}
          </p>
        </footer>
      </main>
    </div>
  );
}