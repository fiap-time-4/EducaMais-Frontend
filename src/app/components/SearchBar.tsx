import React from 'react';

// ----------------------------------------------------
// Interface das Props
// Define as propriedades que o componente receberá do 'index.tsx'
// ----------------------------------------------------
interface SearchBarProps {
  // Valor atual do campo de busca
  value: string; 
  // Função chamada quando o texto no input muda
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Função chamada quando o botão de busca é clicado (ou o formulário é submetido)
  onSearch: () => void; 
}

// ----------------------------------------------------
// Componente SearchBar
// ----------------------------------------------------
const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); 
    onSearch(); 
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', padding: '10px', border: '1px solid #ccc' }}>
      
      {/* Esqueleto do Input de Busca */}
      <input
        type="text"
        placeholder="Buscar posts por título ou conteúdo..."
        value={value}
        onChange={onChange}
        // Como o Pacote 1 (UI) ainda está em andamento, use estilos inline temporários:
        style={{ flexGrow: 1, padding: '8px', border: '1px solid #ddd' }}
      />
      
      {/* Esqueleto do Botão de Busca */}
      <button 
        type="submit" 
        // Como o Pacote 1 (UI) ainda está em andamento, use estilos inline temporários:
        style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Buscar
      </button>

    </form>
  );
};

export default SearchBar;