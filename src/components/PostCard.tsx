import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
}

export default function PostCard({
  post,
  isAdmin = false,
  onDelete,
}: PostCardProps) {
  const postUrl = `/posts/${post.id}`;

  // --- PADRÃO VISUAL (Idêntico ao UserCard) ---
  const roleConfig = {
    TEACHER: {
      label: "Professor",
      style: "text-orange-500 bg-orange-50 border-orange-100",
    },
    STUDENT: {
      label: "Aluno",
      style: "text-blue-500 bg-blue-50 border-blue-100",
    },
    ADMIN: {
      label: "Administrador", // Admin agora é Roxo (Purple), igual na listagem de usuários
      style: "text-purple-500 bg-purple-50 border-purple-100",
    },
  };

  // Verificamos se o cargo existe e pegamos a configuração
  const userRole = post.autor?.appRole as keyof typeof roleConfig | undefined;
  const currentRole = userRole ? roleConfig[userRole] : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Lado Esquerdo: Conteúdo do Post */}
      <div className="flex-1 w-full min-w-0">
        <Link href={postUrl}>
          <h2 className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer mb-2">
            {post.titulo}
          </h2>
        </Link>

        {/* Preview do conteúdo */}
        {!isAdmin && (
          <div className="prose prose-sm text-gray-600 max-w-none line-clamp-2 break-words mb-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.conteudo}
            </ReactMarkdown>
          </div>
        )}

        {/* --- RODAPÉ DO CARD: Autor + Badge Padronizado --- */}
        <div className="flex items-center gap-2 mt-2">

          {/* Renderização do Badge usando o roleConfig */}
          {currentRole && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${currentRole.style}`}
            >
              {currentRole.label}
            </span>
          )}

          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {post.autor?.name || "Desconhecido"}
          </span>

        </div>
      </div>

      {/* Lado Direito: Ações Condicionais */}
      <div className="flex gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
        {isAdmin ? (
          <>
            <Link
              href={`/admin/posts/edit/${post.id}`}
              className="flex-1 text-center text-indigo-600 hover:bg-indigo-50 font-medium text-sm border border-indigo-200 px-4 py-2 rounded transition-all"
            >
              Editar
            </Link>

            <button
              onClick={() => onDelete && onDelete(post.id)}
              className="flex-1 text-center text-red-600 hover:bg-red-50 font-medium text-sm border border-red-200 px-4 py-2 rounded transition-all"
            >
              Excluir
            </button>
          </>
        ) : (
          <Link
            href={postUrl}
            className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-6 py-2 rounded shadow-sm transition-colors"
          >
            Leia Mais
          </Link>
        )}
      </div>
    </div>
  );
}