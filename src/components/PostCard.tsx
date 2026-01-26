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

const PostCard: React.FC<PostCardProps> = ({
  post,
  isAdmin = false,
  onDelete,
}) => {
  const postUrl = `/posts/${post.id}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Lado Esquerdo: Conteúdo do Post */}
      <div className="flex-1 w-full min-w-0"> {/* min-w-0 é CRUCIAL para o truncate funcionar em flexbox */}
        <Link href={postUrl}>
          <h2 className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition-colors cursor-pointer mb-2">
            {post.titulo}
          </h2>
        </Link>

        {/* Preview do conteúdo */}
        {/* line-clamp-2: Limita a 2 linhas */}
        {/* break-words: Quebra palavras gigantes (AlinhamentoAlinhamento...) */}
        {!isAdmin && (
          <div className="prose prose-sm text-gray-600 max-w-none line-clamp-2 break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.conteudo}
            </ReactMarkdown>
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Autor: {post.autor?.name || "Desconhecido"}
          </span>
        </div>
      </div>

      {/* Lado Direito: Ações Condicionais */}
      <div className="flex gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
        {isAdmin ? (
          <>
            <Link
              href={`/admin/edit/${post.id}`}
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
};

export default PostCard;