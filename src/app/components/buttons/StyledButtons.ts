// src/app/components/StyledButtons.ts
"use client";

import styled from "styled-components";

export const PrimaryButton = styled.span`
  background: ${(props) => props.theme.colors?.primary || "#f2994a"};
  color: ${(props) => props.theme.colors?.text?.inverse || "#ffffff"};
  padding: 0.625rem 1.25rem;
  border-radius: ${(props) => props.theme.radii?.md || "0.375rem"};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
  }

  &:hover {
    background: ${(props) => props.theme.colors?.primaryDark || "#ca7124"};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  /* 1. Inverte as cores para o estilo Outline */
  background: transparent;
  color: ${(props) => props.theme.colors?.primary || "#f2994a"};
  border: 1px solid ${(props) => props.theme.colors?.primary || "#f2994a"};

  /* 2. Ajusta o Hover */
  &:hover {
    background: ${(props) => props.theme.colors?.primary || "#f2994a"}1a; /* 10% opacity */
    color: ${(props) => props.theme.colors?.primaryDark || "#ca7124"};
    border-color: ${(props) => props.theme.colors?.primaryDark || "#ca7124"};
  }
`;

export const TerciaryButton = styled.span`
  background: #f2994a;
  color: #fff;
  padding: 0.625rem 1.25rem;
  border-radius: 4px; /* Ajustei para valor fixo se o theme falhar */
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
  }

  &:hover {
    background: #ca7124;
  }
`;