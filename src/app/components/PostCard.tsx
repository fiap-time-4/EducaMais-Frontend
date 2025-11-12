import React from "react";
import Link from "next/link";
import { Post } from "../services/postService";

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
  
  const postUrl = `/posts/${post.id}`;

  return (
    <div
      // Estilos temporários para visualização
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.05)",
      }}
    >
      <Link href={postUrl} >
        <h2
          // Estilos temporários para indicar que é clicável
          style={{
            color: "#007bff",
            cursor: "pointer",
            marginBottom: "10px",
            fontSize: "1.5em",
          }}
        >
          {post.titulo}
        </h2>
      </Link>

      <p style={{ color: "#555", marginBottom: "15px" }}>{post.conteudo}</p>

      <small style={{ display: "block", color: "#888" }}>
        Autor: **{post.autorId}**
      </small>

      <Link href={postUrl}>
        <button
          style={{
            marginTop: "15px",
            padding: "8px 15px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
          }}
        >
          Leia Mais
        </button>
      </Link>
    </div>
  );
};

export default PostCard;
