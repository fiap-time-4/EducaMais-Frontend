import React from 'react';

interface SearchBarProps {
  value: string; 
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void; 
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); 
    onSearch(); 
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex gap-2 p-2 bg-white border border-gray-200 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
    >
      <div className="relative flex-grow">
        {/* Ícone de lupa (Opcional, mas melhora a UI) */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Buscar posts por título ou conteúdo..."
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-2 text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
        />
      </div>
      
      <button 
        type="submit" 
        className="bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm px-6 py-2 rounded-md transition-colors shadow-sm"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;