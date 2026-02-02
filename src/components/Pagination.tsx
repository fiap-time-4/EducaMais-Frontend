"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SecondaryButton } from "./buttons/StyledButtons"; // Ajuste o caminho se necessário

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
}: PaginationProps) {
  
  // REMOVI A LINHA: if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;
  const hasMultiplePages = totalPages > 1;

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      {/* Botão Anterior: Só aparece se tiver mais de 1 página */}
      {hasMultiplePages && (
        <SecondaryButton
          onClick={onPrevious}
          style={{ 
            opacity: isFirstPage ? 0.5 : 1, 
            pointerEvents: isFirstPage ? 'none' : 'auto' 
          }}
        >
          <ChevronLeft size={16} /> Anterior
        </SecondaryButton>
      )}

      {/* Texto Central: Aparece sempre */}
      <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
        Página {currentPage} de {totalPages}
      </span>

      {/* Botão Próxima: Só aparece se tiver mais de 1 página */}
      {hasMultiplePages && (
        <SecondaryButton
          onClick={onNext}
          style={{ 
            opacity: isLastPage ? 0.5 : 1, 
            pointerEvents: isLastPage ? 'none' : 'auto' 
          }}
        >
          Próxima <ChevronRight size={16} />
        </SecondaryButton>
      )}
    </div>
  );
}