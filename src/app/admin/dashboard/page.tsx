"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { postService } from "@/app/services/postService";
import { authClient } from "@/app/services/authClient";

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
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook de autenticação
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const sessionUser = session?.user;

  // Debug: Veja no console do navegador (F12) o que está chegando
  console.log("Sessão:", session);
  console.log("Carregando Auth:", isAuthLoading);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoadingPosts(true);
      try {
        const result = await postService.getAllPosts();
        setPosts(result.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este post?")) {
      setError(null);
      try {
        await postService.deletePost(postId);
        setPosts((currentPosts) =>
          currentPosts.filter((post) => post.id !== postId)
        );
        alert("Post excluído com sucesso!");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao excluir o post.");
        }
      }
    }
  };

  // Carregamento Geral (Auth ou Posts)
  if (isAuthLoading || isLoadingPosts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Carregando painel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md m-4">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Cabeçalho do Dashboard */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          {/* Se o user existir, mostramos. Se não tiver nome, usamos o email */}
          {sessionUser && (
            <p className="text-gray-600 mt-1">
              Olá, <span className="font-semibold">{sessionUser.name || sessionUser.email}</span>!
            </p>
          )}
        </div>
      </div>

      {/* Lista de Posts */}
      {posts.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Nenhum post publicado.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post: Post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{post.titulo}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Autor: {post.autor?.name || "Desconhecido"}
                </p>
              </div>

              <div className="flex gap-3">
                {/* Botão Editar */}
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm border border-indigo-200 hover:border-indigo-400 px-3 py-1 rounded"
                >
                  Editar
                </Link>

                {/* Botão Excluir */}
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-200 hover:border-red-400 px-3 py-1 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}