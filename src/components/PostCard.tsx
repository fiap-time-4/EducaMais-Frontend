import React from 'react';
import Link from 'next/link';
import { Post } from '../services/postService'; 

// ----------------------------------------------------
// Interface das Props
// O PostCard precisa receber o objeto Post completo
// ----------------------------------------------------
interface PostCardProps {
  post: Post;
}

// ----------------------------------------------------
// Componente PostCard
// ----------------------------------------------------
const PostCard: React.FC<PostCardProps> = ({ post }) => {
  
  // URL dinâmica para a página de leitura: /posts/1, /posts/2, etc.
  const postUrl = `/posts/${post.id}`;

  return (
    // Esqueleto sem estilização complexa (Foco na estrutura JSX)
    <div 
      // Estilos temporários para visualização
      style={{ 
        border: '1px solid #ddd', 
        padding: '20px', 
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.05)',
      }}
    >
      
      {/* O título deve ser um link para a página de detalhes */}
      <Link href={postUrl} passHref>
        <h2 
          // Estilos temporários para indicar que é clicável
          style={{ 
            color: '#007bff', 
            cursor: 'pointer', 
            marginBottom: '10px',
            fontSize: '1.5em'
          }}
        >
          {post.title}
        </h2>
      </Link>
      
      {/* Resumo do Conteúdo */}
      <p style={{ color: '#555', marginBottom: '15px' }}>
        {post.summary}
      </p>

      {/* Metadados */}
      <small style={{ display: 'block', color: '#888' }}>
        Autor: **{post.author}**
      </small>

      {/* Opcional: Um botão de "Leia Mais" */}
      <Link href={postUrl} passHref>
        <button
          style={{ 
            marginTop: '15px', 
            padding: '8px 15px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Leia Mais
        </button>
      </Link>
    </div>
  );
};

export default PostCard;