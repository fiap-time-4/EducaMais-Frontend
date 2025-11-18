'use client'
import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.backgroundLight};
  border-top: 1px solid ${props => props.theme.colors.border};
  margin-top: auto;  
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  color: ${props => props.theme.colors.text.secondary};
`;

const FooterLeft = styled.div`
  flex: 1;
  text-align: left;
`;

const FooterCenter = styled.div`
  flex: 1;
  text-align: center;
`;

const FooterRight = styled.div`
  flex: 1;
  text-align: right;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent className="text-sm">
        <FooterLeft>
          <p>Bem-vindo a plataforma EducaMais</p>
        </FooterLeft>
        <FooterCenter>
          <p>© {currentYear} EducaMais. Todos os direitos reservados.</p>
        </FooterCenter>
        <FooterRight>
          <p>Versão 1.0.0</p>
        </FooterRight>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;