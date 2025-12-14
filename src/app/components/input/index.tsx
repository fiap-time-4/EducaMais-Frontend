import * as React from "react"
import styled from 'styled-components';

interface InputProps {
  children?: React.ReactNode;
  id: string;
  name: string;
  type?: 'text' | 'password' | 'email';
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const InputContainer = styled.input`
  background-color: ${props => props.theme.colors.searchBackground};
  color: ${props => props.theme.colors.text.primary};
  text-align: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.radii.md};
  transition: background-color 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
`;

const Input: React.FC<InputProps> = ({ 
  children = null,
  id,
  name,
  type = 'text',
  required = true,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
  return (
    <InputContainer
      id={id}
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="text-base font-medium"
    >
      {children}
    </InputContainer>
  );
};

export default Input;
