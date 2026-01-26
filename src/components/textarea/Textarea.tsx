import React, { TextareaHTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
  }
`;

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export const Textarea: React.FC<TextareaProps> = (props) => {
  return <StyledTextarea {...props} />;
};