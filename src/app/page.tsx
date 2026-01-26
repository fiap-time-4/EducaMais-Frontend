"use client";

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination"; // <--- Importamos aqui
import { postService } from "../services/postService";
import { Post } from "../types";
import { Loader2 } from "lucide-react";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 5;

  const fetchPosts = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    setHasError(false);

    try {
      // Como searchPosts e getAllPosts retornam a mesma estrutura (PaginatedResponse),
      // podemos simplificar a lógica:
      const response = search.trim()
        ? await postService.searchPosts(search, page, LIMIT)
        : await postService.getAllPosts(page, LIMIT);

      setPosts(response.data);

      // A API nos diz quantas páginas existem. Muito mais seguro!
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
      }

    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(currentPage, searchTerm);
  }, [currentPage, fetchPosts]); // searchTerm removido daqui para não buscar enquanto digita, só no submit

  const handleSearchSubmit = () => {
    setCurrentPage(1); // Volta para pág 1 ao pesquisar
    fetchPosts(1, searchTerm);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Home | EducaMais</title>
      </Head>
      <main className="max-w-4xl mx-auto p-6">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-[#62A59D]">
            Últimas Notícias e Artigos
          </h1>
        </header>

        <div className="mb-12">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearchSubmit}
          />
        </div>

        <section className="space-y-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin text-[#62A59D] mb-4" size={40} />
              <p>Carregando...</p>
            </div>
          ) : hasError ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center border border-red-100">
              Erro de conexão com o servidor.
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200 italic text-gray-500">
              Nenhum post encontrado.
            </div>
          ) : (
            <>
              {posts.map((post) => <PostCard key={post.id} post={post} />)}

              {/* USANDO O COMPONENTE NOVO */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={handleNextPage}
                onPrevious={handlePrevPage}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;