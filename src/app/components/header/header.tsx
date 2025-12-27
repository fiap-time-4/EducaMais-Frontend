'use client'
import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { authClient } from '@/app/services/authClient';

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

const Logo = styled.span`
  color: #000000;
  text-decoration: none;
  flex-shrink: 0;
  cursor: pointer;
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

const NavButton = styled.span`
  background: #F2994A;
  color: ${props => props.theme.colors.text.inverse};
  padding: 0.625rem 1.25rem;
  border-radius: ${props => props.theme.radii.sm};
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
    background: #CA7124;
  }
`;

// Criei um botão secundário para o "Sair" para não ficar igual ao principal,
// mas você pode usar o NavButton se preferir tudo laranja.
const LogoutButton = styled(NavButton)`
  background: transparent;
  color: #F2994A;
  border: 1px solid #F2994A;

  &:hover {
    background: #FFF5EE;
  }
`;

const NewPostButton = styled.span`
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
  // Hook do better-auth para pegar a sessão
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/'); // Redireciona para home após sair
  };

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Link href="/">
            <Logo className="text-2xl font-bold">EducaMais</Logo>
          </Link>

          <Nav>
            <Link href="/admin/create">
              <NewPostButton className="text-base font-medium md:text-[0.9375rem] sm:text-sm">
                + Nova Postagem
              </NewPostButton>
            </Link>

            {/* LÓGICA CONDICIONAL AQUI */}
            {session ? (
              // Se TEM sessão (logado):
              <>
                <Link href="/admin/dashboard">
                  <NavButton className="font-medium text-base md:text-[0.9375rem] sm:text-sm">
                    Painel Administrativo
                  </NavButton>
                </Link>
                
                <LogoutButton 
                  onClick={handleLogout}
                  className="font-medium text-base md:text-[0.9375rem] sm:text-sm"
                >
                  Sair
                </LogoutButton>
              </>
            ) : (
              // Se NÃO tem sessão (deslogado):
              <Link href="/admin/signin">
                <NavButton className="font-medium text-base md:text-[0.9375rem] sm:text-sm">
                  Entrar
                </NavButton>
              </Link>
            )}

          </Nav>
        </HeaderContent>
      </HeaderContainer>
      <HeaderSeparator />
    </>
  );
};

export default Header;