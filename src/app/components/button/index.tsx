import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}

const ButtonContainer = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${props => 
    props.variant === 'secondary' 
      ? props.theme.colors.secondary 
      : props.theme.colors.primary};
  color: ${props => props.theme.colors.text.inverse};
  text-align: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.radii.md};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => 
      props.variant === 'secondary' 
        ? props.theme.colors.secondaryDark 
        : '#2563eb'};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  type = 'button' 
}) => {
  return (
    <ButtonContainer variant={variant} onClick={onClick} type={type} className="text-base font-medium">
      {children}
    </ButtonContainer>
  );
};

export default Button;