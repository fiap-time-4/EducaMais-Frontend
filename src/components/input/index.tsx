import React, { useState } from "react";
import styled from 'styled-components';
// Certifique-se de ter instalado: npm install lucide-react
import { Eye, EyeOff } from "lucide-react"; 

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// 1. Wrapper para posicionar o botão "flutuando" dentro do input
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

// 2. O Input em si (agora aceita uma prop transiente $hasIcon)
const InputStyled = styled.input<{ $hasIcon?: boolean }>`
  background-color: ${props => props.theme.colors.searchBackground};
  color: ${props => props.theme.colors.text.primary};
  text-align: left;
  padding: 0.75rem 1.5rem;
  
  /* PULO DO GATO: Se for senha, damos espaço extra na direita pro ícone não cobrir o texto */
  padding-right: ${props => props.$hasIcon ? '3rem' : '1.5rem'};
  
  border: none;
  border-radius: ${props => props.theme.radii.md};
  transition: background-color 0.2s;
  width: 100%;
  
  &:active, &:focus {
    transform: scale(0.98);
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary || '#ccc'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// 3. Botão do ícone (invisível visualmente, só mostra o ícone)
const ToggleButton = styled.button`
  position: absolute;
  right: 10px; /* Distância da direita */
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text.primary || '#888'};
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Input: React.FC<InputProps> = ({ className, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Verificamos se o tipo original passado é "password"
  const isPassword = type === 'password';

  return (
    // Passamos o className pro Wrapper pra garantir que margens/tamanho funcionem
    <InputWrapper className={className}>
      <InputStyled
        {...props}
        // Lógica automática:
        // Se não for senha, usa o tipo original.
        // Se for senha, alterna entre 'text' e 'password' baseado no estado.
        type={isPassword ? (showPassword ? 'text' : 'password') : type}
        $hasIcon={isPassword}
      />
      
      {/* Se for senha, renderizamos o botão automaticamente */}
      {isPassword && (
        <ToggleButton 
          type="button" // Importante para não dar submit no form
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1} // Opcional: evita que o Tab pare no ícone
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </ToggleButton>
      )}
    </InputWrapper>
  );
};

export default Input;