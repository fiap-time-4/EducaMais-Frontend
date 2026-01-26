"use client";

import React, { useState, useEffect, useCallback } from "react";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { postService } from "@/services/postService";
import { authClient } from "@/services/authClient";
import { Post, SessionUser } from "@/types";
import { useRequireRole } from "@/hooks/useRequireRole";

const LIMIT = 5;

export default function DashboardPage() {
  // 1. SEGURANÇA: O hook assume o controle do redirecionamento
  useRequireRole(["ADMIN", "TEACHER"]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Precisamos manter o useSession aqui para acessar os DADOS do usuário (id, nome),
  // já que o hook useRequireRole serve apenas para proteção (side-effect).
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const sessionUser = session?.user as SessionUser | undefined;

  const fetchPosts = useCallback(async (pageNumber: number) => {
    // Segurança extra: se o usuário ainda não carregou, não busca nada
    if (!sessionUser) return;

    setIsLoadingPosts(true);
    try {
      // Lógica de filtro: Admin vê tudo (undefined), Teacher vê apenas os seus (id)
      const authorIdFilter = sessionUser.appRole === "ADMIN" ? undefined : sessionUser.id;

      const result = await postService.getAllPosts(pageNumber, LIMIT, authorIdFilter);

      setPosts(result.data || []);

      if (result.pagination) {
        setTotalPages(result.pagination.pages);
      }
    } catch (err: unknown) {
      console.error("Erro ao buscar posts:", err);
      setError("Erro ao carregar posts.");
    } finally {
      setIsLoadingPosts(false);
    }
  }, [sessionUser]); 

  // Effect para buscar os posts
  useEffect(() => {
    // Só dispara a busca quando o usuário estiver carregado e confirmado
    if (!isAuthLoading && sessionUser) {
      fetchPosts(page);
    }
  }, [page, fetchPosts, isAuthLoading, sessionUser]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este post?")) {
      setError(null);
      try {
        await postService.deletePost(postId);
        setPosts((currentPosts) =>
          currentPosts.filter((post) => post.id !== postId)
        );
        alert("Post excluído com sucesso!");
        fetchPosts(page);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao excluir o post.");
        }
      }
    }
  };

  // Se o Auth estiver carregando, mostramos o loader para evitar "flash" de conteúdo
  // ou tentar buscar posts sem ter o ID do usuário ainda.
  if (isAuthLoading || isLoadingPosts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Carregando...</p>
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

  // Se chegou aqui, o useRequireRole garantiu que é ADMIN ou TEACHER
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          {sessionUser && (
            <p className="text-gray-600 mt-1">
              Olá, <span className="font-semibold">{sessionUser.name || sessionUser.email}</span>!
            </p>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Nenhum post publicado.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                isAdmin={true} 
                post={post}
                onDelete={() => handleDelete(post.id)}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onNext={handleNextPage}
            onPrevious={handlePrevPage}
          />
        </>
      )}
    </div>
  );
}