"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import SearchBar from "./components/SearchBar";
import PostCard from "./components/PostCard";
import { Post, postService } from "./services/postService";

// ----------------------------------------------------
// Componente Principal da Home Page
// ----------------------------------------------------
const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasError, setHasError] = useState(false);

  // ----------------------------------------------------
  // Lógica de Busca de Dados 
  // ----------------------------------------------------
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setHasError(false); 

      try {
        const data = await postService.getAllPosts(1, 20);
        setPosts(data.data);
      } catch (error) {
        console.error("Falha ao carregar posts:", error);
        setHasError(true);
        setPosts([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm]); 

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    console.log(`Busca disparada manualmente para: ${searchTerm}`);
  };

  // ----------------------------------------------------
  // Renderização
  // ----------------------------------------------------
  return (
    <div>
      <Head>
        <title>Home - EducaMais Posts</title>
      </Head>

      {/* <Header /> */}

      <main style={{ padding: "20px" }}>
        <h1>Últimas Notícias e Artigos</h1>

        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          onSearch={handleSearchClick}
        />

        <hr style={{ margin: "30px 0" }} />

        {/* Exibição Condicional dos Posts */}
        <section style={{ display: "grid", gap: "25px" }}>
          {/* Exibição de Loading */}
          {isLoading && <p>Carregando conteúdo, por favor aguarde...</p>}

          {/* Exibição de Erro */}
          {hasError && !isLoading && (
            <p style={{ color: "red" }}>
              Erro ao conectar com o servidor. Tente novamente mais tarde.
            </p>
          )}

          {/* Exibição de "Nenhum resultado" */}
          {!isLoading && !hasError && posts.length === 0 ? (
            <p>Nenhum post encontrado </p>
          ) : (
            // Renderização da Lista de Posts
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post} 
              />
            ))
          )}
        </section>
      </main>

      {/* <Footer /> */}

    </div>
  );
};

export default Home;
