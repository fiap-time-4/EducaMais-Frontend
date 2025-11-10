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
  
  // Função que lida com o envio do formulário (para capturar o Enter)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Impede o recarregamento da página
    onSearch(); // Chama a função passada pelo componente pai (Home Page)
  };

  return (
    // Usa a tag <form> para que a submissão (pressionar Enter) funcione
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', padding: '10px', border: '1px solid #ccc' }}>
      
      {/* Esqueleto do Input de Busca */}
      <input
        type="text"
        placeholder="Buscar posts por título ou conteúdo..."
        value={value}
        onChange={onChange} // Passa a função de atualização de estado do componente pai
        // Como o Pacote 1 (UI) ainda está em andamento, use estilos inline temporários:
        style={{ flexGrow: 1, padding: '8px', border: '1px solid #ddd' }}
      />
      
      {/* Esqueleto do Botão de Busca */}
      <button 
        type="submit" // Type 'submit' dispara o onSubmit do formulário
        // Como o Pacote 1 (UI) ainda está em andamento, use estilos inline temporários:
        style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Buscar
      </button>

      {/* Observação: Adicione um botão de "Limpar Busca" se fizer sentido para UX */}
    </form>
  );
};

export default SearchBar;