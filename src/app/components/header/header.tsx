'use client'
import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  padding: 1rem 2rem;
  width: 100%;
  box-shadow: none;
`;

const HeaderSeparator = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    flex-wrap: nowrap;
  }
`;

const Logo = styled(Link)`
  color: #000000;
  text-decoration: none;
  flex-shrink: 0;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NavButton = styled.button`
  background: #F2994A;
  color: ${props => props.theme.colors.text.inverse};
  padding: 0.625rem 1.25rem;
  border-radius: ${props => props.theme.radii.sm};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
  }
  
  &:hover {
    background: #CA7124;
  }
`;

const NewPostButton = styled(Link)`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text.inverse};
  padding: 0.625rem 1.25rem;
  border-radius: ${props => props.theme.radii.md};
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
    background: ${props => props.theme.colors.primaryDark};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const Header: React.FC = () => {
  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo href="/" className="text-2xl font-bold">EducaMais</Logo>
          <Nav>
            <NewPostButton href="/nova-postagem" className="text-base font-medium md:text-[0.9375rem] sm:text-sm">+ Nova Postagem</NewPostButton>
            <NavButton className="font-medium text-base md:text-[0.9375rem] sm:text-sm">Entrar</NavButton>
          </Nav>
        </HeaderContent>
      </HeaderContainer>
      <HeaderSeparator />
    </>
  );
};

export default Header;