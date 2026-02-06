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
  useRequireRole(["ADMIN", "TEACHER"]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const sessionUser = session?.user as SessionUser | undefined;

  const fetchPosts = useCallback(async (pageNumber: number) => {
    if (!sessionUser) return;

    setIsLoadingPosts(true);
    setError(null);

    try {
      let result;
      if (sessionUser.appRole === "ADMIN") {
        result = await postService.getAllPosts(pageNumber, LIMIT);
      } else {
        result = await postService.getPostsByAuthor(sessionUser.id, pageNumber, LIMIT);
      }

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

  useEffect(() => {
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {sessionUser?.appRole === 'ADMIN' ? 'Todos os Posts' : 'Minhas Publicações'}
          </h1>
          {sessionUser && (
            <p className="text-gray-600 mt-1">
              Olá, <span className="font-semibold">{sessionUser.name || sessionUser.email}</span>!
            </p>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Nenhum post encontrado.</p>
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