'use client';

import React, { useState } from 'react';
import MarkdownEditor from '../MarkdownEditor';

interface PostFormProps {
  onSubmit: (data: { titulo: string; conteudo: string }) => void;
  isSubmitting: boolean;
  initialData?: { titulo: string; conteudo: string }; // Opcional, para quando for usar na Edição
}

export default function PostForm({ onSubmit, isSubmitting, initialData }: PostFormProps) {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [conteudo, setConteudo] = useState(initialData?.conteudo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !conteudo) {
      alert("Preencha todos os campos");
      return;
    }
    onSubmit({ titulo, conteudo });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow-sm border">
      
      {/* Campo Título */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
          Título do Post
        </label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ex: Como aprender React em 2025"
          disabled={isSubmitting}
        />
      </div>

      {/* Campo Conteúdo (EDITOR DE MARKDOWN) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Conteúdo
        </label>
        {/* Aqui entra nosso editor visual */}
        <MarkdownEditor 
          value={conteudo} 
          onChange={setConteudo} 
        />
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded text-white font-medium transition-colors
            ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {isSubmitting ? 'Salvando...' : 'Publicar Post'}
        </button>
      </div>
    </form>
  );
}