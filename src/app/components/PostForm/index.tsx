// src/components/PostForm.tsx
"use client";
import React, { useState, useEffect } from "react";

interface PostFormProps {
  initialData?: { titulo: string; conteudo: string }; // Para edição
  onSubmit: (data: { titulo: string; conteudo: string }) => Promise<void>;
  isSubmitting: boolean;
}

export default function PostForm({
  initialData,
  onSubmit,
  isSubmitting,
}: PostFormProps) {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Preenche o form se for edição
  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo || "");
      setConteudo(initialData.conteudo || "");
    }
  }, [initialData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validação Simples
    if (!titulo.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    if (!conteudo.trim() || conteudo.trim().length < 100) {
      setError("O conteúdo é obrigatório e deve ter pelo menos 100 caracteres.");
      return;
    }

    try {
      await onSubmit({ titulo: titulo.trim(), conteudo: conteudo.trim() });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Falha ao salvar o post.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>Erro: {error}</p>}
      <div>
        <label htmlFor="titulo">Título:</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="conteudo">Conteúdo:</label>
        <textarea
          id="conteudo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          disabled={isSubmitting}
          rows={10}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar Post"}
      </button>
    </form>
  );
}
