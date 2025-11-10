import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// --- Importações de Componentes ---

import SearchBar from '../components/SearchBar';
import PostCard from '../components/PostCard';


// --- Importações da Lógica de Dados ---
// Importa a função de busca e a interface Post
import { getPosts, Post } from '../services/postService'; 

// ----------------------------------------------------
// Componente Principal da Home Page
// ----------------------------------------------------
const Home: React.FC = () => {
  
  // Estados para gerenciar a aplicação
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasError, setHasError] = useState(false);

  // ----------------------------------------------------
  // Lógica de Busca de Dados (chamada à API)
  // ----------------------------------------------------
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setHasError(false); // Reseta o estado de erro

      try {
        // Chama a função de serviço real, passando o termo de busca
        const data = await getPosts(searchTerm); 
        setPosts(data);
      } catch (error) {
        console.error("Falha ao carregar posts:", error);
        setHasError(true);
        setPosts([]); // Limpa a lista em caso de falha grave
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm]); // Re-executa sempre que o 'searchTerm' muda

  // Handler para atualizar o estado de busca no input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handler para disparar a busca (necessário para o formulário da SearchBar)
  const handleSearchClick = () => {
    // Como o useEffect já observa 'searchTerm', esta função pode ficar simples
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

      <main style={{ padding: '20px' }}>

        <h1>Últimas Notícias e Artigos</h1>
        
        {/* 2. SearchBar (Pacote 2) */}
        <SearchBar 
          value={searchTerm}
          onChange={handleSearchChange}
          onSearch={handleSearchClick}
        />

        <hr style={{ margin: '30px 0' }} />

        {/* 3. Exibição Condicional dos Posts */}
        <section style={{ display: 'grid', gap: '25px' }}>
          
          {/* A. Exibição de Loading */}
          {isLoading && (
            <p>Carregando conteúdo, por favor aguarde...</p>
          )}

          {/* B. Exibição de Erro */}
          {hasError && !isLoading && (
            <p style={{ color: 'red' }}>Erro ao conectar com o servidor. Tente novamente mais tarde.</p>
          )}
          
          {/* C. Exibição de "Nenhum resultado" */}
          {!isLoading && !hasError && posts.length === 0 ? (
            <p>Nenhum post encontrado </p>
          ) : (
            
            // D. Renderização da Lista de Posts
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} // Passa o objeto PostCard completo como prop
              />
            ))
          )}
        </section>
      </main>

    </div>
  );
};

export default Home;